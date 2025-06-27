import React, { useCallback, useState } from "react";
import { UploadCloudIcon, XCircleIcon } from "./IconComponents";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  imagePreviewUrl: string | null;
  onClearImage: () => void;
  disabled?: boolean;
}

export const ImageUploader = ({
  onImageSelect,
  imagePreviewUrl,
  onClearImage,
  disabled,
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        onImageSelect(event.target.files[0]);
      }
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      if (disabled) return;
      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        onImageSelect(event.dataTransfer.files[0]);
      }
    },
    [onImageSelect, disabled]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (disabled) return;
      setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (disabled) return;
      setIsDragging(false);
    },
    [disabled]
  );

  if (imagePreviewUrl) {
    return (
      <div className="relative group">
        <img
          src={imagePreviewUrl}
          alt="Plant preview"
          className="w-full h-auto max-h-96 object-contain rounded-lg shadow-lg border-2 border-primary"
        />
        {!disabled && (
          <button
            onClick={onClearImage}
            className="absolute top-2 right-2 bg-neutral-800 bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Clear image"
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
        )}
      </div>
    );
  }

  return (
    <label
      htmlFor="image-upload"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        flex flex-col items-center justify-center w-full h-64 
        border-2 border-dashed rounded-lg cursor-pointer
        transition-colors duration-200 ease-in-out
        ${
          isDragging
            ? "border-primary bg-green-50"
            : "border-neutral-300 hover:border-neutral-400"
        }
        ${
          disabled
            ? "bg-neutral-200 opacity-70 cursor-not-allowed"
            : "bg-neutral-50 hover:bg-neutral-100"
        }
      `}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
        <UploadCloudIcon
          className={`w-12 h-12 mb-3 ${
            isDragging ? "text-primary" : "text-neutral-500"
          }`}
        />
        <p
          className={`mb-2 text-sm ${
            isDragging ? "text-primary" : "text-neutral-500"
          }`}
        >
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        <p className="text-xs text-neutral-400">PNG, JPG, GIF up to 10MB</p>
      </div>
      <input
        id="image-upload"
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/gif"
        onChange={handleFileChange}
        disabled={disabled}
      />
    </label>
  );
};
