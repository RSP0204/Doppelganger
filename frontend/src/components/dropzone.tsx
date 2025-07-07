'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

interface DropzoneProps {
  onFileDrop: (file: File) => void;
}

export default function Dropzone({ onFileDrop }: DropzoneProps) {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const acceptedFile = acceptedFiles[0];
      setFile(acceptedFile);
      onFileDrop(acceptedFile);
    }
  }, [onFileDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer ${
        isDragActive ? 'border-primary' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
      {file ? (
        <p className="mt-2">Selected file: {file.name}</p>
      ) : (
        <p className="mt-2">Drag & drop a file here, or click to select a file</p>
      )}
      <p className="text-xs text-gray-500 mt-1">Supported file types: PDF, DOC, DOCX, TXT</p>
    </div>
  );
}
