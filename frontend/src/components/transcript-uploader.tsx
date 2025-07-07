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
import ResultsDisplay from './results-display';

export default function TranscriptUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState<string>('');
  const [generatedDialogues, setGeneratedDialogues] = useState<string[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleFileDrop = (droppedFile: File) => {
    setFile(droppedFile);
  };

  const handleSubmit = async () => {
    if (!file || !role) {
      alert('Please select a file and a role.');
      
return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const transcriptText = e.target?.result as string;

      const res = await fetch('/api/process-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: transcriptText, role }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data) {
          setGeneratedDialogues(Array.isArray(data.generated_dialogues) ? data.generated_dialogues : []);
        } else {
          setGeneratedDialogues([]);
        }
        setShowResults(true);
      } else {
        console.error('File upload failed');
        setShowResults(false);
      }
    };
    reader.readAsText(file);
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
      {showResults && generatedDialogues && Array.isArray(generatedDialogues) && generatedDialogues.length > 0 && (
        <ResultsDisplay generatedDialogues={generatedDialogues} />
      )}
    </div>
  );
}