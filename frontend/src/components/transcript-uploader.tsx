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

export default function TranscriptUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || !role) {
      alert('Please select a file and a role.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('role', role);

    // In a real application, you would send this to the /api/upload-transcript endpoint
    console.log('Uploading transcript...', { file, role });
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Upload Transcript</h2>
      <div className="space-y-4">
        <input type="file" onChange={handleFileChange} />
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
