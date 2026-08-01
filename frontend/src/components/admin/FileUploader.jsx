import React, { useRef, useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import api from '../../services/api';
import UploadProgress from './UploadProgress';
import FilePreview from './FilePreview';

export default function FileUploader({
  label = 'Upload file',
  description = '',
  value,
  onChange,
  uploadPath,
  accept = '.pdf',
  allowedTypes = ['application/pdf'],
  maxSize = 10 * 1024 * 1024,
  buttonLabel = 'Upload file',
  onDelete,
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const fileUrl = typeof value === 'string' ? value : value?.url;
  const fileName = typeof value === 'string'
    ? value?.split('/').pop()
    : value?.filename || value?.url?.split('/').pop() || null;
  const fileSize = typeof value === 'string' ? 0 : value?.size || 0;
  const uploadedAt = typeof value === 'string' ? null : value?.uploadedAt || null;

  const handleFile = async (file) => {
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF files are allowed.');
      return;
    }

    if (file.size > maxSize) {
      setError('File must be smaller than 10 MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const response = await api.post(uploadPath, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        },
      });

      const payload = response.data || {};
      const url = payload.url;
      if (!url) {
        throw new Error('Upload did not return a usable file URL.');
      }

      onChange({
        url,
        filename: payload.filename || file.name,
        size: payload.size || file.size,
      });
    } catch (uploadError) {
      setError(uploadError.message || 'Unable to upload file.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleInputChange = (event) => {
    handleFile(event.target.files?.[0]);
    event.target.value = '';
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
          {buttonLabel}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
      />

      {uploading && <UploadProgress progress={progress} />}
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {value ? (
        <FilePreview
          fileName={fileName || 'Resume.pdf'}
          url={fileUrl}
          size={fileSize}
          uploadedAt={uploadedAt}
          onRemove={() => {
            onChange('');
            if (onDelete) onDelete();
          }}
        />
      ) : null}
    </div>
  );
}
