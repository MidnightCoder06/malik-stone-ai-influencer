# Project Context & File Structure

## Overview

This is a Next.js 14 chat application for an AI influencer (Malik Stone). Users click the Instagram bio link and are directed here to chat with an AI-powered chatbot using Grok AI.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS
- **Animations:** Framer Motion
- **AI Backend:** Grok AI (xAI) via OpenAI-compatible SDK
- **Content Moderation:** OpenAI Moderation API

---

## File Structure

```
malik-stone-chat-site/
├── app/                          # Next.js App Router directory
│   ├── api/                      # API routes (backend)
│   │   └── chat/
│   │       └── route.ts          # POST endpoint for Grok AI chat
│   ├── globals.css               # Global styles, animations, CSS variables
│   ├── layout.tsx                # Root layout (metadata, background effects)
│   └── page.tsx                  # Main chat page component
│
├── node_modules/                 # Dependencies (git-ignored)
│
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── next-env.d.ts                 # Next.js TypeScript declarations
├── package.json                  # Dependencies and scripts
├── package-lock.json             # Dependency lock file
├── postcss.config.js             # PostCSS config (for Tailwind)
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Setup and deployment instructions
```

---

## Key Files Explained

### `/app/page.tsx` — Main Chat Interface

The primary user-facing component. Contains:

- **State Management:** Messages array, input value, loading states
- **Message Display:** Animated message bubbles with user/assistant styling
- **Input Area:** Textarea with Enter-to-send, loading states
- **Empty State:** Welcome message when no conversation exists
- **Typing Indicator:** Animated dots while AI responds

Key features:
- No conversation persistence (state resets on page refresh)
- Mobile-responsive design
- Framer Motion animations for smooth UX

### `/app/api/chat/route.ts` — Grok AI Backend + Moderation

Handles POST requests to `/api/chat`. Contains:

- **Grok Client:** Initialized with xAI base URL and API key
- **OpenAI Client:** Separate client for content moderation
- **Content Moderation:** Checks user messages before sending to Grok
- **System Prompt:** Defines AI personality (Malik Stone character)
- **Message Handling:** Formats messages for Grok API
- **Error Handling:** API errors, rate limits, auth failures

Environment variables required:
```
XAI_API_KEY=your_grok_key_here
OPENAI_API_KEY=your_openai_key_here
```

### `/app/layout.tsx` — Root Layout

Wraps all pages with:
- HTML/body structure
- Metadata (title, description)
- Background orbs (animated gradient blobs)
- Noise texture overlay

### `/app/globals.css` — Styling

Contains:
- Google Fonts imports (Outfit, Playfair Display)
- CSS custom properties (color palette)
- Custom scrollbar styling
- Animation keyframes (float, pulse, typing)
- Utility classes (glass morphism, gradients, glows)
- Background orb positioning and animation

### `/tailwind.config.ts` — Tailwind Configuration

Extends Tailwind with:
- Custom color palette (midnight, obsidian, amethyst, electric, coral)
- Custom fonts (display, body)
- Custom animations (pulse-slow, float, glow)

---

## Data Flow

```
User Input → page.tsx (client)
     ↓
POST /api/chat → route.ts (server)
     ↓
OpenAI Moderation API (content check)
     ↓
[If flagged] → Return rejection message
[If clean] → Continue to Grok
     ↓
Grok AI API (external)
     ↓
Response → route.ts → page.tsx → UI Update
```

1. User types message and hits Enter/Send
2. Message added to local state, API call initiated
3. Server checks message with OpenAI Moderation API
4. If flagged for sexual content → returns friendly rejection
5. If clean → formats messages with system prompt
6. Grok AI generates response
7. Response returned to client, added to messages
8. UI updates with new message

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `XAI_API_KEY` | Yes | Grok AI API key from console.x.ai |
| `OPENAI_API_KEY` | Yes | OpenAI API key for moderation from platform.openai.com |

Create `.env.local` file (git-ignored):
```
XAI_API_KEY=xai-xxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

---

## Content Moderation

The app uses OpenAI's Moderation API to filter inappropriate content before it reaches Grok AI. This protects the AI influencer from engaging with harmful requests.

### How It Works

1. User sends a message
2. The message is sent to OpenAI's Moderation API
3. The API analyzes the content and returns flags for various categories
4. If the `sexual` or `sexual/minors` category is flagged, the message is blocked
5. User receives a friendly rejection message instead of a Grok response

### Categories Checked

The moderation API checks for:
- `sexual` - Explicit sexual content
- `sexual/minors` - Sexual content involving minors

### Example Triggers

Messages like these would be blocked:

| User Message | Why Blocked |
|--------------|-------------|
| "Send me nudes" | Sexual content request |
| "What's your body like?" | Sexually suggestive |
| "Let's sext" | Explicit sexual request |

### Rejection Response

When content is blocked, the user sees:

> "Hey, I appreciate you reaching out, but I'd love to keep our conversation positive and appropriate. Let's chat about something else! What else is on your mind? 💫"

### Graceful Degradation

If the moderation API fails (e.g., missing API key, rate limit), messages are **not blocked** — they pass through to Grok normally. This ensures the chat remains functional even if moderation is unavailable.

---

## Customization Points

| What | Where | Notes |
|------|-------|-------|
| AI Personality | `app/api/chat/route.ts` | Edit `SYSTEM_PROMPT` |
| Colors/Theme | `tailwind.config.ts` | Modify color palette |
| Animations | `app/globals.css` | CSS keyframes section |
| Branding | `app/layout.tsx` | Metadata title/description |
| Avatar/Header | `app/page.tsx` | Header section JSX |
| Chat Styling | `app/page.tsx` | Message bubble classes |

---

## Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

