import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowUp,
  faTrash,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  isCloudinaryConfigured,
  uploadToCloudinary,
} from "./lib/cloudinary";
import "./PosterImageUpload.css";

type Props = {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
};

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function PosterImageUpload({ value, onChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>("");
  const configured = isCloudinaryConfigured();

  const handlePick = () => inputRef.current?.click();

  const handleFile = async (file: File) => {
    setError("");

    if (!ALLOWED.includes(file.type)) {
      setError("Please choose a JPEG, PNG, WebP or GIF image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be 5MB or smaller.");
      return;
    }

    try {
      setUploading(true);
      setProgress(0);
      const result = await uploadToCloudinary(file, setProgress);
      onChange(result.secure_url);
    } catch (e: any) {
      setError(e?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    // Allow picking the same file twice in a row.
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled || uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemove = () => {
    onChange("");
    setError("");
  };

  return (
    <div className="poster-upload">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onInputChange}
        hidden
      />

      {value ? (
        <div className="poster-upload-preview">
          <img src={value} alt="Poster preview" />
          <div className="poster-upload-actions">
            <button
              type="button"
              className="poster-upload-btn ghost"
              onClick={handlePick}
              disabled={disabled || uploading}
            >
              <FontAwesomeIcon icon={faRotate} /> Replace
            </button>
            <button
              type="button"
              className="poster-upload-btn danger"
              onClick={handleRemove}
              disabled={disabled || uploading}
            >
              <FontAwesomeIcon icon={faTrash} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`poster-upload-drop ${uploading ? "uploading" : ""}`}
          onClick={handlePick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handlePick();
            }
          }}
        >
          <FontAwesomeIcon icon={faCloudArrowUp} className="poster-upload-icon" />
          <p className="poster-upload-title">
            {uploading ? "Uploading…" : "Click or drop an image here"}
          </p>
          <p className="poster-upload-hint">
            JPG, PNG, WebP or GIF · up to 5MB
          </p>
        </div>
      )}

      {uploading && (
        <div className="poster-upload-progress" aria-label="Upload progress">
          <div
            className="poster-upload-progress-fill"
            style={{ width: `${progress}%` }}
          />
          <span className="poster-upload-progress-text">{progress}%</span>
        </div>
      )}

      {error && <p className="poster-upload-error">{error}</p>}

      {!configured && (
        <p className="poster-upload-warning">
          Cloudinary isn’t configured. Set{" "}
          <code>VITE_CLOUDINARY_CLOUD_NAME</code> and{" "}
          <code>VITE_CLOUDINARY_UPLOAD_PRESET</code> in{" "}
          <code>Frontend/.env</code> (see <code>.env.example</code>).
        </p>
      )}
    </div>
  );
}

export default PosterImageUpload;
