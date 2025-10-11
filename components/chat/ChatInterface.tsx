'use client';

import { FormEvent } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  topic: string;
}

export default function ChatInterface({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  topic
}: ChatInterfaceProps) {
  return (
    <div className="h-full bg-white border-8 border-black flex flex-col">
      {/* Header */}
      <div className="bg-red-500 border-b-8 border-black p-4">
        <h2 className="text-2xl font-black text-white">
          LEARNING: {topic.toUpperCase()}
        </h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 font-bold text-lg mt-8">
            Ask me anything about {topic} to get started!
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 border-4 border-black ${
              message.role === 'user'
                ? 'bg-blue-200 ml-8'
                : 'bg-green-200 mr-8'
            }`}
          >
            <div className="font-bold text-sm mb-1 uppercase">
              {message.role === 'user' ? 'You' : 'AI Tutor'}
            </div>
            <div className="font-medium">{message.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className="bg-green-200 mr-8 p-4 border-4 border-black">
            <div className="font-bold text-sm mb-1 uppercase">AI Tutor</div>
            <div className="font-medium">Thinking...</div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t-8 border-black">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="bg-white border-4 border-black flex">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask a question or give a command..."
              className="flex-1 p-4 text-lg font-medium border-0 outline-none bg-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-black px-6 py-4 border-l-4 border-black transition-colors"
            >
              SEND
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}