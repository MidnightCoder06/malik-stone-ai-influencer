import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Outfit', 'sans-serif'],
      },
      colors: {
        midnight: '#0a0a0f',
        obsidian: '#12121a',
        twilight: '#1a1a2e',
        amethyst: '#9b5de5',
        electric: '#00f5d4',
        coral: '#ff6b6b',
        gold: '#ffd700',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(155, 93, 229, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(155, 93, 229, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}

export default config

