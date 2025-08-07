'use client';

import { useState, useEffect, useCallback } from 'react';
import Loader from './loader';
import mammoth from 'mammoth';

const LOCAL_STORAGE_TRANSCRIPT_KEY_PREFIX = 'uploadedTranscript_';
const LOCAL_STORAGE_FILE_NAME_KEY_PREFIX = 'uploadedFileName_';
const LOCAL_STORAGE_DIALOGUES_KEY_PREFIX = 'generatedDialogues_';
const LOCAL_STORAGE_ROLE_KEY_PREFIX = 'selectedRole_';
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
  setGeneratedDialogues: (dialogues: any[]) => void;
  setShowResults: (show: boolean) => void;
  setFileName: (name: string | null) => void;
  setFileContent: (content: string | null) => void;
  fileContent: string | null;
  userId: string | null;
}

export default function TranscriptUploader({ setGeneratedDialogues, setShowResults, setFileName, setFileContent, fileContent, userId }: TranscriptUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) return; // Don't load if no user is logged in

    const userSpecificDialoguesKey = `${LOCAL_STORAGE_DIALOGUES_KEY_PREFIX}${userId}`;
    const userSpecificFileNameKey = `${LOCAL_STORAGE_FILE_NAME_KEY_PREFIX}${userId}`;
    const userSpecificTranscriptKey = `${LOCAL_STORAGE_TRANSCRIPT_KEY_PREFIX}${userId}`;
    const userSpecificRoleKey = `${LOCAL_STORAGE_ROLE_KEY_PREFIX}${userId}`;

    const savedDialogues = localStorage.getItem(userSpecificDialoguesKey);
    const savedFileName = localStorage.getItem(userSpecificFileNameKey);
    const savedTranscript = localStorage.getItem(userSpecificTranscriptKey);
    const savedRole = localStorage.getItem(userSpecificRoleKey);

    if (savedDialogues) {
      setGeneratedDialogues(JSON.parse(savedDialogues));
      setShowResults(true);
    } else {
      setGeneratedDialogues([]);
      setShowResults(false);
    }
    if (savedFileName && savedTranscript) {
      const blob = new Blob([savedTranscript], { type: 'text/plain' });
      const file = new File([blob], savedFileName, { type: 'text/plain' });
      setFile(file);
      setFileName(savedFileName);
      setFileContent(savedTranscript);
    }
    if (savedRole) {
      setRole(savedRole);
    }
  }, [userId, setGeneratedDialogues, setShowResults, setFileName, setFileContent]);

  useEffect(() => {
    if (role && userId) {
      localStorage.setItem(`${LOCAL_STORAGE_ROLE_KEY_PREFIX}${userId}`, role);
    }
  }, [role, userId]);

  const handleFileDrop = useCallback((droppedFile: File) => {
    if (!userId) return; // Cannot save without a user ID

    console.log('File dropped:', droppedFile.name);
    setFile(droppedFile);
    setFileName(droppedFile.name);

    if (droppedFile.type.startsWith('audio/')) {
      setFileContent('Audio file loaded: ' + droppedFile.name);
    } else if (droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        try {
          const result = await mammoth.extractRawText({ arrayBuffer });
          setFileContent(result.value);
          localStorage.setItem(`${LOCAL_STORAGE_TRANSCRIPT_KEY_PREFIX}${userId}`, result.value);
          localStorage.setItem(`${LOCAL_STORAGE_FILE_NAME_KEY_PREFIX}${userId}`, droppedFile.name);
          localStorage.removeItem(`${LOCAL_STORAGE_DIALOGUES_KEY_PREFIX}${userId}`);
          setGeneratedDialogues([]);
          setShowResults(false);
        } catch (error) {
          console.error('Error reading .docx file:', error);
          setFileContent('Error reading .docx file.');
        }
      };
      reader.readAsArrayBuffer(droppedFile);
    } else if (droppedFile.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContent(content);
        localStorage.setItem(`${LOCAL_STORAGE_TRANSCRIPT_KEY_PREFIX}${userId}`, content);
        localStorage.setItem(`${LOCAL_STORAGE_FILE_NAME_KEY_PREFIX}${userId}`, droppedFile.name);
        localStorage.removeItem(`${LOCAL_STORAGE_DIALOGUES_KEY_PREFIX}${userId}`);
        setGeneratedDialogues([]);
        setShowResults(false);
      };
      reader.readAsText(droppedFile);
    } else {
      // Fallback for other file types, though they may not be processable
      setFileContent(`Unsupported file type: ${droppedFile.type}`);
    }
  }, [setFileName, setFileContent, setGeneratedDialogues, setShowResults, userId]);

  const handleFileRemove = useCallback(() => {
    if (!userId) return;

    setFile(null);
    setFileName(null);
    setFileContent(null);
    setRole('');

    localStorage.removeItem(`${LOCAL_STORAGE_TRANSCRIPT_KEY_PREFIX}${userId}`);
    localStorage.removeItem(`${LOCAL_STORAGE_FILE_NAME_KEY_PREFIX}${userId}`);
    localStorage.removeItem(`${LOCAL_STORAGE_DIALOGUES_KEY_PREFIX}${userId}`);
    localStorage.removeItem(`${LOCAL_STORAGE_ROLE_KEY_PREFIX}${userId}`);

    setGeneratedDialogues([]);
    setShowResults(false);
  }, [userId, setFileName, setFileContent, setGeneratedDialogues, setShowResults]);

  const handleSubmit = async () => {
    if (!file || !role || !userId) {
      alert('Please select a file, a role, and ensure you are logged in.');
      console.log('File, role, or userId not selected. File:', file, 'Role:', role, 'UserId:', userId);
      return;
    }

    console.log('Submitting with file:', file.name, 'and role:', role);

    setIsLoading(true); // Set loading to true

    if (file.type.startsWith('audio/')) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('role', role);

      // Log FormData contents for debugging
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

        const res = await fetch('/process-audio', {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data) {
            const dialogues = Array.isArray(data.generated_dialogues) ? data.generated_dialogues : [];
            setGeneratedDialogues(dialogues);
            localStorage.setItem(`${LOCAL_STORAGE_DIALOGUES_KEY_PREFIX}${userId}`, JSON.stringify(dialogues));
          } else {
            setGeneratedDialogues([]);
          }
          setShowResults(true);
        } else {
          setShowResults(false);
        }
      } catch (error) {
        console.error('An error occurred during audio processing:', error);
        setShowResults(false);
      } finally {
        setIsLoading(false);
      }
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('role', role);

        try {
            const res = await fetch('/process-document', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                const taskId = data.task_id;

                const poll = async () => {
                    const statusRes = await fetch(`/status/${taskId}`);
                    const statusData = await statusRes.json();

                    if (statusData.status === 'completed') {
                        const dialogues = Array.isArray(statusData.result.generated_dialogues) ? statusData.result.generated_dialogues : [];
                        setGeneratedDialogues(dialogues);
                        localStorage.setItem(`${LOCAL_STORAGE_DIALOGUES_KEY_PREFIX}${userId}`, JSON.stringify(dialogues));
                        setShowResults(true);
                        setIsLoading(false);
                    } else if (statusData.status === 'failed') {
                        console.error('An error occurred during document processing:', statusData.error);
                        setShowResults(false);
                        setIsLoading(false);
                    } else {
                        setTimeout(poll, 5000);
                    }
                };

                poll();
            } else {
                setShowResults(false);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('An error occurred during document processing:', error);
            setShowResults(false);
            setIsLoading(false);
        }
    } else {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const transcriptText = e.target?.result as string;

        try {
          console.log('Sending transcript to backend:', { transcript: transcriptText.substring(0, 100) + '...', role });
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

          const res = await fetch('/process-transcript', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transcript: transcriptText, role }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            console.log('Backend response received:', data);
            if (data) {
              const dialogues = Array.isArray(data.generated_dialogues) ? data.generated_dialogues : [];
              setGeneratedDialogues(dialogues);
              localStorage.setItem(`${LOCAL_STORAGE_DIALOGUES_KEY_PREFIX}${userId}`, JSON.stringify(dialogues));
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
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 border rounded-lg w-full flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Upload Transcript</h2>
      <div className="space-y-4 w-full flex flex-col items-center">
        <Dropzone onFileDrop={handleFileDrop} onFileRemove={handleFileRemove} fileName={file?.name || null} />
        {fileContent && (
          <div className="w-full">
            <label className="text-sm font-medium">File Content:</label>
            <textarea
              className="w-full p-2 border rounded-md bg-gray-100 text-gray-800 custom-scrollbar"
              rows={10}
              readOnly
              value={fileContent}
            />
          </div>
        )}
        <div>
          <label className="text-sm font-medium">Act as:</label>
          <Select onValueChange={setRole} value={role}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business-analyst">Business Analyst</SelectItem>
              <SelectItem value="startup-founder">Startup Founder</SelectItem>
              <SelectItem value="investor">Investor</SelectItem>
              <SelectItem value="interviewer">Interviewer</SelectItem>
              <SelectItem value="friend">Friend</SelectItem>
              <SelectItem value="tech-lead">Tech Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Loader /> : 'Upload and Process'}
        </Button>
      </div>
      {/* Removed ResultsDisplay from here */}
    </div>
  );
}