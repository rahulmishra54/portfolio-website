import React from 'react';
import { FileText, Trash2, Download } from 'lucide-react';

export default function FilePreview({ fileName, url, size, uploadedAt, onRemove }) {
  const formattedSize = size ? `${(size / 1024).toFixed(1)} KB` : 'Unknown size';
  const formattedDate = uploadedAt ? new Date(uploadedAt).toLocaleDateString() : null;

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-sky-400">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-slate-100">{fileName}</p>
          <p className="text-sm text-slate-500">{formattedSize}{formattedDate ? ` · ${formattedDate}` : ''}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800">
          <Download className="h-4 w-4" />
          Download
        </a>
        <button type="button" onClick={onRemove} className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-200 transition hover:bg-rose-500/10">
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
