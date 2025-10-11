'use client';

import { useState } from 'react';

interface EnvironmentButtonProps {
  type: 'demo' | 'quiz' | 'exercise' | 'visualization' | 'simulation';
  description: string;
  prompt: string;
  label?: string;
  onTrigger?: (type: string, prompt: string) => void;
}

const environmentIcons = {
  demo: '🎮',
  quiz: '📝',
  exercise: '💪',
  visualization: '📊',
  simulation: '🔬'
};

const environmentColors = {
  demo: 'bg-blue-500 hover:bg-blue-600',
  quiz: 'bg-green-500 hover:bg-green-600',
  exercise: 'bg-purple-500 hover:bg-purple-600',
  visualization: 'bg-orange-500 hover:bg-orange-600',
  simulation: 'bg-red-500 hover:bg-red-600'
};

export default function EnvironmentButton({
  type,
  description,
  prompt,
  label,
  onTrigger
}: EnvironmentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      // Call the parent's trigger function if provided
      if (onTrigger) {
        await onTrigger(type, prompt);
      } else {
        // Default behavior: make API call to generate environment
        const response = await fetch('/api/generate-environment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type,
            prompt,
            description
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate environment');
        }
      }
    } catch (error) {
      console.error('Error generating environment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-4 p-4 border-4 border-black bg-yellow-100 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{environmentIcons[type]}</div>
        <div className="flex-1">
          <h4 className="font-black text-lg mb-2">
            {label || `Interactive ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          </h4>
          <p className="text-sm font-medium text-gray-700 mb-3">
            {description}
          </p>
          <button
            onClick={handleClick}
            disabled={isLoading}
            className={`
              px-4 py-2 text-white font-black border-4 border-black
              transition-colors duration-200 rounded-lg
              ${environmentColors[type]}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
            `}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </span>
            ) : (
              `Launch ${type.charAt(0).toUpperCase() + type.slice(1)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}