'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block mb-6"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-amethyst via-electric to-coral p-[3px] avatar-glow">
            <img 
              src="/malik-stone-first-post.png" 
              alt="Malik Stone" 
              className="w-full h-full rounded-full object-cover object-top"
            />
          </div>
          {/* Online indicator */}
          <div className="absolute bottom-2 right-2 w-5 h-5 bg-electric rounded-full border-2 border-obsidian">
            <div className="pulse-ring w-full h-full bg-electric rounded-full" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-4xl md:text-5xl font-bold gradient-text mb-3"
        >
          Malik Stone
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-lg md:text-xl font-light mb-8"
        >
          Your companion • Always here to chat ✨
        </motion.p>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Ready for a real conversation? I'm here to chat about anything on your mind. 
            Life, dreams, advice, or just vibing together. Let's connect! 💜
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {['💬 Real Conversations', '🎯 Personal Advice', '✨ Always Available'].map((feature, i) => (
            <span 
              key={i}
              className="bg-twilight/50 border border-gray-700/50 rounded-full px-4 py-2 text-sm text-gray-300"
            >
              {feature}
            </span>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="relative group w-full md:w-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-amethyst via-electric to-coral rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
            <div className={`relative flex items-center justify-center gap-3 bg-gradient-to-r from-amethyst to-purple-600 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 ${isLoading ? 'opacity-80' : 'hover:shadow-xl hover:shadow-amethyst/30'}`}>
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span>Chat with Me</span>
                  <span className="text-white/80">$5</span>
                </>
              )}
            </div>
          </button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center justify-center gap-4 text-gray-500 text-sm"
        >
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure Payment
          </span>
          <span>•</span>
          <span>Powered by Stripe</span>
        </motion.div>
      </div>
    </div>
  )
}
