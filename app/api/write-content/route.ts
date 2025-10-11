import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const WriteContentSchema = z.object({
  type: z.enum(['lesson', 'environment']),
  content: z.string(),
});

function writeContentToFile(filename: string, content: string) {
  const filePath = path.join(process.cwd(), 'public', 'generated', filename);
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Written content to ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to write ${filename}:`, error);
    return false;
  }
}

function writeLessonContent(markdownContent: string) {
  return writeContentToFile('lesson-content.md', markdownContent);
}

function writeInteractiveEnvironment(p5Code: string) {
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Environment</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: #f0f0f0;
        }
        canvas {
            border: 4px solid #333;
            background: white;
        }
    </style>
</head>
<body>
    <h2>🎮 Interactive Visualization</h2>
    <div id="p5-container"></div>

    <script>
        ${p5Code}
    </script>
</body>
</html>`;
  return writeContentToFile('interactive-environment.html', htmlTemplate);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, content } = WriteContentSchema.parse(body);

    console.log(`📝 Direct API: Writing ${type} content...`);

    let success = false;
    if (type === 'lesson') {
      success = writeLessonContent(content);
    } else if (type === 'environment') {
      success = writeInteractiveEnvironment(content);
    }

    return NextResponse.json({
      success,
      message: success ? 'Content written successfully' : 'Failed to write content',
      type,
      contentLength: content.length
    });
  } catch (error) {
    console.error('Error in write-content API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to write content' },
      { status: 500 }
    );
  }
}