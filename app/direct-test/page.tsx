'use client';

import { useState } from 'react';
import FileBasedContentWindow from '@/components/content/FileBasedContentWindow';

export default function DirectTestPage() {
  const [isWriting, setIsWriting] = useState(false);
  const [status, setStatus] = useState<string[]>([]);

  const addStatus = (message: string) => {
    setStatus(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testLessonWrite = async () => {
    setIsWriting(true);
    addStatus('🧪 Testing direct lesson content write...');

    const testContent = `# Test Lesson Content

This is a **test lesson** generated at ${new Date().toLocaleString()}.

## Key Points
- This content was written directly to the file
- No streaming complexity
- Should appear immediately in the ContentWindow

## Interactive Elements
\`\`\`python
print("Hello, geology student!")
\`\`\`

**Status:** ✅ Direct file write successful!
`;

    try {
      const response = await fetch('/api/write-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lesson',
          content: testContent
        })
      });

      const result = await response.json();
      if (result.success) {
        addStatus('✅ Lesson content written successfully!');
      } else {
        addStatus(`❌ Failed: ${result.message}`);
      }
    } catch (error) {
      addStatus(`❌ Error: ${error}`);
    } finally {
      setIsWriting(false);
    }
  };

  const testEnvironmentWrite = async () => {
    setIsWriting(true);
    addStatus('🎮 Testing direct environment write...');

    const testCode = `
function setup() {
  createCanvas(600, 400);
  background(240);
}

function draw() {
  // Draw a simple animated circle
  background(240);

  fill(255, 100, 100);
  stroke(0);
  strokeWeight(3);

  let x = width/2 + cos(frameCount * 0.05) * 100;
  let y = height/2 + sin(frameCount * 0.03) * 50;

  circle(x, y, 80);

  // Add text
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(20);
  text("Direct Test Success! 🎉", width/2, height - 50);

  textSize(12);
  text("Generated at: ${new Date().toLocaleTimeString()}", width/2, height - 25);
}
`;

    try {
      const response = await fetch('/api/write-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'environment',
          content: testCode
        })
      });

      const result = await response.json();
      if (result.success) {
        addStatus('✅ Interactive environment written successfully!');
      } else {
        addStatus(`❌ Failed: ${result.message}`);
      }
    } catch (error) {
      addStatus(`❌ Error: ${error}`);
    } finally {
      setIsWriting(false);
    }
  };

  const clearFiles = async () => {
    setIsWriting(true);
    addStatus('🗑️ Clearing files...');

    try {
      // Reset to placeholder content
      await testLessonWrite();
      addStatus('✅ Files reset to test content');
    } catch (error) {
      addStatus(`❌ Error clearing files: ${error}`);
    } finally {
      setIsWriting(false);
    }
  };

  return (
    <div className="h-screen bg-green-300 flex">
      {/* Test Controls - Left Side */}
      <div className="w-1/2 h-full border-r-8 border-black bg-white p-6 overflow-y-auto">
        <div className="bg-green-500 border-b-8 border-black p-4 mb-6">
          <h1 className="text-3xl font-black text-white">
            🧪 DIRECT FILE WRITE TEST
          </h1>
          <p className="text-white font-bold mt-2">
            Tests file writing without streaming complexity
          </p>
        </div>

        {/* Test Buttons */}
        <div className="space-y-4 mb-6">
          <button
            onClick={testLessonWrite}
            disabled={isWriting}
            className="w-full px-6 py-4 bg-blue-500 text-white font-black border-4 border-black disabled:bg-gray-300 hover:bg-blue-600"
          >
            📚 TEST LESSON CONTENT WRITE
          </button>

          <button
            onClick={testEnvironmentWrite}
            disabled={isWriting}
            className="w-full px-6 py-4 bg-purple-500 text-white font-black border-4 border-black disabled:bg-gray-300 hover:bg-purple-600"
          >
            🎮 TEST ENVIRONMENT WRITE
          </button>

          <button
            onClick={clearFiles}
            disabled={isWriting}
            className="w-full px-6 py-4 bg-red-500 text-white font-black border-4 border-black disabled:bg-gray-300 hover:bg-red-600"
          >
            🗑️ CLEAR FILES
          </button>
        </div>

        {/* Status Output */}
        <div className="bg-gray-900 text-green-400 border-4 border-black p-4 font-mono text-sm max-h-64 overflow-y-auto">
          <h3 className="text-white font-bold mb-2">📋 TEST STATUS:</h3>
          {status.length === 0 ? (
            <div className="text-gray-500">Ready to test direct file writing...</div>
          ) : (
            status.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))
          )}
        </div>

        {/* File Inspection */}
        <div className="mt-6 p-4 bg-yellow-100 border-4 border-black">
          <h3 className="font-black mb-2">🔍 INSPECT FILES:</h3>
          <div className="text-sm space-y-2">
            <div>
              <strong>Lesson Content:</strong>
              <a
                href="/generated/lesson-content.md"
                target="_blank"
                className="ml-2 text-blue-600 underline font-bold"
              >
                Open lesson-content.md
              </a>
            </div>
            <div>
              <strong>Interactive Environment:</strong>
              <a
                href="/generated/interactive-environment.html"
                target="_blank"
                className="ml-2 text-blue-600 underline font-bold"
              >
                Open interactive-environment.html
              </a>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            💡 This tests if the basic file writing functionality works!
          </p>
        </div>
      </div>

      {/* File-Based Content Window - Right Side */}
      <div className="w-1/2 h-full">
        <FileBasedContentWindow />
      </div>
    </div>
  );
}