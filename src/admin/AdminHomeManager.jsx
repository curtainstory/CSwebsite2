import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Upload, Trash2, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

export default function AdminHomeManager({ onBack }) {
  const [curatedItems, setCuratedItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [formData, setFormData] = useState({
    section_name: "curated",
    title: "",
    description: "",
    image_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageMode, setImageMode] = useState("upload"); // "upload" | "link"

  useEffect(() => {
    fetchAllItems();
  }, []);

  async function fetchAllItems() {
    try {
      const [{ data: curatedData }, { data: featuredData }] = await Promise.all([
        supabase.from("home_curated").select("*").order("created_at", { ascending: false }),
        supabase.from("home_featured").select("*").order("created_at", { ascending: false }),
      ]);

      setCuratedItems(curatedData || []);
      setFeaturedItems(featuredData || []);
    } catch (error) {
      console.error("Error fetching home items:", error);
    }
  }

  // 🔹 Upload image to Supabase storage
  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("home-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("home-images")
        .getPublicUrl(fileName);

      setFormData({ ...formData, image_url: publicUrlData.publicUrl });
    } catch (err) {
      alert("❌ Upload failed: " + err.message);
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  // 🔹 Save new curated/featured item
  async function handleSave(e) {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image_url) {
      alert("Please enter a title and image!");
      return;
    }

    setSaving(true);
    try {
      const tableName =
        formData.section_name === "curated" ? "home_curated" : "home_featured";

      const { error } = await supabase.from(tableName).insert({
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url,
      });

      if (error) throw error;

      alert("✅ Saved successfully!");
      setFormData({
        section_name: formData.section_name,
        title: "",
        description: "",
        image_url: "",
      });
      fetchAllItems();
    } catch (err) {
      console.error("Error saving:", err);
      alert("❌ Failed to save!");
    } finally {
      setSaving(false);
    }
  }

  // 🔹 Delete item
  async function handleDelete(id, section) {
    if (!window.confirm("🗑️ Delete this item?")) return;

    const tableName = section === "curated" ? "home_curated" : "home_featured";
    const { error } = await supabase.from(tableName).delete().eq("id", id);

    if (error) alert("Delete failed: " + error.message);
    else {
      alert("✅ Deleted!");
      fetchAllItems();
    }
  }

  // 🧩 Helper to render grid cards
  const renderGrid = (items, sectionLabel, sectionName) => (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">{sectionLabel}</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">No items added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="h-40 w-full object-cover rounded mb-3"
              />
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
              <button
                onClick={() => handleDelete(item.id, sectionName)}
                className="mt-3 text-red-600 hover:underline cursor-pointer flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white border rounded-xl shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Home Page</h1>
        <button
          onClick={onBack}
          className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSave}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10"
      >
        {/* Section Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Section
          </label>
          <select
            value={formData.section_name}
            onChange={(e) =>
              setFormData({ ...formData, section_name: e.target.value })
            }
            className="w-full border rounded-md p-2"
          >
            <option value="curated">Our Curated Collection</option>
            <option value="featured">Featured Fabrics</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full border rounded-md p-2"
            placeholder="e.g. Luxury Drapes"
          />
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows="3"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border rounded-md p-2"
            placeholder="Short description"
          />
        </div>

        {/* Image Upload */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>

          {/* Toggle between upload/link */}
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

          {/* Upload Image */}
          {imageMode === "upload" && (
            <div className="flex items-center gap-4">
              {formData.image_url ? (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-24 h-20 rounded-md object-cover border"
                />
              ) : (
                <div className="w-24 h-20 border border-dashed rounded-md flex items-center justify-center text-gray-400">
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

          {/* Paste URL */}
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
                  className="w-32 h-24 object-cover rounded border"
                />
              )}
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="sm:col-span-2 mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 cursor-pointer"
        >
          {saving ? "Saving..." : "Save Item"}
        </button>
      </form>

      {/* Existing Items */}
      {renderGrid(curatedItems, "Our Curated Collection", "curated")}
      {renderGrid(featuredItems, "Featured Fabrics", "featured")}
    </div>
  );
}
