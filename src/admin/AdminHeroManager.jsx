import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Upload,
  Save,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";

export default function AdminHeroManager({ onBack }) {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 🧠 Fetch hero section
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const { data, error } = await supabase
          .from("home_sections")
          .select("*")
          .eq("section_name", "hero")
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setHero(data);
        } else {
          // Create default record if missing
          const defaultHero = {
            section_name: "hero",
            title: "Your Vision, Our Stitch.",
            subtitle: "Custom Curtains Made for You.",
            description:
              "Experience the luxury of perfectly fitted window treatments.",
            image_url: "",
          };
          const { error: insertError } = await supabase
            .from("home_sections")
            .insert([defaultHero]);
          if (insertError) throw insertError;
          setHero(defaultHero);
        }
      } catch (err) {
        console.error("Error fetching hero section:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  // 📸 Handle Image Upload
  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `hero_${Date.now()}.${fileExt}`;
      const filePath = `hero/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("public-assets")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("public-assets").getPublicUrl(filePath);

      // Update DB + local state
      const { error: updateError } = await supabase
        .from("home_sections")
        .update({ image_url: publicUrl })
        .eq("section_name", "hero");

      if (updateError) throw updateError;

      setHero((prev) => ({ ...prev, image_url: publicUrl }));

      alert("✅ Image uploaded and saved successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Failed to upload image: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // 🌐 Handle external image URL input
  const handleExternalImage = async (url) => {
    try {
      setHero((prev) => ({ ...prev, image_url: url }));
      const { error } = await supabase
        .from("home_sections")
        .update({ image_url: url })
        .eq("section_name", "hero");
      if (error) throw error;
    } catch (err) {
      console.error("Error saving external image URL:", err);
    }
  };

  // 💾 Save Hero Data
  const handleSave = async () => {
    if (!hero) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("home_sections")
        .update({
          title: hero.title,
          subtitle: hero.subtitle,
          description: hero.description,
          image_url: hero.image_url,
        })
        .eq("section_name", "hero");

      if (error) throw error;
      alert("✅ Hero section updated successfully!");
    } catch (err) {
      console.error("Error updating hero:", err);
      alert("❌ Failed to update hero section.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading Hero Section...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 border">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Hero Section
          </h1>
        </div>

        {/* Image Preview */}
        <div className="mb-6">
          <div className="relative w-full aspect-[16/7] bg-gray-100 border rounded-lg overflow-hidden flex items-center justify-center">
            {hero?.image_url ? (
              <img
                src={hero.image_url}
                alt="Hero Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <ImageIcon className="w-10 h-10 mb-2" />
                No image uploaded
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <Loader2 className="animate-spin h-6 w-6 text-indigo-600" />
              </div>
            )}
          </div>

          {/* Upload + External URL */}
          <div className="mt-4 space-y-3">
            {/* Upload from Device */}
            <label className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md cursor-pointer hover:bg-indigo-100 transition">
              <Upload className="w-4 h-4 mr-2" /> Upload New Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Or paste external URL */}
            <div className="flex items-center gap-2">
              <div className="flex items-center w-full border rounded-md px-2 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500">
                <LinkIcon className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="url"
                  placeholder="Or paste image URL (https://...)"
                  value={hero?.image_url || ""}
                  onChange={(e) => handleExternalImage(e.target.value)}
                  className="flex-1 outline-none text-sm text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Text Fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={hero?.title || ""}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter hero title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={hero?.subtitle || ""}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter hero subtitle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={hero?.description || ""}
              onChange={(e) =>
                setHero({ ...hero, description: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter a short description for the hero section"
            ></textarea>
          </div>
        </div>

        {/* Save */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-60 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
