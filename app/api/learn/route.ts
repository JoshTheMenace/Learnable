import { NextRequest, NextResponse } from 'next/server';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import { tutorMcpServer } from '@/lib/agents/orchestrator';

// Schema for the API request payload
const LearnRequestSchema = z.object({
  sessionId: z.string(),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
  currentLessonSection: z.string().optional(),
  currentEnvironmentCode: z.string().optional(),
  userInput: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, chatHistory, currentLessonSection, currentEnvironmentCode, userInput } =
      LearnRequestSchema.parse(body);

    // Create context-aware prompt for the orchestrator agent
    const contextPrompt = `I am an AI tutor helping users learn interactively.

CURRENT SESSION STATE:
- Session ID: ${sessionId}
- Current Lesson: ${currentLessonSection || 'None - ready to start new lesson'}
- Interactive Environment: ${currentEnvironmentCode ? 'Active visualization available' : 'None - ready to create'}

PREVIOUS CONVERSATION:
${chatHistory.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')}

USER REQUEST: ${userInput}

Please help the user learn by:
1. For new topics: Use generate_lesson_plan to create educational content
2. For visualizations: Use generate_interactive_environment to create p5.js code
3. For code modifications: Use update_interactive_environment with current code
4. For questions: Use answer_question_directly for explanations

Always be educational, engaging, and make learning interactive when possible.`;

    // Use Claude Agent SDK to query with MCP tools
    const orchestratorQuery = query({
      prompt: contextPrompt,
      options: {
        model: 'claude-3-5-sonnet-20241022',
        mcpServers: {
          'tutor-tools': tutorMcpServer,
        },
        systemPrompt: {
          type: 'preset',
          preset: 'claude_code',
          append: `You are an AI tutor orchestrator. Use the available tools to help users learn effectively. Always prioritize educational value and interactivity.`
        },
        maxTurns: 3,
        temperature: 0.7,
      },
    });

    // Stream the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const message of orchestratorQuery) {
            if (message.type === 'assistant') {
              // Extract content from assistant messages
              const content = message.message.content;

              if (Array.isArray(content)) {
                for (const block of content) {
                  if (block.type === 'text') {
                    const chunk = `data: ${JSON.stringify({
                      type: 'text',
                      content: block.text
                    })}\n\n`;
                    controller.enqueue(encoder.encode(chunk));
                  } else if (block.type === 'tool_use') {
                    const chunk = `data: ${JSON.stringify({
                      type: 'tool_use',
                      tool_name: block.name,
                      input: block.input
                    })}\n\n`;
                    controller.enqueue(encoder.encode(chunk));
                  }
                }
              }
            } else if (message.type === 'result') {
              const chunk = `data: ${JSON.stringify({
                type: 'done',
                result: message.result
              })}\n\n`;
              controller.enqueue(encoder.encode(chunk));
            }
          }
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in /api/learn:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}