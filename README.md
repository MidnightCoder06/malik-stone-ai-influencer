# Malik Stone Chat

A beautiful, modern chat website for your AI influencer Instagram account. Built with Next.js, React, TypeScript, and powered by Grok AI.

## Features

- ✨ Stunning, unique UI with animated gradients and glass morphism
- 💬 Real-time chat with Grok AI
- 📱 Fully responsive (mobile-first for Instagram traffic)
- 🎨 Beautiful animations with Framer Motion
- 🔒 No conversation history saved between sessions
- ⚡ Fast and lightweight

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Grok AI API key from [console.x.ai](https://console.x.ai/)

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up your environment variables:**

Create a `.env.local` file in the root directory:

```bash
XAI_API_KEY=your_xai_api_key_here
```

3. **Run the development server:**

```bash
npm run dev
```

4. **Open your browser:**

Visit [http://localhost:3000](http://localhost:3000) to see your chat site!

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your `XAI_API_KEY` environment variable in Vercel's dashboard
4. Deploy!

### Other Platforms

The site can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- Self-hosted with `npm run build && npm start`

## Customization

### Changing the AI Personality

Edit the `SYSTEM_PROMPT` in `app/api/chat/route.ts` to customize how your AI influencer responds.

### Styling

- Colors and theme: `tailwind.config.ts`
- Global styles: `app/globals.css`
- Main chat UI: `app/page.tsx`

### Branding

Update the title and description in `app/layout.tsx` metadata.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **AI:** Grok AI (via OpenAI-compatible API)

## License

MIT

