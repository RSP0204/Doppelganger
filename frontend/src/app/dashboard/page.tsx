'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import TranscriptUploader from '@/components/transcript-uploader';
import ResultsDisplay from '@/components/results-display';

export default function DashboardPage() {
  const { isAuthenticated, loading, userId } = useAuth();
  const router = useRouter();
  const [generatedDialogues, setGeneratedDialogues] = useState<string[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col items-center dashboard-background">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="md:col-span-1 flex justify-center">
          <TranscriptUploader
            setGeneratedDialogues={setGeneratedDialogues}
            setShowResults={setShowResults}
            setFileName={setFileName}
            setFileContent={setFileContent}
            fileContent={fileContent}
            userId={userId}
          />
        </div>
        <div className="md:col-span-2">
          {showResults && generatedDialogues && Array.isArray(generatedDialogues) && generatedDialogues.length > 0 && (
            <>
              {console.log("Rendering ResultsDisplay. showResults:", showResults, "generatedDialogues length:", generatedDialogues.length)}
              <ResultsDisplay generatedDialogues={generatedDialogues} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
