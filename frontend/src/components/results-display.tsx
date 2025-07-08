'use client';

export default function ResultsDisplay({ generatedDialogues }: { generatedDialogues: any[] }) {
  return (
    <div className="p-4 border rounded-lg w-full">
      <h2 className="text-xl font-semibold mb-4 text-left">Analysis Results</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-left">Generated Dialogues:</h3>
          {generatedDialogues.map((dialogue, index) => {
            // Assuming each dialogue is now a JSON object like { "questions": ["Q1", "Q2"] }
            const questions = dialogue.questions || [];
            if (questions.length === 0) {
              return null; // Don't render if there are no questions
            }
            return (
              <div key={index} className="mb-6 p-4 border rounded-md bg-gray-50">
                <h4 className="text-lg font-bold text-blue-700 mb-2">Suggested Questions:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {questions.map((question: string, qIndex: number) => (
                    <li key={qIndex}>
                      <span className="font-medium">{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}