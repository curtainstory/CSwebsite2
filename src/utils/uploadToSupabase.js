import { supabase } from "../supabaseClient";

/**
 * Uploads a file to Supabase Storage and returns its public URL.
 *
 * @param {File} file - The file to upload.
 * @param {string} bucketName - Supabase bucket name (default: "fabric-images").
 * @param {boolean} overwrite - Whether to overwrite an existing file (default: false).
 * @returns {Promise<{ url: string|null, error: string|null }>}
 */
export async function uploadToSupabase(file, bucketName = "fabric-images", overwrite = false) {
  if (!file) return { url: null, error: "No file selected" };

  try {
    const fileName = `${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: overwrite,
        contentType: file.type,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return { url: null, error: error.message };
    }

    const { data: publicData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    if (!publicData?.publicUrl) {
      return { url: null, error: "Failed to get public URL" };
    }

    return { url: publicData.publicUrl, error: null };
  } catch (err) {
    console.error("Unexpected upload error:", err);
    return { url: null, error: err.message || "Unexpected error" };
  }
}
