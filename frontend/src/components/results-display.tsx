'use client';

export default function ResultsDisplay({ generatedDialogues }: { generatedDialogues: string[] }) {
  return (
    <div className="p-4 border rounded-lg mt-4">
      <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Generated Dialogues:</h3>
          <ul className="list-disc list-inside">
            {generatedDialogues.map((dialogue, index) => (
              <li key={index}>{dialogue}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
