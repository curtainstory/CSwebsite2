import React, { useState } from "react";
import { uploadToSupabase } from "../utils/uploadToSupabase";

export default function HeaderForm({ initialData = {}, onSave, onCancel }) {
  const [header, setHeader] = useState({
    name: "",
    description: "",
    stitching_price: "",
    image_url: "",
    ...initialData,
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setHeader({ ...header, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const { url, error } = await uploadToSupabase(file);
    if (error) {
      alert("Upload failed: " + error);
      setUploading(false);
      return;
    }

    setHeader({ ...header, image_url: url });
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!header.name || !header.stitching_price) {
      alert("Please fill all required fields.");
      return;
    }
    onSave(header);
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md border p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {header.id ? "Edit Header Style" : "Add New Header Style"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={header.name}
            onChange={handleChange}
            placeholder="e.g. Ring Top"
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={header.description}
            onChange={handleChange}
            rows="3"
            placeholder="Short description of the header style..."
            className="w-full border rounded p-2"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stitching Price (₹) *
          </label>
          <input
            type="number"
            name="stitching_price"
            value={header.stitching_price}
            onChange={handleChange}
            required
            placeholder="e.g. 120"
            className="w-full border rounded p-2"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Header Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="block w-full border p-2 rounded"
          />
          {uploading && (
            <p className="text-sm text-gray-500 mt-1">Uploading...</p>
          )}
          {header.image_url && (
            <img
              src={header.image_url}
              alt="Header preview"
              className="h-32 mt-2 rounded object-cover border"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
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
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
