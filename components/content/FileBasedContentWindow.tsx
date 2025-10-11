'use client';

import { useEffect, useState, useRef } from 'react';
import EnvironmentButton from './EnvironmentButton';

interface FileBasedContentWindowProps {
  showEnvironmentOnly?: boolean;
  showLessonOnly?: boolean;
  onReset?: () => void;
  isAIGenerating?: boolean; // New prop to indicate if AI is actively generating
  forceRefresh?: number; // New prop to trigger immediate refresh
  onEnvironmentTrigger?: (type: string, prompt: string) => void; // New prop for triggering environments
}

export default function FileBasedContentWindow({
  showEnvironmentOnly = false,
  showLessonOnly = false,
  onReset,
  isAIGenerating = false,
  forceRefresh,
  onEnvironmentTrigger
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
      const lessonResponse = await fetch(`/generated/lesson-content.html`);
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
          setEnvironmentKey(Date.now()); // This will trigger iframe refresh when needed
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
      }, 3000); // Check every 3 seconds while generating (reduced frequency)
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
      // Don't clear environment content cache to prevent unnecessary iframe refreshes
      fetchContent();
    }
  }, [forceRefresh]);

  // Manual refresh function
  const refreshContent = () => {
    setPreviousLessonContent(''); // Force refresh by clearing cache
    setPreviousEnvironmentContent(''); // Force refresh by clearing cache
    fetchContent();
  };

  // Types for parsed content parts
  type ContentPart =
    | { type: 'text'; content: string }
    | {
        type: 'environment-button';
        envType: 'demo' | 'quiz' | 'exercise' | 'visualization' | 'simulation';
        description: string;
        prompt: string;
        label: string;
      };

  // Parse environment buttons from lesson content
  const parseEnvironmentButtons = (content: string): ContentPart[] => {
    // Look for environment button syntax: [Button Text](button:type:description)
    const envButtonRegex = new RegExp('\\[([^\\]]+)\\]\\(button:(demo|quiz|exercise|visualization|simulation):([^)]+)\\)', 'g');
    const parts: ContentPart[] = [];
    let lastIndex = 0;
    let match;

    while ((match = envButtonRegex.exec(content)) !== null) {
      // Add text before the button
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }

      // Add the environment button
      const buttonText = match[1] || '';
      const envType = match[2] as 'demo' | 'quiz' | 'exercise' | 'visualization' | 'simulation';
      const description = match[3] || '';

      // Use description as prompt for environment generation
      const prompt = description;

      // Only add if we have valid values
      if (envType && description && buttonText) {
        parts.push({
          type: 'environment-button',
          envType,
          description,
          prompt,
          label: buttonText
        });
      }

      lastIndex = envButtonRegex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }

    return parts;
  };

  // Render environment-only view
  if (showEnvironmentOnly) {
    return (
      <div className="h-full bg-white border-8 border-black flex flex-col">
        {/* Header */}
        <div className="bg-purple-600 border-b-8 border-black p-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-white">
              INTERACTIVE ENVIRONMENT
            </h2>
            {isAIGenerating && (
              <p className="text-purple-200 text-sm font-bold">
                AI Generating content...
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
        <div className="flex-1 bg-white relative">
          {/* Loading overlay for environment */}
          {isAIGenerating && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
              <div className="bg-yellow-300 border-8 border-black p-8 text-center">
                <div className="text-4xl font-black text-black mb-4">⚡ GENERATING ⚡</div>
                <div className="text-lg font-bold text-black">Creating interactive content...</div>
                <div className="flex justify-center mt-4">
                  <div className="w-8 h-8 border-4 border-black border-t-yellow-300 animate-spin rounded-full"></div>
                </div>
              </div>
            </div>
          )}
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
            LESSON CONTENT
          </h2>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 overflow-y-auto p-4 relative">
          {/* Loading overlay for lesson content */}
          {isAIGenerating && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
              <div className="bg-green-400 border-8 border-black p-8 text-center">
                <div className="text-4xl font-black text-black mb-4">📚 WRITING 📚</div>
                <div className="text-lg font-bold text-black">Generating lesson content...</div>
                <div className="flex justify-center mt-4">
                  <div className="w-8 h-8 border-4 border-black border-t-green-400 animate-spin rounded-full"></div>
                </div>
              </div>
            </div>
          )}

          <div className="lesson-content">
            <style jsx>{`
              .neo-brutalist-content h1 {
                font-size: clamp(1.5rem, 4vw, 2rem);
                font-weight: 900;
                color: #000;
                text-transform: uppercase;
                border-bottom: 4px solid #000;
                padding-bottom: 0.5rem;
                margin-bottom: 1rem;
                letter-spacing: -1px;
              }
              .neo-brutalist-content h2 {
                font-size: clamp(1.25rem, 3vw, 1.5rem);
                font-weight: 900;
                color: #000;
                text-transform: uppercase;
                border-bottom: 2px solid #000;
                padding-bottom: 0.25rem;
                margin: 1.5rem 0 0.75rem 0;
                letter-spacing: -0.5px;
              }
              .neo-brutalist-content h3 {
                font-size: clamp(1rem, 2.5vw, 1.25rem);
                font-weight: 900;
                color: #000;
                text-transform: uppercase;
                margin: 1rem 0 0.5rem 0;
              }
              .neo-brutalist-content p {
                font-size: 0.9rem;
                font-weight: 600;
                color: #000;
                line-height: 1.6;
                margin-bottom: 1rem;
              }
              .neo-brutalist-content ul {
                list-style: none;
                margin: 1rem 0;
                padding: 0;
              }
              .neo-brutalist-content li {
                font-weight: 600;
                color: #000;
                margin-bottom: 0.5rem;
                padding-left: 1.5rem;
                position: relative;
              }
              .neo-brutalist-content li:before {
                content: "▶";
                position: absolute;
                left: 0;
                font-weight: 900;
                color: #FF00FF;
              }
              .neo-brutalist-content code {
                background: #FFFF00;
                border: 2px solid #000;
                padding: 0.25rem 0.5rem;
                font-family: 'Courier New', monospace;
                font-weight: 700;
                color: #000;
                font-size: 0.8rem;
              }
              .neo-brutalist-content pre {
                background: #000;
                color: #00FF00;
                border: 4px solid #000;
                padding: 1rem;
                font-family: 'Courier New', monospace;
                font-weight: 700;
                overflow-x: auto;
                margin: 1rem 0;
                box-shadow: 4px 4px 0px #FF00FF;
              }
              .neo-brutalist-content strong {
                font-weight: 900;
                color: #FF00FF;
              }
              .neo-brutalist-content em {
                font-style: normal;
                font-weight: 900;
                background: #00FF00;
                color: #000;
                padding: 0.1rem 0.3rem;
                border: 2px solid #000;
              }
            `}</style>
            {lessonContent ? (
              <div>
                {parseEnvironmentButtons(lessonContent).map((part, index) => {
                  if (part.type === 'environment-button') {
                    return (
                      <EnvironmentButton
                        key={index}
                        type={part.envType}
                        description={part.description}
                        prompt={part.prompt}
                        label={part.label}
                        onTrigger={onEnvironmentTrigger}
                      />
                    );
                  } else {
                    return (
                      <div
                        key={index}
                        dangerouslySetInnerHTML={{ __html: part.content }}
                        className="neo-brutalist-content"
                      />
                    );
                  }
                })}
              </div>
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