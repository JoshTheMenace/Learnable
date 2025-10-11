'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatInterface from '@/components/chat/ChatInterface';
import ContentWindow from '@/components/content/ContentWindow';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function LearnPage() {
  const searchParams = useSearchParams();
  const topic = searchParams.get('topic') || '';

  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [messages, setMessages] = useState<Message[]>(
    topic ? [
      { id: '1', role: 'user', content: `I want to learn about ${topic}` },
    ] : []
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLessonSection, setCurrentLessonSection] = useState('');
  const [currentEnvironmentCode, setCurrentEnvironmentCode] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
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
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: assistantContent }
                      : msg
                  )
                );
              } else if (data.type === 'tool_use') {
                // Handle tool usage - this could update lesson content or environment code
                console.log('Tool used:', data.tool_name, data.input);
              } else if (data.type === 'done') {
                console.log('Conversation complete:', data.result);
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
    if (topic && messages.length === 1 && !isLoading) {
      // Simulate form submission for the initial topic
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      setInput(`I want to learn about ${topic}`);
      setTimeout(() => handleSubmit(fakeEvent), 100);
    }
  }, [topic]);

  return (
    <div className="h-screen bg-yellow-300 flex">
      {/* Chat Interface - Left Side */}
      <div className="w-1/2 h-full border-r-8 border-black">
        <ChatInterface
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          topic={topic}
        />
      </div>

      {/* Content Window - Right Side */}
      <div className="w-1/2 h-full">
        <ContentWindow
          lessonContent={currentLessonSection}
          environmentCode={currentEnvironmentCode}
        />
      </div>
    </div>
  );
}