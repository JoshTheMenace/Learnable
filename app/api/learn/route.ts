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
        mcpServers: {
          'tutor-tools': tutorMcpServer,
        },
        systemPrompt: `You are an AI tutor orchestrator. You have access to specialized tools for education:

AVAILABLE TOOLS:
- generate_lesson_plan: Create educational content in Markdown format
- generate_interactive_environment: Create p5.js visualizations and simulations
- update_interactive_environment: Modify existing p5.js code
- answer_question_directly: Provide direct explanations

INSTRUCTIONS:
- For new topics: Start with generate_lesson_plan to create educational content
- For visualizations: Use generate_interactive_environment to create p5.js code
- For code changes: Use update_interactive_environment with the current code
- For questions: Use answer_question_directly for explanations
- Always be educational, engaging, and encourage learning
- Make lessons interactive and visual when possible
- DO NOT use any other tools like TodoWrite, Read, Write, etc.
- ONLY use the educational tools provided above

Analyze the user's request and use the appropriate tool(s).`,
        permissionMode: 'bypassPermissions',
        allowedTools: ['generate_lesson_plan', 'generate_interactive_environment', 'update_interactive_environment', 'answer_question_directly'],
        maxTurns: 5,
        //temperature: 0.7,
      },
    });

    // Stream the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const message of orchestratorQuery) {
            console.log('Processing message:', message.type);

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
            } else if (message.type === 'user') {
              // Handle tool results that come back as user messages
              const content = message.message.content;
              if (Array.isArray(content)) {
                for (const block of content) {
                  if (block.type === 'tool_result') {
                    console.log('Tool result found:', block);

                    // Extract the actual tool name from the tool_use_id or content
                    let toolName = 'unknown';
                    if (block.tool_use_id) {
                      // Extract tool name from MCP format
                      const match = block.tool_use_id.match(/mcp__tutor-tools__(.+)/);
                      if (match) {
                        toolName = match[1];
                      }
                    }

                    // Handle different content formats - extract the actual text content
                    let resultContent = block.content;
                    if (Array.isArray(block.content) && block.content.length > 0) {
                      // Get the text from the first content block
                      resultContent = block.content[0].text || block.content[0];
                    }

                    // Only send tool results from our educational tools
                    if (toolName.includes('generate_lesson_plan') ||
                        toolName.includes('generate_interactive_environment') ||
                        toolName.includes('update_interactive_environment') ||
                        toolName.includes('answer_question_directly')) {

                      const chunk = `data: ${JSON.stringify({
                        type: 'tool_result',
                        tool_name: toolName,
                        result: resultContent
                      })}\n\n`;
                      controller.enqueue(encoder.encode(chunk));
                    }
                  }
                }
              }
            } else if (message.type === 'result') {
              let resultData;
              if (message.subtype === 'success') {
                resultData = {
                  type: 'done',
                  success: true,
                  result: message.result,
                  cost: message.total_cost_usd,
                  usage: message.usage
                };
              } else {
                resultData = {
                  type: 'done',
                  success: false,
                  error: message.subtype,
                  cost: message.total_cost_usd,
                  usage: message.usage
                };
              }

              const chunk = `data: ${JSON.stringify(resultData)}\n\n`;
              controller.enqueue(encoder.encode(chunk));
              break; // End the loop when we get the final result
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