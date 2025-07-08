'use client';

interface ParsedItem {
  text: string;
  explanation?: string;
}

interface ParsedSubSection {
  subHeader: string; // e.g., "Regarding Self-Service Onboarding:"
  items: ParsedItem[]; // The bulleted questions/statements
}

interface ParsedMainSection {
  header: string; // e.g., "Suggested Questions:"
  subSections: ParsedSubSection[];
}

interface ParsedDialogue {
  analysisResultsHeader: string;
  generatedDialoguesHeader: string;
  mainSections: ParsedMainSection[];
}

function parseDialogue(dialogue: string): ParsedDialogue {
  const parsed: ParsedDialogue = {
    analysisResultsHeader: 'Analysis Results',
    generatedDialoguesHeader: 'Generated Dialogues:',
    mainSections: [],
  };

  // Split the dialogue by the main section headers, accounting for optional leading '- '
  const parts = dialogue.split(/(-?\s*\*{2}Suggested (Questions|Statements):\*{2})/);

  for (let i = 1; i < parts.length; i += 2) {
    const mainSectionHeader = parts[i].replace(/^-?\s*/, '').trim(); // Remove optional leading '- '
    const mainSectionContent = parts[i + 1] ? parts[i + 1].trim() : '';
    const currentMainSection: ParsedMainSection = {
      header: mainSectionHeader,
      subSections: [],
    };
    const lines = mainSectionContent.split('\n');
    let currentSubSection: ParsedSubSection | null = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      // Skip empty lines
      if (!trimmedLine) continue;

      // Match for numbered sub-section header: 1. **Regarding Self-Service Onboarding:** or 1. **To Raj:**
      const subHeaderMatch = trimmedLine.match(/^(?:\d+\.\s+\*{2}.*?:?\*{2})|(?:\*{2}.*?:?\*{2})/);
      if (subHeaderMatch) {
        if (currentSubSection) {
          currentMainSection.subSections.push(currentSubSection);
        }
        currentSubSection = {
          subHeader: trimmedLine, // Keep the full matched header including bolding
          items: [],
        };
        continue;
      }

      // Match for bulleted item: * "Question text" (Explanation) or * Question text (Explanation)
      const itemMatch = trimmedLine.match(/^\*\s*(.*?)(?:\s*\((.*?)\))?$/);
      if (itemMatch && currentSubSection) {
        let itemText = itemMatch[1].trim();
        // Remove surrounding quotes if present
        if (itemText.startsWith('"') && itemText.endsWith('"')) {
          itemText = itemText.substring(1, itemText.length - 1);
        }
        currentSubSection.items.push({
          text: itemText,
          explanation: itemMatch[2] ? itemMatch[2].trim() : undefined,
        });
      }
    }

    if (currentSubSection) {
      currentMainSection.subSections.push(currentSubSection);
    }
    parsed.mainSections.push(currentMainSection);
  }
  return parsed;
}

export default function ResultsDisplay({ generatedDialogues }: { generatedDialogues: string[] }) {
  return (
    <div className="p-4 border rounded-lg w-full">
      <h2 className="text-xl font-semibold mb-4 text-left">Analysis Results</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-left">Generated Dialogues:</h3>
          {generatedDialogues.map((dialogue, index) => {
            const parsed = parseDialogue(dialogue);
            if (parsed.mainSections.length === 0) {
              return null; // Don't render if there are no main sections
            }
            return (
              <div key={index} className="mb-6 p-4 border rounded-md bg-gray-50">
                {parsed.mainSections.map((mainSection, mainSecIndex) => (
                  <div key={mainSecIndex} className="mb-4">
                    <h4 className="text-lg font-bold text-blue-700 mb-2">{mainSection.header}</h4>
                    {mainSection.subSections.map((subSection, subSecIndex) => (
                      <div key={subSecIndex} className="ml-4 mb-2"> {/* Indent sub-sections */}
                        <h5 className="text-md font-semibold text-gray-800 mb-1">{subSection.subHeader}</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {subSection.items.map((item, itemIndex) => (
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
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}