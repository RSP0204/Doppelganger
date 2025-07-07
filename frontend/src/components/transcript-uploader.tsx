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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileDrop = (droppedFile: File) => {
    console.log('File dropped:', droppedFile.name);
    setFile(droppedFile);
  };

  const handleSubmit = async () => {
    if (!file || !role) {
      alert('Please select a file and a role.');
      console.log('File or role not selected. File:', file, 'Role:', role);
      return;
    }

    console.log('Submitting with file:', file.name, 'and role:', role);

    setIsLoading(true); // Set loading to true

    const reader = new FileReader();
    reader.onload = async (e) => {
      const transcriptText = e.target?.result as string;

      try {
        console.log('Sending transcript to backend:', { transcript: transcriptText.substring(0, 100) + '...', role });
        const res = await fetch('/process-transcript', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transcript: transcriptText, role }),
        });

        if (res.ok) {
          const data = await res.json();
          console.log('Backend response received:', data);
          if (data) {
            const dialogues = Array.isArray(data.generated_dialogues) ? data.generated_dialogues : [];
            setGeneratedDialogues(dialogues);
            console.log('Generated dialogues set:', dialogues.length, 'items');
          } else {
            setGeneratedDialogues([]);
            console.log('No data received from backend.');
          }
          setShowResults(true);
          console.log('Showing results.');
        } else {
          console.error('File upload failed with status:', res.status, res.statusText);
          setShowResults(false);
          console.log('Not showing results.');
        }
      } catch (error) {
        console.error('An error occurred during transcript processing:', error);
        setShowResults(false);
        console.log('Not showing results due to error.');
      } finally {
        setIsLoading(false); // Set loading to false regardless of success or failure
        console.log('Loading state set to false.');
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
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Upload and Process'}
        </Button>
      </div>
      {showResults && generatedDialogues && Array.isArray(generatedDialogues) && generatedDialogues.length > 0 && (
        <ResultsDisplay generatedDialogues={generatedDialogues} />
      )}
    </div>
  );
}