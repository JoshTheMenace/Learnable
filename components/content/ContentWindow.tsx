'use client';

import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface ContentWindowProps {
  lessonContent: string;
  environmentCode: string;
}

export default function ContentWindow({ lessonContent, environmentCode }: ContentWindowProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (environmentCode && canvasRef.current) {
      // Clear any existing content
      canvasRef.current.innerHTML = '';

      try {
        // Create a script element and execute the code
        const script = document.createElement('script');
        script.textContent = environmentCode;
        canvasRef.current.appendChild(script);
      } catch (error) {
        console.error('Error executing environment code:', error);
      }
    }
  }, [environmentCode]);

  return (
    <div className="h-full bg-white border-8 border-black flex flex-col">
      {/* Header */}
      <div className="bg-blue-500 border-b-8 border-black p-4">
        <h2 className="text-2xl font-black text-white">
          CONTENT WINDOW
        </h2>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Interactive Environment */}
        {environmentCode && (
          <div className="border-b-8 border-black">
            <div className="bg-gray-100 p-2 border-b-4 border-black">
              <h3 className="font-black text-lg">INTERACTIVE ENVIRONMENT</h3>
            </div>
            <div
              ref={canvasRef}
              className="min-h-[300px] bg-white p-4"
              id="p5-container"
            />
          </div>
        )}

        {/* Lesson Content */}
        {lessonContent && (
          <div className="p-6">
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-black border-b-4 border-black pb-2 mb-4">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-black border-b-2 border-black pb-1 mb-3">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-black mb-2">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="font-medium mb-4 leading-relaxed">{children}</p>
                  ),
                  code: ({ children }) => (
                    <code className="bg-yellow-200 border-2 border-black px-2 py-1 font-mono font-bold">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-900 text-green-400 border-4 border-black p-4 font-mono font-bold overflow-x-auto">
                      {children}
                    </pre>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-none space-y-2 mb-4">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="flex items-start">
                      <span className="font-black mr-2">▸</span>
                      <span className="font-medium">{children}</span>
                    </li>
                  ),
                }}
              >
                {lessonContent}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Default state */}
        {!lessonContent && !environmentCode && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl font-black text-gray-300 mb-4">📚</div>
              <p className="text-2xl font-bold text-gray-500">
                Lesson content will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}