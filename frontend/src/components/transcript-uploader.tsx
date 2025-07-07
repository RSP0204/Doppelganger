'use client';

import { useState } from 'react';
import { Button } from '@/registry/new-york-v4/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/new-york-v4/ui/select';
import Dropzone from './dropzone';

export default function TranscriptUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState<string>('');

  const handleFileDrop = (droppedFile: File) => {
    setFile(droppedFile);
  };

  const handleSubmit = async () => {
    if (!file || !role) {
      alert('Please select a file and a role.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('role', role);

    const res = await fetch('/api/upload-transcript', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data.message);
    } else {
      console.error('File upload failed');
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Upload Transcript</h2>
      <div className="space-y-4">
        <Dropzone onFileDrop={handleFileDrop} />
        <Select onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="business-analyst">Business Analyst</SelectItem>
            <SelectItem value="startup-founder">Startup Founder</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSubmit}>Upload and Process</Button>
      </div>
    </div>
  );
}
