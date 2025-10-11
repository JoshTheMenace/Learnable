'use client';

import { useState } from 'react';

export default function TestPage() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testOrchestrator = async () => {
    setTesting(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-orchestrator');
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.details || data.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-300 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 mb-8">
          <h1 className="text-4xl font-black mb-4">ORCHESTRATOR TEST</h1>
          <p className="text-lg font-medium mb-6">
            Test the Claude Agent SDK orchestrator with Cerebras tools
          </p>

          <button
            onClick={testOrchestrator}
            disabled={testing}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white text-xl font-black py-4 px-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            {testing ? 'TESTING...' : 'RUN TEST'}
          </button>
        </div>

        {error && (
          <div className="bg-red-200 border-8 border-black p-6 mb-8">
            <h2 className="text-2xl font-black text-red-800 mb-4">ERROR</h2>
            <pre className="text-sm font-mono bg-red-100 p-4 border-4 border-red-800 overflow-auto">
              {error}
            </pre>
          </div>
        )}

        {result && (
          <div className="bg-green-200 border-8 border-black p-6">
            <h2 className="text-2xl font-black text-green-800 mb-4">SUCCESS!</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black mb-2">Messages:</h3>
                <div className="space-y-2">
                  {result.messages?.map((msg: any, i: number) => (
                    <div key={i} className="bg-white border-4 border-black p-4">
                      <div className="font-bold text-sm mb-2 uppercase">
                        {msg.type}
                      </div>
                      {msg.content && (
                        <div className="font-mono text-sm">
                          {Array.isArray(msg.content) ? (
                            msg.content.map((block: any, j: number) => (
                              <div key={j} className="mb-2">
                                <strong>{block.type}:</strong>{' '}
                                {block.type === 'text' ? block.text :
                                 block.type === 'tool_use' ? `Tool: ${block.name}` :
                                 JSON.stringify(block)}
                              </div>
                            ))
                          ) : (
                            <pre className="whitespace-pre-wrap">{JSON.stringify(msg.content, null, 2)}</pre>
                          )}
                        </div>
                      )}
                      {msg.result && (
                        <div className="mt-2">
                          <strong>Result:</strong> {msg.result}
                          {msg.cost && <div><strong>Cost:</strong> ${msg.cost}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Test completed at: {result.timestamp}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}