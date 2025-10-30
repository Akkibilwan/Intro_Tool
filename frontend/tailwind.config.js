/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0a',
        'bg-secondary': '#1a1a1a',
        'bg-tertiary': '#2a2a2a',
        'accent-blue': '#3b82f6',
        'accent-purple': '#8b5cf6',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0a0',
        'border-color': '#333333',
        'success': '#10b981',
        'error': '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

