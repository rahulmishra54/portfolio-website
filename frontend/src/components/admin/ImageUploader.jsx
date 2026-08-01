import React, { useRef, useState } from 'react';
import { ImageIcon, UploadCloud, MoveVertical } from 'lucide-react';
import api from '../../services/api';
import UploadProgress from './UploadProgress';
import ImagePreview from './ImagePreview';

const VALID_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function ImageUploader({
  label = 'Upload image',
  description = '',
  value,
  onChange,
  multiple = false,
  maxFiles = 8,
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const currentUrls = multiple
    ? Array.isArray(value)
      ? value
      : []
    : value
    ? [value]
    : [];

  const handleFiles = async (files) => {
    if (!files || !files.length) return;

    const items = Array.from(files);

    if (!multiple && items.length > 1) {
      setError('Please select only one image.');
      return;
    }

    if (multiple && currentUrls.length + items.length > maxFiles) {
      setError(`You can upload up to ${maxFiles} images.`);
      return;
    }

    for (const file of items) {
      if (!VALID_IMAGE_TYPES.includes(file.type)) {
        setError('Only JPG, PNG, WEBP, GIF and SVG formats are allowed.');
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setError('Each image must be smaller than 5 MB.');
        return;
      }
    }

    const formData = new FormData();
    items.forEach((file) => formData.append('file', file));

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const response = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        },
      });

      const urls = Array.isArray(response.data.urls) ? response.data.urls : [];
      if (!urls.length) {
        throw new Error('Upload did not return a usable image URL.');
      }

      if (multiple) {
        onChange([...currentUrls, ...urls]);
      } else {
        onChange(urls[0]);
      }
    } catch (uploadError) {
      setError(uploadError.message || 'Unable to upload images.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleInputChange = (event) => {
    handleFiles(event.target.files);
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files.length) {
      handleFiles(event.dataTransfer.files);
    }
  };

  const removeImage = (index) => {
    if (multiple) {
      const next = [...currentUrls];
      next.splice(index, 1);
      onChange(next);
    } else {
      onChange('');
    }
  };

  const moveImage = (fromIndex, toIndex) => {
    const next = [...currentUrls];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onChange(next);
  };

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData('text/plain', String(index));
  };

  const handleDropReorder = (event, index) => {
    event.preventDefault();
    const sourceIndex = Number(event.dataTransfer.getData('text/plain'));
    if (!Number.isNaN(sourceIndex) && sourceIndex !== index) {
      moveImage(sourceIndex, index);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-100">{label}</p>
          {description ? <p className="mt-1 text-sm text-slate-400">{description}</p> : null}
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          <UploadCloud className="h-4 w-4" />
          {currentUrls.length ? 'Replace image' : 'Upload image'}
        </button>
      </div>

      <div
        className="group relative rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-8 text-center transition hover:border-slate-500"
        onDrop={handleDrop}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'copy';
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.gif,.svg"
          multiple={multiple}
          className="hidden"
          onChange={handleInputChange}
        />
        <div className="mx-auto max-w-xs space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-800 text-sky-400">
            <ImageIcon className="h-8 w-8" />
          </div>
          <p className="text-sm text-slate-400">
            Drag & drop {multiple ? 'images' : 'an image'} here, or click to choose.
          </p>
          <p className="text-xs text-slate-500">Supported formats: JPG, PNG, WEBP, GIF, SVG. Max 5 MB each.</p>
        </div>
      </div>

      {uploading && <UploadProgress progress={progress} />}
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {currentUrls.length > 0 ? (
        <div className={`grid gap-3 ${multiple ? 'grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
          {currentUrls.map((src, index) => (
            <ImagePreview
              key={`${src}-${index}`}
              src={src}
              alt={`Uploaded image ${index + 1}`}
              onRemove={() => removeImage(index)}
              draggable={multiple}
              onDragStart={(event) => handleDragStart(event, index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDropReorder(event, index)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
