// Browser-side Cloudinary uploader using an *unsigned* upload preset.
// Docs: https://cloudinary.com/documentation/upload_images#unsigned_upload
//
// Configure these in Frontend/.env (or .env.local) — see .env.example.

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as
  | string
  | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as
  | string
  | undefined;
const FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER as string | undefined;

export type CloudinaryUpload = {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
};

export const isCloudinaryConfigured = () =>
  Boolean(CLOUD_NAME && UPLOAD_PRESET) &&
  CLOUD_NAME !== "your_cloud_name" &&
  UPLOAD_PRESET !== "your_unsigned_upload_preset";

/**
 * Uploads a single image File to Cloudinary using an unsigned preset.
 * Reports upload progress (0–100) via the optional callback.
 */
export const uploadToCloudinary = (
  file: File,
  onProgress?: (percent: number) => void,
): Promise<CloudinaryUpload> => {
  if (!isCloudinaryConfigured()) {
    return Promise.reject(
      new Error(
        "Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME " +
          "and VITE_CLOUDINARY_UPLOAD_PRESET in Frontend/.env (see .env.example).",
      ),
    );
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET as string);
  if (FOLDER) form.append("folder", FOLDER);

  // We use XMLHttpRequest (not fetch) so we can report upload progress.
  return new Promise<CloudinaryUpload>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onerror = () => reject(new Error("Network error while uploading."));
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data as CloudinaryUpload);
        } else {
          reject(
            new Error(
              data?.error?.message ||
                `Cloudinary upload failed (${xhr.status})`,
            ),
          );
        }
      } catch {
        reject(new Error("Invalid response from Cloudinary."));
      }
    };

    xhr.send(form);
  });
};
