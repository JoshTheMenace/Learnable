import { tool, createSdkMcpServer } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import { generateText } from 'ai';
import { cerebras } from '@ai-sdk/cerebras';

// Tool for generating lesson plans using Cerebras Qwen
const generateLessonPlanTool = tool(
  'generate_lesson_plan',
  'Generate a lesson plan section in Markdown format using Cerebras Qwen model',
  {
    topic: z.string().describe('The topic to create a lesson about'),
    section: z.string().describe('Which section of the lesson to generate (e.g., "Introduction", "Core Concepts", "Examples")'),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).describe('The difficulty level for the lesson'),
  },
  async ({ topic, section, difficulty }) => {
    const prompt = `Create a ${section} section for a ${difficulty} level lesson about ${topic}.
    Format the response as clear, educational Markdown content with:
    - Appropriate headings (##, ###)
    - Clear explanations
    - Examples where relevant
    - Bullet points for key concepts
    - Code blocks if applicable
    - Interactive elements using special button syntax: [Button Text](button:type:description)
      - Available types: demo, quiz, exercise, visualization, simulation
      - Example: [Explore Rock Formation](button:visualization:Show how different rock types form over time)
      - Example: [Take Quiz](button:quiz:Test your knowledge about rock classification)
      - Example: [Try Exercise](button:exercise:Practice identifying rock samples)

    Include 2-3 interactive buttons throughout the lesson that would help students engage with the material.
    Make it engaging and interactive for learning.`;

    const result = await generateText({
      model: cerebras('gpt-oss-120b'),
      prompt,
      temperature: 0.7,
      maxTokens: 1500,
    });

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            content: result.text,
            section,
            topic,
          })
        }
      ],
    };
  }
);

// Tool for generating interactive environments using Cerebras Coder
const generateInteractiveEnvironmentTool = tool(
  'generate_interactive_environment',
  'Generate p5.js code for interactive visualizations using Cerebras Qwen Coder model',
  {
    concept: z.string().describe('The concept to visualize (e.g., "sorting algorithms", "physics simulation")'),
    type: z.enum(['visualization', 'simulation', 'game', 'interactive-demo']).describe('Type of interactive environment'),
    requirements: z.string().describe('Specific requirements for the visualization'),
  },
  async ({ concept, type, requirements }) => {
    const prompt = `Create p5.js JavaScript code for a ${type} about ${concept}.
    Requirements: ${requirements}

    Generate complete, working p5.js code that:
    - Uses setup() and draw() functions
    - Is educational and interactive
    - Includes comments explaining key parts
    - Uses appropriate p5.js functions for visualization
    - Has user interaction (mouse, keyboard) where relevant
    - Is engaging and helps understand the concept

    Return only the JavaScript code without markdown code blocks.`;

    const result = await generateText({
      model: cerebras('qwen-3-coder-480b'),
      prompt,
      temperature: 0.3,
      maxTokens: 2000,
    });

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            code: result.text,
            concept,
            type,
          })
        }
      ],
    };
  }
);

// Tool for updating existing environments
const updateInteractiveEnvironmentTool = tool(
  'update_interactive_environment',
  'Update existing p5.js code based on user requests using Cerebras Qwen Coder',
  {
    currentCode: z.string().describe('The current p5.js code'),
    modification: z.string().describe('What changes the user wants to make'),
  },
  async ({ currentCode, modification }) => {
    const prompt = `Here is the current p5.js code:

    ${currentCode}

    The user wants to: ${modification}

    Update the code to implement this change. Return only the complete updated JavaScript code without markdown code blocks.
    Maintain the overall structure and functionality while making the requested changes.`;

    const result = await generateText({
      model: cerebras('qwen-3-coder-480b'),
      prompt,
      temperature: 0.3,
      maxTokens: 2000,
    });

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            code: result.text,
            modification,
          })
        }
      ],
    };
  }
);

// Tool for answering questions directly
const answerQuestionDirectlyTool = tool(
  'answer_question_directly',
  'Provide direct text responses to user questions using Cerebras Qwen',
  {
    question: z.string().describe('The user\'s question'),
    context: z.string().optional().describe('Additional context about the current lesson or topic'),
  },
  async ({ question, context }) => {
    const prompt = `Answer this question in a clear, educational way: ${question}

    ${context ? `Context: ${context}` : ''}

    Provide a helpful, accurate response that:
    - Directly answers the question
    - Is educational and easy to understand
    - Includes examples if helpful
    - Encourages further learning`;

    const result = await generateText({
      model: cerebras('gpt-oss-120b'),
      prompt,
      temperature: 0.6,
      maxTokens: 1000,
    });

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            answer: result.text,
            question,
          })
        }
      ],
    };
  }
);

// Create the MCP server with tools
export const tutorMcpServer = createSdkMcpServer({
  name: 'ai-tutor-tools',
  version: '1.0.0',
  tools: [
    generateLessonPlanTool,
    generateInteractiveEnvironmentTool,
    updateInteractiveEnvironmentTool,
    answerQuestionDirectlyTool,
  ],
});