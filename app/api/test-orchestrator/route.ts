import { NextRequest, NextResponse } from 'next/server';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { tutorMcpServer } from '@/lib/agents/orchestrator';

export async function GET(request: NextRequest) {
  try {
    console.log('Starting orchestrator test...');

    // Simple test prompt to demonstrate the orchestrator working
    const testPrompt = `Hello! I want to learn about bubble sort algorithms. Please help me by:
1. Creating a lesson plan about bubble sort
2. Then creating an interactive visualization to show how it works

This is just a test to see if the orchestrator and tools are working properly.`;

    console.log('Creating query with Claude Agent SDK...');

    // Use Claude Agent SDK to query with MCP tools
    const orchestratorQuery = query({
      prompt: testPrompt,
      options: {
        model: 'claude-3-5-sonnet-20241022',
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
For this test, please:
1. Use generate_lesson_plan to create content about bubble sort
2. Use generate_interactive_environment to create a p5.js visualization

Do NOT use any other tools. Focus only on the educational tools provided.`,
        maxTurns: 5,
        temperature: 0.7,
      },
    });

    console.log('Query created, starting to process messages...');

    let messages = [];

    // Collect all messages from the orchestrator
    for await (const message of orchestratorQuery) {
      console.log('Received message type:', message.type);

      if (message.type === 'assistant') {
        console.log('Assistant message:', message.message.content);
        messages.push({
          type: 'assistant',
          content: message.message.content
        });
      } else if (message.type === 'result') {
        console.log('Final result:', message.result);
        messages.push({
          type: 'result',
          result: message.result,
          cost: message.total_cost_usd,
          tokens: message.usage
        });
        break;
      }
    }

    return NextResponse.json({
      success: true,
      messages,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in orchestrator test:', error);
    return NextResponse.json(
      {
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}