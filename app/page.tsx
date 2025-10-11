'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [topic, setTopic] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      // Navigate to learning interface with the topic as a query parameter
      router.push(`/learn?topic=${encodeURIComponent(topic)}`);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-300 flex items-center justify-center p-8">
      <main className="w-full max-w-2xl">
        <div className="bg-white border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 mb-8">
          <h1 className="text-6xl font-black mb-4 text-center leading-none">
            AI TUTOR
          </h1>
          <p className="text-2xl font-bold text-center mb-8 text-gray-800">
            Learn anything, anywhere, anytime.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What do you want to learn today?"
              className="w-full text-2xl font-bold p-6 border-0 outline-none bg-transparent placeholder:text-gray-500"
              autoFocus
            />
            <div className="border-t-8 border-black">
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white text-2xl font-black py-6 px-8 transition-colors border-0 cursor-pointer"
              >
                START LEARNING
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xl font-bold text-black">
            Powered by AI • Interactive • Personalized
          </p>
        </div>
      </main>
    </div>
  );
}
