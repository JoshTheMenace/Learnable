'use client';

import { useState } from 'react';
import ContentWindow from '@/components/content/ContentWindow';

interface TestMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function TestPage() {
  const [input, setInput] = useState('');
  const [contentType, setContentType] = useState<'lesson' | 'environment'>('lesson');
  const [isLoading, setIsLoading] = useState(false);
  const [lessonContent, setLessonContent] = useState('');
  const [environmentCode, setEnvironmentCode] = useState('');
  const [debugOutput, setDebugOutput] = useState<string[]>([]);
  const [sessionId] = useState(() => `test_session_${Date.now()}`);

  const addDebugLog = (message: string) => {
    setDebugOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setDebugOutput([]);
    addDebugLog(`Starting test for: ${input} (type: ${contentType})`);

    // Create appropriate prompt based on content type
    const prompt = contentType === 'lesson'
      ? `Create a lesson plan about ${input}`
      : `Create an interactive p5.js visualization for ${input}`;

    const userMessage: TestMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: prompt,
    };

    addDebugLog(`Sending request to API...`);

    try {
      const response = await fetch('/api/learn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          chatHistory: [userMessage],
          currentLessonSection: lessonContent,
          currentEnvironmentCode: environmentCode,
          userInput: prompt,
        }),
      });

      addDebugLog(`API Response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch response: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      addDebugLog('Starting to read streaming response...');
      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              addDebugLog(`Received data: ${data.type} ${data.tool_name || ''}`);

              // Log the full data object for debugging
              if (data.type === 'tool_result') {
                addDebugLog(`FULL TOOL RESULT: ${JSON.stringify(data, null, 2)}`);
              }

              if (data.type === 'text') {
                assistantContent += data.content;
                addDebugLog(`Assistant text: ${data.content.substring(0, 50)}...`);
              } else if (data.type === 'tool_result') {
                addDebugLog(`Tool result from: ${data.tool_name}`);

                // Process tool results
                if (data.tool_name && data.tool_name.includes('generate_lesson_plan') && data.result) {
                  try {
                    addDebugLog(`Processing lesson plan result...`);
                    const lessonData = JSON.parse(data.result);
                    if (lessonData.content) {
                      addDebugLog(`Setting lesson content (${lessonData.content.length} chars)`);
                      setLessonContent(lessonData.content);
                    }
                  } catch (e) {
                    addDebugLog(`JSON parse failed, using raw result`);
                    if (typeof data.result === 'string' && data.result.trim()) {
                      setLessonContent(data.result);
                    }
                  }
                } else if (data.tool_name && data.tool_name.includes('generate_interactive_environment') && data.result) {
                  try {
                    addDebugLog(`Processing interactive environment result...`);
                    const envData = JSON.parse(data.result);
                    if (envData.code) {
                      addDebugLog(`Setting environment code (${envData.code.length} chars)`);
                      let cleanCode = envData.code;
                      if (cleanCode.startsWith('```javascript')) {
                        cleanCode = cleanCode.replace(/^```javascript\n?/, '').replace(/\n?```$/, '');
                      } else if (cleanCode.startsWith('```')) {
                        cleanCode = cleanCode.replace(/^```\n?/, '').replace(/\n?```$/, '');
                      }
                      setEnvironmentCode(cleanCode);
                    }
                  } catch (e) {
                    addDebugLog(`JSON parse failed, using raw result as code`);
                    if (typeof data.result === 'string' && data.result.trim()) {
                      setEnvironmentCode(data.result);
                    }
                  }
                }
              } else if (data.type === 'done') {
                addDebugLog(`Conversation complete: ${data.success ? 'success' : 'failed'}`);
              }
            } catch (e) {
              addDebugLog(`Failed to parse JSON: ${line}`);
            }
          }
        }
      }

      addDebugLog('Streaming complete');
    } catch (error) {
      addDebugLog(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearContent = () => {
    setLessonContent('');
    setEnvironmentCode('');
    setDebugOutput([]);
  };

  return (
    <div className="h-screen bg-yellow-300 flex">
      {/* Test Controls - Left Side */}
      <div className="w-1/2 h-full border-r-8 border-black bg-white p-6 overflow-y-auto">
        <div className="bg-purple-500 border-b-8 border-black p-4 mb-6">
          <h1 className="text-3xl font-black text-white">
            🧪 API TEST PAGE
          </h1>
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
              {isLoading ? 'TESTING...' : 'RUN TEST'}
            </button>
            <button
              type="button"
              onClick={clearContent}
              className="px-6 py-3 bg-red-500 text-white font-black border-4 border-black"
            >
              CLEAR
            </button>
          </div>
        </form>

        {/* Debug Output */}
        <div className="bg-gray-900 text-green-400 border-4 border-black p-4 font-mono text-sm max-h-96 overflow-y-auto">
          <h3 className="text-white font-bold mb-2">🐛 DEBUG OUTPUT:</h3>
          {debugOutput.length === 0 ? (
            <div className="text-gray-500">No debug output yet...</div>
          ) : (
            debugOutput.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))
          )}
        </div>

        {/* Content Status */}
        <div className="mt-4 p-4 bg-blue-100 border-4 border-black">
          <h3 className="font-black mb-2">📊 CONTENT STATUS:</h3>
          <div className="text-sm">
            <div className="mb-1">
              <strong>Lesson Content:</strong> {lessonContent ? `${lessonContent.length} characters` : 'None'}
            </div>
            <div>
              <strong>Environment Code:</strong> {environmentCode ? `${environmentCode.length} characters` : 'None'}
            </div>
          </div>
        </div>
      </div>

      {/* Content Window - Right Side */}
      <div className="w-1/2 h-full">
        <ContentWindow
          lessonContent={lessonContent}
          environmentCode={environmentCode}
        />
      </div>
    </div>
  );
}