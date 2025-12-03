import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ImageUploader({ value, onChange, bucket = "home-sections" }) {
  const [mode, setMode] = useState("upload"); // upload | link
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileName = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from(bucket).upload(fileName, file);
      if (error) throw error;

      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      onChange(data.publicUrl);
    } catch (err) {
      alert("❌ Upload failed: " + err.message);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Toggle mode */}
      <div className="flex gap-3 items-center">
        <label className="font-medium text-sm text-gray-700">Image Source:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="upload">Upload File</option>
          <option value="link">Paste URL</option>
        </select>
      </div>

      {/* File Upload */}
      {mode === "upload" && (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="border rounded p-2 w-full text-sm cursor-pointer"
          />
          {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
        </div>
      )}

      {/* URL Input */}
      {mode === "link" && (
        <input
          type="url"
          placeholder="Paste an image link (https://...)"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="border w-full p-2 rounded text-sm"
        />
      )}

      {/* Preview */}
      {value && (
        <div className="mt-2">
          <img
            src={value}
            alt="Preview"
            className="h-40 w-auto rounded-md border object-cover"
          />
        </div>
      )}
    </div>
  );
}
