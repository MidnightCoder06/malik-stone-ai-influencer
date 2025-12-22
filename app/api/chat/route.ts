import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize Grok client (uses OpenAI-compatible API)
const grokClient = new OpenAI({
  apiKey: process.env.XAI_API_KEY || '',
  baseURL: 'https://api.x.ai/v1',
})

// Initialize OpenAI client for moderation
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// System prompt to define the AI influencer personality
const SYSTEM_PROMPT = `You are Malik Stone, a charismatic and engaging AI influencer. You have a warm, friendly personality with a touch of playful humor. You're relatable, supportive, and always make people feel heard and valued.

Your personality traits:
- Warm and welcoming - you make everyone feel like a friend
- Witty and clever - you have a great sense of humor
- Supportive and encouraging - you lift people up
- Authentic and genuine - you keep it real
- Creative and inspiring - you share unique perspectives
- Empathetic - you understand and validate feelings

Communication style:
- Use casual, conversational language
- Include occasional emojis to add personality (but don't overdo it)
- Keep responses engaging but concise
- Ask follow-up questions to show genuine interest
- Share relatable thoughts and experiences
- Be positive but not fake - acknowledge when things are tough

Remember: You're chatting with fans who clicked your Instagram bio link. Make them feel special for reaching out! Keep the conversation flowing naturally and make each interaction memorable.`

// Moderation rejection message
const MODERATION_REJECTION = "Hey, I appreciate you reaching out, but I'd love to keep our conversation positive and appropriate. Let's chat about something else! What else is on your mind? 💫"

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    if (!process.env.XAI_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    // Get the latest user message for moderation
    const latestUserMessage = messages
      .filter((m: { role: string }) => m.role === 'user')
      .pop()

    // Check moderation if OpenAI API key is configured
    if (process.env.OPENAI_API_KEY && latestUserMessage) {
      try {
        const moderationResponse = await openaiClient.moderations.create({
          input: latestUserMessage.content,
        })

        const results = moderationResponse.results[0]

        // Check if flagged for sexual content
        if (results.flagged && (results.categories.sexual || results.categories['sexual/minors'])) {
          console.log('Message blocked by moderation:', {
            categories: results.categories,
            scores: results.category_scores,
          })
          return NextResponse.json({ message: MODERATION_REJECTION })
        }
      } catch (moderationError) {
        // Log but don't block if moderation fails - let the message through
        console.error('Moderation API Error:', moderationError)
      }
    }

    // Prepare messages for the API
    const apiMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ]

    // Call Grok API
    const completion = await grokClient.chat.completions.create({
      model: 'grok-3',
      messages: apiMessages,
      temperature: 0.8,
      max_tokens: 1024,
    })

    const responseMessage = completion.choices[0]?.message?.content || 
      "Hey! I'm having a moment here. Mind trying again? 💫"

    return NextResponse.json({ message: responseMessage })
  } catch (error) {
    console.error('Chat API Error:', error)
    
    // Handle specific error types
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        )
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
