'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

interface DropzoneProps {
  onFileDrop: (file: File) => void;
  onFileRemove: () => void;
  fileName: string | null;
}

export default function Dropzone({ onFileDrop, onFileRemove, fileName }: DropzoneProps) {

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const acceptedFile = acceptedFiles[0];
      onFileDrop(acceptedFile);
    }
  }, [onFileDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'audio/wav': ['.wav'],
      'audio/flac': ['.flac'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileRemove();
  };

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer ${
        isDragActive ? 'border-primary' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
      {fileName ? (
        <div>
          <p className="mt-2">Selected file: {fileName}</p>
          <button
            onClick={handleRemove}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Remove
          </button>
        </div>
      ) : (
        <p className="mt-2">Drag & drop a .txt, .wav, .flac, or .docx file here, or click to select a file</p>
      )}
      <p className="text-xs text-gray-500 mt-1">Supported file types: TXT, WAV, FLAC, DOCX</p>
    </div>
  );
}
