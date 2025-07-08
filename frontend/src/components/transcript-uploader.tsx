
'use client';

import { useState, useEffect, useCallback } from 'react';

const LOCAL_STORAGE_TRANSCRIPT_KEY = 'uploadedTranscript';
const LOCAL_STORAGE_FILE_NAME_KEY = 'uploadedFileName';
const LOCAL_STORAGE_DIALOGUES_KEY = 'generatedDialogues';
import { Button } from '@/registry/new-york-v4/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/new-york-v4/ui/select';
import Dropzone from './dropzone';

//following is the structure for transcript uploder props
interface TranscriptUploaderProps {
  setGeneratedDialogues: (dialogues: string[]) => void;
  setShowResults: (show: boolean) => void;
  setFileName: (name: string | null) => void;
  setFileContent: (content: string | null) => void;
  fileContent: string | null;
}

export default function TranscriptUploader({ setGeneratedDialogues, setShowResults, setFileName, setFileContent, fileContent }: TranscriptUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedDialogues = localStorage.getItem(LOCAL_STORAGE_DIALOGUES_KEY);
    const savedFileName = localStorage.getItem(LOCAL_STORAGE_FILE_NAME_KEY);
    const savedTranscript = localStorage.getItem(LOCAL_STORAGE_TRANSCRIPT_KEY);

    if (savedDialogues) {
      setGeneratedDialogues(JSON.parse(savedDialogues));
      setShowResults(true);
    }
    if (savedFileName) {
      setFileName(savedFileName);
    }
    if (savedTranscript) {
      setFileContent(savedTranscript);
    }
  }, [setGeneratedDialogues, setShowResults, setFileName, setFileContent]);

  const handleFileDrop = useCallback((droppedFile: File) => {
    console.log('File dropped:', droppedFile.name);
    setFile(droppedFile);
    setFileName(droppedFile.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      localStorage.setItem(LOCAL_STORAGE_TRANSCRIPT_KEY, content);
      localStorage.setItem(LOCAL_STORAGE_FILE_NAME_KEY, droppedFile.name);
      // Clear previous results when a new file is dropped
      localStorage.removeItem(LOCAL_STORAGE_DIALOGUES_KEY);
      setGeneratedDialogues([]);
      setShowResults(false);
    };
    reader.readAsText(droppedFile);
  }, [setFileName, setFileContent, setGeneratedDialogues, setShowResults]);

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
            localStorage.setItem(LOCAL_STORAGE_DIALOGUES_KEY, JSON.stringify(dialogues));
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
    <div className="p-4 border rounded-lg w-full flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Upload Transcript</h2>
      <div className="space-y-4 w-full flex flex-col items-center">
        <Dropzone onFileDrop={handleFileDrop} fileName={file?.name || null} />
        {fileContent && (
          <div className="w-full">
            <label className="text-sm font-medium">File Content:</label>
            <textarea
              className="w-full p-2 border rounded-md bg-gray-100 text-gray-800"
              rows={10}
              readOnly
              value={fileContent}
            />
          </div>
        )}
        <div>
          <label className="text-sm font-medium">Act as:</label>
          <Select onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business-analyst">Business Analyst</SelectItem>
              <SelectItem value="startup-founder">Startup Founder</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Upload and Process'}
        </Button>
      </div>
      {/* Removed ResultsDisplay from here */}
    </div>
  );
}