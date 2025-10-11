'use client';

import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface FileBasedContentWindowProps {
  showEnvironmentOnly?: boolean;
  showLessonOnly?: boolean;
  onReset?: () => void;
  isAIGenerating?: boolean; // New prop to indicate if AI is actively generating
  forceRefresh?: number; // New prop to trigger immediate refresh
}

export default function FileBasedContentWindow({
  showEnvironmentOnly = false,
  showLessonOnly = false,
  onReset,
  isAIGenerating = false,
  forceRefresh
}: FileBasedContentWindowProps) {
  const [lessonContent, setLessonContent] = useState('');
  const [environmentKey, setEnvironmentKey] = useState(Date.now());
  const [previousLessonContent, setPreviousLessonContent] = useState('');
  const [previousEnvironmentContent, setPreviousEnvironmentContent] = useState('');
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState(Date.now());

  // Fetch and check for content updates
  const fetchContent = async () => {
    try {
      // Check lesson content
      const lessonResponse = await fetch(`/generated/lesson-content.md`);
      if (lessonResponse.ok) {
        const content = await lessonResponse.text();

        // Only update if content actually changed
        if (content !== previousLessonContent) {
          console.log('[LESSON] Content changed! Updating...');
          setLessonContent(content);
          setPreviousLessonContent(content);
        }
      }

      // Check environment content separately
      const envResponse = await fetch(`/generated/interactive-environment.html`);
      if (envResponse.ok) {
        const envContent = await envResponse.text();

        // Only refresh iframe if environment content actually changed
        if (envContent !== previousEnvironmentContent) {
          console.log('[ENV] Content changed! Refreshing iframe...');
          setPreviousEnvironmentContent(envContent);
          setEnvironmentKey(Date.now()); // This will trigger iframe refresh only when needed
        }
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  // Load initial content and set up conditional polling
  useEffect(() => {
    fetchContent();
  }, []);

  // Only poll when AI is actively generating content
  useEffect(() => {
    if (isAIGenerating) {
      // Start polling while AI is generating
      checkIntervalRef.current = setInterval(() => {
        fetchContent();
      }, 2000); // Check every 2 seconds while generating
    } else {
      // Stop polling when AI is done
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [isAIGenerating]);

  // Force refresh when forceRefresh prop changes
  useEffect(() => {
    if (forceRefresh) {
      console.log('[REFRESH] Force refresh triggered!');
      setPreviousLessonContent(''); // Force refresh by clearing cache
      setPreviousEnvironmentContent(''); // Force refresh by clearing cache
      fetchContent();
    }
  }, [forceRefresh]);

  // Manual refresh function
  const refreshContent = () => {
    setPreviousLessonContent(''); // Force refresh by clearing cache
    setPreviousEnvironmentContent(''); // Force refresh by clearing cache
    fetchContent();
  };

  // Render environment-only view
  if (showEnvironmentOnly) {
    return (
      <div className="h-full bg-white border-8 border-black flex flex-col">
        {/* Header */}
        <div className="bg-purple-600 border-b-8 border-black p-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-white">
              [ENV] INTERACTIVE ENVIRONMENT
            </h2>
            {isAIGenerating && (
              <p className="text-purple-200 text-sm font-bold">
                [AI] Generating content...
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {onReset && (
              <button
                onClick={onReset}
                className="px-4 py-2 bg-red-500 text-white font-black border-4 border-black hover:bg-red-600"
              >
                RESET
              </button>
            )}
            <button
              onClick={refreshContent}
              className="px-4 py-2 bg-yellow-400 text-black font-black border-4 border-black hover:bg-yellow-300"
            >
              REFRESH
            </button>
          </div>
        </div>

        {/* Environment Full Screen */}
        <div className="flex-1 bg-white">
          <iframe
            key={environmentKey}
            src={`/generated/interactive-environment.html`}
            className="w-full h-full border-none"
            title="Interactive Environment"
          />
        </div>
      </div>
    );
  }

  // Render lesson-only view
  if (showLessonOnly) {
    return (
      <div className="h-full bg-white border-8 border-black flex flex-col">
        {/* Header */}
        <div className="bg-green-600 border-b-8 border-black p-4">
          <h2 className="text-xl font-black text-white">
            [LESSON] CONTENT
          </h2>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="prose prose-sm max-w-none">
            {lessonContent ? (
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-black border-b-4 border-black pb-2 mb-4">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-black border-b-2 border-black pb-1 mb-2">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-black mb-2">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-sm font-medium mb-3 leading-relaxed">{children}</p>
                  ),
                  code: ({ children }) => (
                    <code className="border border-black px-1 py-0.5 font-mono text-xs font-bold">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-900 text-green-400 border-2 border-black p-2 font-mono text-xs font-bold overflow-x-auto">
                      {children}
                    </pre>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-none space-y-1 mb-3 text-sm">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="flex items-start">
                      <span className="font-black mr-1">•</span>
                      <span className="font-medium">{children}</span>
                    </li>
                  ),
                }}
              >
                {lessonContent}
              </ReactMarkdown>
            ) : (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="text-3xl font-black text-gray-300 mb-2">[...]</div>
                  <p className="text-sm font-bold text-gray-500">
                    Waiting for lesson content...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default view (shouldn't be used anymore but kept for backwards compatibility)
  return null;
}