'use client';

import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface ContentWindowProps {
  lessonContent: string;
  environmentCode: string;
}

export default function ContentWindow({ lessonContent, environmentCode }: ContentWindowProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Debug logging
  useEffect(() => {
    console.log('ContentWindow received lessonContent:', lessonContent ? lessonContent.substring(0, 100) + '...' : 'none');
    console.log('ContentWindow received environmentCode:', environmentCode ? environmentCode.substring(0, 100) + '...' : 'none');
  }, [lessonContent, environmentCode]);

  useEffect(() => {
    if (environmentCode && canvasRef.current) {
      // Clear any existing p5 instances and canvas elements
      canvasRef.current.innerHTML = '';

      // Remove any existing p5 instances from the window
      if ((window as any).p5Instance) {
        try {
          (window as any).p5Instance.remove();
        } catch (e) {
          console.log('Previous p5 instance cleanup attempt');
        }
      }

      try {
        // Create a wrapper function to isolate the p5 code
        const wrappedCode = `
          (function() {
            // Clean up any existing canvases
            const existingCanvases = document.querySelectorAll('#p5-container canvas');
            existingCanvases.forEach(canvas => canvas.remove());

            ${environmentCode}

            // If there's a setup function, it's likely p5.js code in global mode
            if (typeof setup === 'function') {
              // Create a new p5 instance attached to the container
              window.p5Instance = new p5((p) => {
                p.setup = setup;
                if (typeof draw === 'function') p.draw = draw;
                if (typeof mousePressed === 'function') p.mousePressed = mousePressed;
                if (typeof keyPressed === 'function') p.keyPressed = keyPressed;
              }, 'p5-container');
            }
          })();
        `;

        // Execute the wrapped code
        const script = document.createElement('script');
        script.textContent = wrappedCode;
        document.head.appendChild(script);

        // Clean up the script element
        setTimeout(() => {
          document.head.removeChild(script);
        }, 100);

      } catch (error) {
        console.error('Error executing environment code:', error);
        canvasRef.current.innerHTML = `
          <div class="p-4 bg-red-100 border-4 border-red-500 text-red-800 font-bold">
            Error executing visualization code: ${error instanceof Error ? error.message : 'Unknown error'}
          </div>
        `;
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