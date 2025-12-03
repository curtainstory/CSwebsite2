import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react";

export default function AdminCatalogues({ onBack }) {
  const [catalogues, setCatalogues] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", image_url: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageMode, setImageMode] = useState("upload"); // "upload" | "link"

  // 🔹 Fetch catalogues
  useEffect(() => {
    fetchCatalogues();
  }, []);

  const fetchCatalogues = async () => {
    const { data, error } = await supabase
      .from("catalogues")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error loading catalogues:", error);
    else setCatalogues(data || []);
    setLoading(false);
  };

  // 🔹 Handle image upload to Supabase
  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(true);

      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("catalogue-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("catalogue-images")
        .getPublicUrl(fileName);

      setForm((prev) => ({ ...prev, image_url: urlData.publicUrl }));
    } catch (error) {
      console.error("Upload failed:", error.message);
      alert("❌ Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Save / Update Catalogue
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.image_url) {
      alert("Name and image are required!");
      return;
    }

    try {
      const payload = {
        name: form.name,
        description: form.description,
        image_url: form.image_url,
      };

      if (editing) {
        const { error } = await supabase
          .from("catalogues")
          .update(payload)
          .eq("id", editing.id);

        if (error) throw error;
        alert("✅ Catalogue updated successfully!");
      } else {
        const { error } = await supabase.from("catalogues").insert(payload);
        if (error) throw error;
        alert("✅ Catalogue added successfully!");
      }

      setForm({ name: "", description: "", image_url: "" });
      setEditing(null);
      fetchCatalogues();
    } catch (error) {
      console.error("Save failed:", error.message);
      alert("❌ " + error.message);
    }
  };

  // 🔹 Delete Catalogue
  const handleDelete = async (id) => {
    if (!window.confirm("🗑️ Delete this catalogue?")) return;

    try {
      setDeletingId(id);
      const { error } = await supabase.from("catalogues").delete().eq("id", id);

      if (error) {
        console.error("Supabase delete error:", error.message);
        alert("❌ Delete failed: " + error.message);
        return;
      }

      setCatalogues((prev) => prev.filter((c) => c.id !== id));
      alert("✅ Catalogue deleted successfully!");
    } catch (err) {
      console.error("Unexpected delete error:", err);
      alert("❌ Something went wrong while deleting.");
    } finally {
      setDeletingId(null);
    }
  };

  // 🔹 Edit Mode
  const handleEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      description: cat.description,
      image_url: cat.image_url,
    });
  };

  if (loading)
    return <div className="text-center text-gray-500 py-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Catalogues</h1>
        <button
          onClick={onBack}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSave}
        className="bg-white shadow border rounded-lg p-6 mb-10"
      >
        <h2 className="text-lg font-semibold mb-4">
          {editing ? "Edit Catalogue" : "Add New Catalogue"}
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Catalogue Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border rounded-md w-full p-2 focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Modern Curtains"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="border rounded-md w-full p-2 focus:ring-1 focus:ring-indigo-500"
              placeholder="Short description"
            />
          </div>
        </div>

        {/* Image Section */}
        <div className="mt-6">
          <label className="block text-sm text-gray-700 mb-2">
            Catalogue Image
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
              {form.image_url ? (
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-28 h-20 rounded-md object-cover border"
                />
              ) : (
                <div className="w-28 h-20 border border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 text-sm">
                  <ImageIcon className="h-5 w-5" />
                </div>
              )}

              <label className="cursor-pointer bg-indigo-50 text-indigo-700 px-4 py-2 rounded border border-indigo-200 hover:bg-indigo-100">
                <Upload className="h-4 w-4 inline mr-2" />
                {uploading ? "Uploading..." : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
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
                  value={form.image_url}
                  onChange={(e) =>
                    setForm({ ...form, image_url: e.target.value })
                  }
                  className="border rounded-md p-2 flex-grow"
                />
              </div>
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-32 h-24 object-cover rounded border"
                />
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({ name: "", description: "", image_url: "" });
              }}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer"
          >
            {editing ? "Update Catalogue" : "Add Catalogue"}
          </button>
        </div>
      </form>

      {/* Catalogue List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogues.map((cat) => (
          <div
            key={cat.id}
            className="border rounded-lg shadow-sm bg-white hover:shadow-md transition p-4 relative cursor-pointer"
          >
            <img
              src={
                cat.image_url ||
                "https://via.placeholder.com/400x250?text=No+Image"
              }
              alt={cat.name}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h3 className="font-semibold text-lg text-gray-900">{cat.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {cat.description || "No description"}
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => handleEdit(cat)}
                className="text-indigo-600 hover:underline cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className={`text-red-600 hover:underline cursor-pointer ${
                  deletingId === cat.id ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {deletingId === cat.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
