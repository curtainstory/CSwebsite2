import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Upload,
  Link as LinkIcon,
  Edit3,
  Trash2,
  Save,
  Image as ImageIcon,
  ArrowLeft,
} from "lucide-react";

export default function AdminCategories({ onBack }) {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageMode, setImageMode] = useState("upload"); // "upload" | "link"

  // 🧩 Fetch all categories
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) console.error("Error loading categories:", error);
    else setCategories(data || []);
  }

  // 🧩 Handle image upload to Supabase storage
  async function handleImageUpload(e) {
    try {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(true);

      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("category-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("category-images")
        .getPublicUrl(fileName);

      setFormData({ ...formData, image_url: urlData.publicUrl });
    } catch (error) {
      console.error("Upload failed:", error.message);
      alert("❌ Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  // 🧩 Save (Insert or Update)
  async function handleSave(e) {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("⚠️ Category name is required!");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
      };

      if (editing) {
        const { error } = await supabase
          .from("categories")
          .update(payload)
          .eq("id", editing.id);
        if (error) throw error;
        alert("✅ Category updated successfully!");
      } else {
        const { error } = await supabase.from("categories").insert(payload);
        if (error) throw error;
        alert("✅ Category added successfully!");
      }

      setFormData({ name: "", slug: "", description: "", image_url: "" });
      setEditing(null);
      fetchCategories();
    } catch (error) {
      console.error("Save failed:", error.message);
      alert("❌ Failed to save category.");
    } finally {
      setSaving(false);
    }
  }

  // 🧩 Delete
  async function handleDelete(id) {
    if (!window.confirm("🗑️ Are you sure you want to delete this category?"))
      return;

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      alert("❌ Failed to delete category: " + error.message);
      console.error(error);
    } else {
      alert("✅ Category deleted successfully!");
      fetchCategories();
    }
  }

  // 🧩 Edit
  function handleEdit(cat) {
    setEditing(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image_url: cat.image_url,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto bg-white border rounded-2xl shadow-md p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Categories
          </h1>
          <button
            onClick={onBack}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSave}
          className="bg-gray-50 border rounded-xl p-6 mb-12 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editing ? "✏️ Edit Category" : "➕ Add New Category"}
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Stitch Curtain"
                className="border rounded-md w-full p-2 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Short description"
                className="border rounded-md w-full p-2 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Image Upload / Link Section */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Category Image
              </label>

              {/* Toggle Mode */}
              <div className="flex items-center gap-3 mb-3">
                <label className="text-sm font-medium text-gray-700">
                  Mode:
                </label>
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
                <div className="flex items-center gap-4 flex-wrap">
                  {formData.image_url ? (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-36 h-24 rounded-md object-cover border"
                    />
                  ) : (
                    <div className="w-36 h-24 border border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}

                  <label className="cursor-pointer flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200 hover:bg-indigo-100 transition">
                    <Upload className="h-4 w-4 mr-2" />
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

              {/* Link Mode */}
              {imageMode === "link" && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-gray-500" />
                    <input
                      type="url"
                      placeholder="Paste image link (https://...)"
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                      className="border rounded-md p-2 flex-grow"
                    />
                  </div>
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-36 h-24 object-cover rounded border"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setFormData({
                    name: "",
                    slug: "",
                    description: "",
                    image_url: "",
                  });
                }}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : editing ? "Update" : "Add Category"}
            </button>
          </div>
        </form>

        {/* Category Cards */}
        {categories.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No categories found. Add one above.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="border rounded-lg bg-white shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 p-4"
              >
                <img
                  src={
                    cat.image_url ||
                    "https://via.placeholder.com/400x250?text=No+Image"
                  }
                  alt={cat.name}
                  className="w-full h-44 object-cover rounded-md mb-4"
                />
                <h3 className="font-semibold text-lg text-gray-900">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {cat.description || "No description provided."}
                </p>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="flex items-center px-3 py-1.5 border rounded text-indigo-600 hover:bg-indigo-50 transition"
                  >
                    <Edit3 className="h-4 w-4 mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="flex items-center px-3 py-1.5 border rounded text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
