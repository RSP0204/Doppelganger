'use client';

export default function ResultsDisplay() {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Suggested Questions:</h3>
          <ul className="list-disc list-inside">
            {/* Example data */}
            <li>What were the key decisions made in the meeting?</li>
            <li>Can you clarify the action items for the team?</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Suggested Statements:</h3>
          <ul className="list-disc list-inside">
            {/* Example data */}
            <li>Based on the discussion, it seems we should prioritize the new feature.</li>
            <li>I agree with the proposed timeline for the project.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
