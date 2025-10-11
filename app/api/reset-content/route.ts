import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    // Read template files
    const lessonTemplatePath = path.join(process.cwd(), 'public', 'templates', 'lesson-template.html');
    const environmentTemplatePath = path.join(process.cwd(), 'public', 'templates', 'environment-template.html');

    const lessonTemplate = fs.readFileSync(lessonTemplatePath, 'utf8');
    const environmentTemplate = fs.readFileSync(environmentTemplatePath, 'utf8');

    // Write templates to generated files
    const lessonPath = path.join(process.cwd(), 'public', 'generated', 'lesson-content.html');
    const environmentPath = path.join(process.cwd(), 'public', 'generated', 'interactive-environment.html');

    fs.writeFileSync(lessonPath, lessonTemplate, 'utf8');
    fs.writeFileSync(environmentPath, environmentTemplate, 'utf8');

    console.log('✅ Content reset to templates');

    return NextResponse.json({
      success: true,
      message: 'Content reset successfully'
    });
  } catch (error) {
    console.error('❌ Failed to reset content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset content' },
      { status: 500 }
    );
  }
}