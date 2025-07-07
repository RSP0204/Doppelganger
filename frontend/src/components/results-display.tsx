'use client';

interface ParsedItem {
  text: string;
  explanation?: string;
}

interface ParsedSection {
  header: string;
  items: ParsedItem[];
}

interface ParsedDialogue {
  analysisResultsHeader: string;
  generatedDialoguesHeader: string;
  sections: ParsedSection[];
}

function parseDialogue(dialogue: string): ParsedDialogue {
  const parsed: ParsedDialogue = {
    analysisResultsHeader: 'Analysis Results',
    generatedDialoguesHeader: 'Generated Dialogues:',
    sections: [],
  };

  // Remove the initial "Analysis Results\nGenerated Dialogues:\n" part if present
  let content = dialogue;
  if (content.startsWith('Analysis Results\nGenerated Dialogues:\n')) {
    content = content.substring('Analysis Results\nGenerated Dialogues:\n'.length);
  }

  // Regex to find Suggested Questions block
  const questionsBlockMatch = content.match(/\*\*Suggested Questions:\*\*([\s\S]*?)(?=\*\*Suggested Statements:\*\*|$)/);
  if (questionsBlockMatch && questionsBlockMatch[1]) {
    const questionsContent = questionsBlockMatch[1].trim();
    const questionsSection: ParsedSection = {
      header: 'Suggested Questions:',
      items: [],
    };

    // Regex to find each item within the questions content
    const itemRegex = /(?:(?:\*\s*)|(?:\d+\.\s*))(.*?)(?:\s*\((.*?)\))?/g;
    let match;
    while ((match = itemRegex.exec(questionsContent)) !== null) {
      questionsSection.items.push({
        text: match[1].trim(),
        explanation: match[2] ? match[2].trim() : undefined,
      });
    }
    parsed.sections.push(questionsSection);
  }

  // Regex to find Suggested Statements block
  const statementsBlockMatch = content.match(/\*\*Suggested Statements:\*\*([\s\S]*)/);
  if (statementsBlockMatch && statementsBlockMatch[1]) {
    const statementsContent = statementsBlockMatch[1].trim();
    const statementsSection: ParsedSection = {
      header: 'Suggested Statements:',
      items: [],
    };

    // Regex to find each item within the statements content
    const itemRegex = /(?:(?:\*\s*)|(?:\d+\.\s*))(.*?)(?:\s*\((.*?)\))?/g;
    let match;
    while ((match = itemRegex.exec(statementsContent)) !== null) {
      statementsSection.items.push({
        text: match[1].trim(),
        explanation: match[2] ? match[2].trim() : undefined,
      });
    }
    parsed.sections.push(statementsSection);
  }

  return parsed;
}

export default function ResultsDisplay({ generatedDialogues }: { generatedDialogues: string[] }) {
  return (
    <div className="p-4 border rounded-lg mt-4">
      <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Generated Dialogues:</h3>
          {generatedDialogues.map((dialogue, index) => {
            const parsed = parseDialogue(dialogue);
            return (
              <div key={index} className="mb-6 p-4 border rounded-md bg-gray-50">
                {parsed.sections.map((section, secIndex) => (
                  <div key={secIndex} className="mb-4">
                    <h4 className="text-lg font-bold text-blue-700 mb-2">{section.header}</h4>
                    <ul className="list-disc list-inside space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <span className="font-medium">{item.text}</span>
                          {item.explanation && (
                            <span className="text-gray-600 italic ml-2">({item.explanation})</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}