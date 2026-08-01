import React from 'react';
import { Trash2 } from 'lucide-react';

export default function ImagePreview({ src, alt, onRemove, draggable, onDragStart, onDragOver, onDrop }) {
  return (
    <div
      draggable={draggable}
      onDragStart={draggable ? onDragStart : undefined}
      onDragOver={draggable ? onDragOver : undefined}
      onDrop={draggable ? onDrop : undefined}
      className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950"
    >
      <img src={src} alt={alt} className="h-48 w-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/80 text-slate-100 opacity-0 transition group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      {draggable ? (
        <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/80 text-slate-100 opacity-0 transition group-hover:opacity-100">
          <MoveVertical className="h-4 w-4" />
        </div>
      ) : null}
    </div>
  );
}
