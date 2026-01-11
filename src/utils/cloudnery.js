import { toast } from "react-toastify"

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET




/**
 * Determine Cloudinary resource type based on file MIME type
 * @param {File} file - File object
 * @returns {string} - Cloudinary resource type
 */
const getResourceType = (file) => {
  const type = file.type;
  
  if (type.startsWith('image/')) {
    return 'image';
  } else if (type.startsWith('video/')) {
    return 'video';
  } else {
    return 'raw'; // For documents and other files
  }
};

/**
 * Upload file to Cloudinary
 * @param {File} file - File to upload
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<Object>} - Upload result with URL and metadata
 */
export const uploadToCloudinary = async (file, folder = "general") => {
  if (!file) throw new Error("No file provided")

  console.log("cloudname", CLOUD_NAME)
  console.log("upload", UPLOAD_PRESET)
  
  const resourceType = getResourceType(file);
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", UPLOAD_PRESET)
  formData.append("folder", folder)

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    )

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Cloudinary error:", errorData);
      throw new Error(errorData.error?.message || "Upload failed");
    }

    const data = await res.json()

    // Return comprehensive data
    return {
      url: data.secure_url,
      publicId: data.public_id,
      format: data.format,
      resourceType: data.resource_type,
      bytes: data.bytes,
      // Calculate human-readable size
      size: formatFileSize(data.bytes)
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    toast.error("File upload failed: " + error.message)
    throw error
  }
}

/**
 * Format bytes to human-readable size
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted size string
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
