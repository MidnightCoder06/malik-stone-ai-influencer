'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/verify-session')
        if (response.ok) {
          setIsAuthorized(true)
        } else {
          setIsAuthorized(false)
          router.push('/')
        }
      } catch {
        setIsAuthorized(false)
        router.push('/')
      }
    }
    checkSession()
  }, [router])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      setIsTyping(false)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      setIsTyping(false)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment! 💫",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Show loading while checking authorization
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amethyst border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authorized (will redirect)
  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl flex flex-col h-[90vh] md:h-[85vh]">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-amethyst via-electric to-coral p-[3px] avatar-glow">
              <img 
                src="/malik-stone-first-post.png" 
                alt="Malik Stone" 
                className="w-full h-full rounded-full object-cover object-top"
              />
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-electric rounded-full border-2 border-obsidian">
              <div className="pulse-ring w-full h-full bg-electric rounded-full" />
            </div>
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text mb-2">
            Malik Stone
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-light">
            Your companion • Always here to chat ✨
          </p>
        </motion.div>

        {/* Chat Container */}
        <div className="flex-1 glass rounded-3xl overflow-hidden flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="h-full flex flex-col items-center justify-center text-center px-4"
              >
                <div className="text-5xl mb-4 animate-float">💬</div>
                <h2 className="font-display text-xl md:text-2xl font-semibold mb-2">
                  Hey there! 👋🏾
                </h2>
                <p className="text-gray-400 text-sm md:text-base max-w-sm">
                  I'm so glad you're here. Send me a message and let's vibe together. 
                  Ask me anything. I'm all ears! ❤️
                </p>
              </motion.div>
            ) : (
              <>
                <AnimatePresence mode="popLayout">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-amethyst to-purple-600 text-white rounded-br-md'
                            : 'bg-twilight text-gray-100 rounded-bl-md border border-gray-700/50'
                        }`}
                      >
                        <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-start"
                    >
                      <div className="bg-twilight rounded-2xl rounded-bl-md px-4 py-3 border border-gray-700/50">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-amethyst rounded-full typing-dot" />
                          <div className="w-2 h-2 bg-electric rounded-full typing-dot" />
                          <div className="w-2 h-2 bg-coral rounded-full typing-dot" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-700/30">
            <form onSubmit={handleSubmit} className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  rows={1}
                  className="w-full bg-twilight/50 text-white placeholder-gray-500 rounded-2xl px-4 py-3 pr-4 resize-none focus:outline-none input-glow transition-all duration-300 text-sm md:text-base"
                  style={{ maxHeight: '120px' }}
                  disabled={isLoading}
                />
              </div>
              <motion.button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`send-btn w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  inputValue.trim() && !isLoading
                    ? 'bg-gradient-to-r from-amethyst to-electric text-white shadow-lg shadow-amethyst/30'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                <svg
                  className="w-5 h-5 rotate-45"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

