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
- **Payments:** Stripe Checkout (pay-per-session)
- **Auth:** JWT session tokens (jose library)

---

## File Structure

```
malik-stone-chat-site/
├── app/                          # Next.js App Router directory
│   ├── api/                      # API routes (backend)
│   │   ├── chat/
│   │   │   └── route.ts          # POST endpoint for Grok AI chat
│   │   ├── create-checkout/
│   │   │   └── route.ts          # Creates Stripe checkout session
│   │   ├── payment-success/
│   │   │   └── route.ts          # Handles successful payment, sets session
│   │   └── verify-session/
│   │       └── route.ts          # Verifies user has paid for access
│   ├── chat/
│   │   └── page.tsx              # Protected chat page (requires payment)
│   ├── globals.css               # Global styles, animations, CSS variables
│   ├── layout.tsx                # Root layout (metadata, background effects)
│   └── page.tsx                  # Landing page with payment button
│
├── public/                       # Static assets
│   └── malik-stone-first-post.png  # AI avatar image
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

### `/app/page.tsx` — Landing Page

The entry point for Instagram traffic. Contains:

- **Hero Section:** Avatar, title, description
- **Features List:** Highlights what users get
- **Payment Button:** Triggers Stripe Checkout
- **Trust Badges:** "Secure Payment" / "Powered by Stripe"

### `/app/chat/page.tsx` — Protected Chat Interface

The chat page (requires payment). Contains:

- **Session Check:** Verifies payment on mount, redirects if unauthorized
- **State Management:** Messages array, input value, loading states
- **Message Display:** Animated message bubbles with user/assistant styling
- **Input Area:** Textarea with Enter-to-send, loading states
- **Empty State:** Welcome message when no conversation exists
- **Typing Indicator:** Animated dots while AI responds

Key features:
- Protected by session token (must pay to access)
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

### Payment Flow
```
Landing Page (/) → Click "Chat with Me $5"
     ↓
POST /api/create-checkout → Stripe Checkout Session
     ↓
Redirect to Stripe Checkout (external)
     ↓
User Pays $5
     ↓
Stripe redirects to /api/payment-success
     ↓
Verify payment → Create JWT session token → Set cookie
     ↓
Redirect to /chat (protected page)
```

### Chat Flow
```
User Input → /chat/page.tsx (client)
     ↓
Verify session cookie (on mount)
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

### Step by Step
1. User lands on `/` from Instagram bio
2. Clicks "Chat with Me - $5" button
3. Redirected to Stripe Checkout
4. Completes payment
5. Stripe redirects to `/api/payment-success`
6. Server verifies payment, creates session token (JWT)
7. Token stored in HTTP-only cookie (24 hour expiry)
8. User redirected to `/chat`
9. Chat page verifies session on load
10. User can now chat with AI

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `XAI_API_KEY` | Yes | Grok AI API key from console.x.ai |
| `OPENAI_API_KEY` | Yes | OpenAI API key for moderation from platform.openai.com |
| `STRIPE_SECRET_TEST_KEY` | Yes | Stripe secret key from dashboard.stripe.com |
| `SESSION_SECRET` | Yes | Random string for signing JWT tokens (min 32 chars) |
| `NEXT_PUBLIC_BASE_URL` | Yes | Your site URL (e.g., https://yourdomain.com) |

Create `.env.local` file (git-ignored):
```
XAI_API_KEY=xai-xxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
STRIPE_SECRET_TEST_KEY=sk_test_xxxxxxxxxxxxx
SESSION_SECRET=your-random-secret-string-at-least-32-characters
NEXT_PUBLIC_BASE_URL=http://localhost:3000
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

## Stripe Paywall

The site requires a $5 payment before users can access the chat. This uses Stripe Checkout for secure payment processing.

### How It Works

1. **Landing Page** (`/`) — Shows avatar, description, and "Chat with Me - $5" button
2. **Checkout** — Clicking the button creates a Stripe Checkout session and redirects to Stripe
3. **Payment** — User enters card details on Stripe's hosted page
4. **Success** — After payment, Stripe redirects to `/api/payment-success`
5. **Session Token** — Server verifies payment, creates a JWT, stores it in an HTTP-only cookie
6. **Chat Access** — User is redirected to `/chat`, which verifies the session before allowing access

### Session Details

- **Token Type:** JWT (JSON Web Token)
- **Storage:** HTTP-only cookie (secure, not accessible via JavaScript)
- **Expiry:** 24 hours from payment
- **Validation:** Checked on every `/chat` page load

### Stripe Test Mode

For testing, use Stripe test keys (start with `sk_test_`). Test card: `4242 4242 4242 4242`

### Changing the Price

Edit `/app/api/create-checkout/route.ts`:
```typescript
unit_amount: 500, // $5.00 in cents — change to 1000 for $10, etc.
```

---

## Customization Points

| What | Where | Notes |
|------|-------|-------|
| AI Personality | `app/api/chat/route.ts` | Edit `SYSTEM_PROMPT` |
| Colors/Theme | `tailwind.config.ts` | Modify color palette |
| Animations | `app/globals.css` | CSS keyframes section |
| Branding | `app/layout.tsx` | Metadata title/description |
| Landing Page | `app/page.tsx` | Hero, features, CTA button |
| Chat Page | `app/chat/page.tsx` | Header, messages, input |
| Price | `app/api/create-checkout/route.ts` | `unit_amount` in cents |
| Session Expiry | `app/api/payment-success/route.ts` | `setExpirationTime()` |

---

## Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

