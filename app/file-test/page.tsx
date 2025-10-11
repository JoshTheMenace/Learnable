'use client';

import { useState } from 'react';
import FileBasedContentWindow from '@/components/content/FileBasedContentWindow';

export default function FileTestPage() {
  const [input, setInput] = useState('');
  const [contentType, setContentType] = useState<'lesson' | 'environment'>('lesson');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string[]>([]);
  const [sessionId] = useState(() => `file_test_${Date.now()}`);

  const addStatus = (message: string) => {
    setStatus(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setStatus([]);
    addStatus(`🚀 Starting ${contentType} generation for: ${input}`);

    // Create appropriate prompt based on content type
    const prompt = contentType === 'lesson'
      ? `Create a lesson plan about ${input}`
      : `Create an interactive p5.js visualization for ${input}`;

    try {
      addStatus('📡 Sending request to API...');

      const response = await fetch('/api/learn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          chatHistory: [],
          currentLessonSection: '',
          currentEnvironmentCode: '',
          userInput: prompt,
        }),
      });

      addStatus(`📡 API Response: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // We don't need to process the streaming response here since
      // the API will write to files and the FileBasedContentWindow will auto-refresh
      addStatus('📁 API will write content to files automatically');
      addStatus('🔄 ContentWindow will auto-refresh to show new content');

      // Just consume the stream without processing
      const reader = response.body?.getReader();
      if (reader) {
        while (true) {
          const { done } = await reader.read();
          if (done) break;
        }
      }

      addStatus('✅ Generation complete! Check the content window.');
    } catch (error) {
      addStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFiles = async () => {
    try {
      addStatus('🗑️ Clearing content files...');

      // Reset lesson content
      await fetch('/generated/lesson-content.md', {
        method: 'GET',
        cache: 'no-cache'
      });

      addStatus('✅ Files reset to placeholder content');
    } catch (error) {
      addStatus(`❌ Error clearing files: ${error}`);
    }
  };

  return (
    <div className="h-screen bg-purple-300 flex">
      {/* Test Controls - Left Side */}
      <div className="w-1/2 h-full border-r-8 border-black bg-white p-6 overflow-y-auto">
        <div className="bg-purple-500 border-b-8 border-black p-4 mb-6">
          <h1 className="text-3xl font-black text-white">
            📁 FILE-BASED TEST
          </h1>
          <p className="text-white font-bold mt-2">
            Content is written to files for easy debugging!
          </p>
        </div>

        {/* Test Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label className="block text-lg font-bold mb-2">
              Test Topic:
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter topic to test..."
              className="w-full p-3 border-4 border-black font-bold text-lg"
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-bold mb-2">
              Content Type:
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="lesson"
                  checked={contentType === 'lesson'}
                  onChange={(e) => setContentType(e.target.value as 'lesson')}
                  className="mr-2"
                  disabled={isLoading}
                />
                <span className="font-bold">📚 Lesson Content</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="environment"
                  checked={contentType === 'environment'}
                  onChange={(e) => setContentType(e.target.value as 'environment')}
                  className="mr-2"
                  disabled={isLoading}
                />
                <span className="font-bold">🎮 Interactive Environment</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-green-500 text-white font-black border-4 border-black disabled:bg-gray-300"
            >
              {isLoading ? 'GENERATING...' : 'GENERATE CONTENT'}
            </button>
            <button
              type="button"
              onClick={clearFiles}
              className="px-6 py-3 bg-red-500 text-white font-black border-4 border-black"
            >
              CLEAR FILES
            </button>
          </div>
        </form>

        {/* Status Output */}
        <div className="bg-gray-900 text-green-400 border-4 border-black p-4 font-mono text-sm max-h-64 overflow-y-auto">
          <h3 className="text-white font-bold mb-2">📋 GENERATION STATUS:</h3>
          {status.length === 0 ? (
            <div className="text-gray-500">Ready to generate content...</div>
          ) : (
            status.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))
          )}
        </div>

        {/* File Inspection */}
        <div className="mt-6 p-4 bg-blue-100 border-4 border-black">
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
            💡 You can open these files directly to see exactly what content is being generated!
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