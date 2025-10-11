'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatInterface from '@/components/chat/ChatInterface';
import FileBasedContentWindow from '@/components/content/FileBasedContentWindow';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function LearnPage() {
  const searchParams = useSearchParams();
  const topic = searchParams.get('topic') || '';

  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLessonSection, setCurrentLessonSection] = useState('');
  const [currentEnvironmentCode, setCurrentEnvironmentCode] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(0);
  const initializationRef = useRef(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Function to check if a message is similar to recent messages
  const isSimilarMessage = (newMessage: string, recentMessages: Message[]): boolean => {
    if (recentMessages.length === 0) return false;

    const lastTwoMessages = recentMessages.slice(-2).filter(msg => msg.role === 'assistant');

    for (const msg of lastTwoMessages) {
      // Simple similarity check - if messages share key phrases
      const newWords = newMessage.toLowerCase().split(' ');
      const existingWords = msg.content.toLowerCase().split(' ');

      // Check for common phrases that indicate similar intent
      const commonPhrases = [
        'create', 'lesson', 'plan', 'visualization', 'interactive',
        'help', 'learn', 'tutorial', 'generate'
      ];

      let matchCount = 0;
      for (const phrase of commonPhrases) {
        if (newWords.includes(phrase) && existingWords.includes(phrase)) {
          matchCount++;
        }
      }

      // If more than 3 common key phrases, consider it similar
      if (matchCount >= 3 && Math.abs(newMessage.length - msg.content.length) < 100) {
        return true;
      }
    }

    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/learn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          chatHistory: [...messages, userMessage],
          currentLessonSection,
          currentEnvironmentCode,
          userInput: input,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      let assistantContent = '';
      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: '',
      };

      // Only add assistant message if it won't be a duplicate
      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'text') {
                assistantContent += data.content;

                // Check if this content is similar to recent messages
                const updatedContent = assistantContent;

                setMessages(prev => {
                  // Only update if not similar to recent messages
                  const currentMessages = prev.filter(msg => msg.id !== assistantMessage.id);
                  if (!isSimilarMessage(updatedContent, currentMessages)) {
                    return prev.map(msg =>
                      msg.id === assistantMessage.id
                        ? { ...msg, content: updatedContent }
                        : msg
                    );
                  }
                  return prev;
                });
              } else if (data.type === 'tool_use') {
                // Handle tool usage - this could update lesson content or environment code
                console.log('Tool used:', data.tool_name, data.input);
              } else if (data.type === 'tool_result') {
                // Handle tool results - extract lesson content and environment code
                console.log('Tool result:', data);
                if (data.tool_name === 'generate_lesson_plan' && data.result) {
                  try {
                    const lessonData = JSON.parse(data.result);
                    if (lessonData.content) {
                      setCurrentLessonSection(lessonData.content);
                    }
                  } catch (e) {
                    console.warn('Could not parse lesson plan result:', e);
                  }
                } else if (data.tool_name === 'generate_interactive_environment' && data.result) {
                  try {
                    const envData = JSON.parse(data.result);
                    if (envData.code) {
                      setCurrentEnvironmentCode(envData.code);
                    }
                  } catch (e) {
                    console.warn('Could not parse environment result:', e);
                  }
                }
              } else if (data.type === 'done') {
                console.log('Conversation complete:', data.result);
                // Trigger immediate content refresh when AI is done
                setForceRefresh(Date.now());
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-submit the initial topic when component mounts
  useEffect(() => {
    if (topic && messages.length === 0 && !isLoading && !hasInitialized && !initializationRef.current) {
      initializationRef.current = true;
      setHasInitialized(true);

      console.log('Initializing lesson for topic:', topic);
      // Auto-submit the initial topic request
      const userMessage: Message = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: `I want to learn about ${topic}. Please create a lesson plan and an interactive visualization to help me understand it.`,
      };

      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      // Make the API call
      fetch('/api/learn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          chatHistory: [userMessage],
          currentLessonSection,
          currentEnvironmentCode,
          userInput: userMessage.content,
        }),
      })
      .then(async response => {
        if (!response.ok) {
          throw new Error('Failed to fetch response');
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No reader available');
        }

        let assistantContent = '';
        const assistantMessage: Message = {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          content: '',
        };

        setMessages(prev => [...prev, assistantMessage]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === 'text') {
                  assistantContent += data.content;

                  // Check if this content is similar to recent messages
                  const updatedContent = assistantContent;

                  setMessages(prev => {
                    // Only update if not similar to recent messages
                    const currentMessages = prev.filter(msg => msg.id !== assistantMessage.id);
                    if (!isSimilarMessage(updatedContent, currentMessages)) {
                      return prev.map(msg =>
                        msg.id === assistantMessage.id
                          ? { ...msg, content: updatedContent }
                          : msg
                      );
                    }
                    return prev;
                  });
                } else if (data.type === 'tool_result') {
                  console.log('Tool result received:', data);

                  // Filter out non-educational tool results
                  if (!data.tool_name ||
                      (!data.tool_name.includes('generate_lesson_plan') &&
                       !data.tool_name.includes('generate_interactive_environment') &&
                       !data.tool_name.includes('update_interactive_environment') &&
                       !data.tool_name.includes('answer_question_directly'))) {
                    return; // Skip non-educational tools
                  }

                  if (data.tool_name.includes('generate_lesson_plan') && data.result) {
                    try {
                      console.log('Processing lesson plan result:', data.result);

                      // The result should be a JSON string like '{"content":"...", "section":"...", "topic":"..."}'
                      const lessonData = JSON.parse(data.result);
                      if (lessonData.content) {
                        console.log('Setting lesson content:', lessonData.content.substring(0, 100) + '...');
                        setCurrentLessonSection(lessonData.content);
                      }
                    } catch (e) {
                      console.warn('Could not parse lesson plan result:', e, 'Raw result:', data.result);
                      // If JSON parsing fails, treat as plain markdown content
                      if (typeof data.result === 'string' && data.result.trim()) {
                        setCurrentLessonSection(data.result);
                      }
                    }
                  } else if (data.tool_name.includes('generate_interactive_environment') && data.result) {
                    try {
                      console.log('Processing interactive environment result:', data.result);

                      // The result should be a JSON string like '{"code":"...", "concept":"...", "type":"..."}'
                      const envData = JSON.parse(data.result);
                      if (envData.code) {
                        console.log('Setting environment code:', envData.code.substring(0, 100) + '...');
                        // Remove markdown code block markers if present
                        let cleanCode = envData.code;
                        if (cleanCode.startsWith('```javascript')) {
                          cleanCode = cleanCode.replace(/^```javascript\n?/, '').replace(/\n?```$/, '');
                        } else if (cleanCode.startsWith('```')) {
                          cleanCode = cleanCode.replace(/^```\n?/, '').replace(/\n?```$/, '');
                        }
                        setCurrentEnvironmentCode(cleanCode);
                      }
                    } catch (e) {
                      console.warn('Could not parse environment result:', e, 'Raw result:', data.result);
                      // If JSON parsing fails, treat as plain JavaScript code
                      if (typeof data.result === 'string' && data.result.trim()) {
                        setCurrentEnvironmentCode(data.result);
                      }
                    }
                  }
                } else if (data.type === 'done') {
                  console.log('Auto-initialization complete:', data.result);
                  // Trigger immediate content refresh when AI is done
                  setForceRefresh(Date.now());
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setMessages(prev => [...prev, {
          id: `error_${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        }]);
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  }, [topic]);

  // Reset initialization when topic changes
  useEffect(() => {
    initializationRef.current = false;
    setHasInitialized(false);
    setMessages([]);
  }, [topic]);

  // Reset content function
  const handleReset = async () => {
    try {
      await fetch('/api/reset-content', { method: 'POST' });
      setMessages([]);
      setCurrentLessonSection('');
      setCurrentEnvironmentCode('');
    } catch (error) {
      console.error('Failed to reset content:', error);
    }
  };

  return (
    <div className="h-screen bg-yellow-300 flex">
      {/* Chat Interface - Left Side (25% width) */}
      <div className="w-1/4 h-full border-r-8 border-black">
        <ChatInterface
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          topic={topic}
        />
      </div>

      {/* Environment - Center (50% width) */}
      <div className="w-1/2 h-full border-r-8 border-black">
        <FileBasedContentWindow
          showEnvironmentOnly={true}
          onReset={handleReset}
          isAIGenerating={isLoading}
          forceRefresh={forceRefresh}
        />
      </div>

      {/* Lesson Content - Right Side (25% width) */}
      <div className="w-1/4 h-full">
        <FileBasedContentWindow
          showLessonOnly={true}
          isAIGenerating={isLoading}
          forceRefresh={forceRefresh}
        />
      </div>
    </div>
  );
}