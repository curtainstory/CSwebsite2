import React, { useState } from "react";
import { Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { uploadToSupabase } from "../utils/uploadToSupabase";

export default function FabricForm({ initialData = {}, catalogues = [], onSave, onCancel }) {
  const [fabric, setFabric] = useState({
    name: "",
    description: "",
    price_per_meter: "",
    category: "",
    image_url: "",
    catalogue_id: "",
    ...initialData,
  });

  const [uploading, setUploading] = useState(false);
  const [imageMode, setImageMode] = useState("upload"); // "upload" | "link"

  // 🔹 Handle input change
  const handleChange = (e) => {
    setFabric({ ...fabric, [e.target.name]: e.target.value });
  };

  // 🔹 Handle file upload
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const { url, error } = await uploadToSupabase(file, "fabric-images");
    if (error) {
      alert("❌ Upload failed: " + error);
      setUploading(false);
      return;
    }

    setFabric((prev) => ({ ...prev, image_url: url }));
    setUploading(false);
  };

  // 🔹 Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanFabric = Object.fromEntries(
      Object.entries(fabric).filter(([_, v]) => v !== "")
    );
    onSave(cleanFabric);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border max-w-lg mx-auto">
      <h3 className="text-lg font-bold mb-4 text-gray-800">
        {fabric.id ? "Edit Fabric" : "Add New Fabric"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Fabric Name"
          value={fabric.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={fabric.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="price_per_meter"
          placeholder="Price per meter (₹)"
          value={fabric.price_per_meter}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <select
          name="category"
          value={fabric.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="Curtain">Curtain</option>
          <option value="Sofa">Sofa</option>
        </select>

        <select
          name="catalogue_id"
          value={fabric.catalogue_id || ""}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="">Select Catalogue</option>
          {catalogues.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* ===================== Image Section ===================== */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fabric Image
          </label>

          {/* Mode Toggle */}
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm font-medium text-gray-700">Mode:</label>
            <select
              value={imageMode}
              onChange={(e) => setImageMode(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="upload">Upload File</option>
              <option value="link">Use Image URL</option>
            </select>
          </div>

          {/* Upload Mode */}
          {imageMode === "upload" && (
            <div className="flex items-center gap-4">
              {fabric.image_url ? (
                <img
                  src={fabric.image_url}
                  alt="Preview"
                  className="h-24 w-32 object-cover rounded-md border"
                />
              ) : (
                <div className="w-32 h-24 border border-dashed rounded-md flex items-center justify-center text-gray-400">
                  <ImageIcon className="h-6 w-6" />
                </div>
              )}

              <label className="cursor-pointer bg-indigo-50 text-indigo-700 px-4 py-2 rounded border border-indigo-200 hover:bg-indigo-100 transition">
                <Upload className="h-4 w-4 mr-2 inline" />
                {uploading ? "Uploading..." : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* URL Mode */}
          {imageMode === "link" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-gray-500" />
                <input
                  type="url"
                  placeholder="Paste image link (https://...)"
                  value={fabric.image_url}
                  onChange={(e) =>
                    setFabric({ ...fabric, image_url: e.target.value })
                  }
                  className="border rounded-md p-2 flex-grow"
                />
              </div>
              {fabric.image_url && (
                <img
                  src={fabric.image_url}
                  alt="Preview"
                  className="w-32 h-24 object-cover rounded border"
                />
              )}
            </div>
          )}
        </div>

        {/* ===================== Buttons ===================== */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {fabric.id ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
