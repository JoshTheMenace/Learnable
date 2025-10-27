# Learnable

The Lovable.dev or Bolt.new — but for personalized learning. Learn anything with AI-generated lessons, interactive games, and quizzes — a glimpse at what education could look like when it’s re-imagined through AI.

[This project was created for the Fall 2025 Weber State Hackathon, winning 2 prizes.](https://devpost.com/software/learnable-bcsnf5)

![AI Tutor Demo](https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/837/204/datas/gallery.jpg)

## Demo Video

[![Watch the demo](https://img.youtube.com/vi/wGg4vOetBNg/maxresdefault.jpg)](https://www.youtube.com/watch?v=wGg4vOetBNg)

[View Full Demo on YouTube](https://www.youtube.com/watch?v=wGg4vOetBNg)

## Features

- **AI-Powered Lesson Plans**: Generate comprehensive, structured lessons on any topic using Claude AI
- **Interactive Learning Environments**: Create live, runnable code examples directly in the browser
- **Real-Time Chat Interface**: Ask questions and get instant AI-powered responses about your lesson
- **Adaptive Content**: Lessons adjust based on your questions and learning pace
- **Dynamic UI**: Responsive interface with expandable panels for lesson content and coding environments
- **Neobrutalist Design**: Bold, eye-catching interface that makes learning fun

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **AI Integration**: Anthropic Claude (via Claude Agent SDK), Cerebras
- **Styling**: Tailwind CSS 4
- **Streaming**: Real-time AI responses using streaming APIs
- **Content Rendering**: React Markdown for lesson formatting

## Getting Started

### Prerequisites

- Node.js 20+ installed
- npm, yarn, pnpm, or bun
- Anthropic API key (for Claude AI)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-tutor.git
cd ai-tutor
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your API keys:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
CEREBRAS_API_KEY=your_cerebras_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

1. **Choose Your Topic**: Enter any subject you want to learn about
2. **AI Generates Lesson**: Claude AI creates a structured lesson plan with explanations and examples
3. **Interactive Environments**: Click buttons in the lesson to generate live code demonstrations
4. **Ask Questions**: Use the chat interface to ask questions and deepen your understanding
5. **Learn at Your Pace**: Explore concepts with adaptive content that responds to your needs

## Project Structure

```
ai-tutor/
├── app/
│   ├── api/
│   │   ├── learn/          # Main AI learning endpoint
│   │   ├── reset-content/  # Content reset functionality
│   │   └── write-content/  # Content writing API
│   ├── learn/              # Main learning interface
│   └── page.tsx            # Landing page
├── components/
│   ├── chat/               # Chat interface components
│   └── content/            # Content display components
└── public/                 # Static assets
```

## API Routes

- `POST /api/learn` - Main endpoint for AI lesson generation and chat
- `POST /api/reset-content` - Resets lesson and environment content
- `POST /api/write-content` - Writes content to lesson/environment panels

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [Anthropic Claude](https://www.anthropic.com/)
- Designed with [Tailwind CSS](https://tailwindcss.com/)

---

Created by [JoshTheMenace](https://github.com/JoshTheMenace)
