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
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Truncate description for display
  const shortDescription = description.length > 120 ?
    description.substring(0, 120) + '...' : description;

  return (
    <div className="my-6 p-3 sm:p-4 border-4 border-black bg-yellow-100 shadow-lg">
      <div className="flex items-start gap-2 sm:gap-4">
        <div className="text-2xl sm:text-3xl flex-shrink-0">{environmentIcons[type]}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-black text-lg sm:text-xl mb-2 sm:mb-3 text-black uppercase leading-tight">
            {label || `Interactive ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          </h4>

          <div className="mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
              {isExpanded ? description : shortDescription}
            </p>
            {description.length > 120 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-bold text-purple-600 mt-1 hover:text-purple-800"
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <button
              onClick={handleClick}
              disabled={isLoading}
              className={`
                w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-white font-black border-4 border-black
                transition-all duration-200 text-sm sm:text-lg
                ${environmentColors[type]}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:translate-x-1 hover:translate-y-1'}
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white border-t-current rounded-full animate-spin"></div>
                  <span className="text-xs sm:text-base">GENERATING...</span>
                </span>
              ) : (
                <span className="text-xs sm:text-base">{`LAUNCH ${type.toUpperCase()}`}</span>
              )}
            </button>

            <div className="text-xs font-bold text-gray-600 bg-white border-2 border-black px-2 py-1 self-start sm:self-auto">
              {type.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}