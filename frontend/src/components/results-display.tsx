'use client';

export default function ResultsDisplay({ generatedDialogues }: { generatedDialogues: any[] }) {
  console.log('ResultsDisplay received generatedDialogues:', generatedDialogues);

  return (
    <div className="p-4 border rounded-lg w-full">
      <h2 className="text-xl font-semibold mb-4 text-left">Analysis Results</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-left">Generated Dialogues:</h3>
          {generatedDialogues.map((dialogue, index) => {
            let questions: string[] = [];

            if (typeof dialogue === 'string') {
              questions = [dialogue];
            } else if (dialogue && dialogue.questions && Array.isArray(dialogue.questions)) {
              questions = dialogue.questions;
            } else if (dialogue && typeof dialogue.text === 'string') {
              try {
                const parsed = JSON.parse(dialogue.text);
                if (parsed && parsed.questions && Array.isArray(parsed.questions)) {
                  questions = parsed.questions;
                }
              } catch (e) {
                questions = [dialogue.text];
              }
            } else if (typeof dialogue === 'object' && dialogue !== null) {
                const potentialQuestions = Object.values(dialogue).find(value => Array.isArray(value) && value.every(item => typeof item === 'string'));
                if (potentialQuestions) {
                    questions = potentialQuestions as string[];
                }
            }

            if (questions.length === 0) {
              return null;
            }

            return (
              <div key={index} className="mb-6 p-4 border rounded-md bg-gray-50">
                <h4 className="text-lg font-bold text-blue-700 mb-2">Suggested Questions:</h4>
                <ol className="list-decimal list-inside space-y-1">
                  {questions.map((question: string, qIndex: number) => (
                    <li key={qIndex}>
                      <span className="font-medium">{question}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}