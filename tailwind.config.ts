import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#05070a', // Darker terminal background
          card: '#0d1117', 
          border: '#30363d',
          text: '#e6edf3',
          muted: '#8b949e',
        },
        accent: {
          green: '#10a37f', // Claude/OpenAI greenish accent
          'green-hover': '#0d8c6d',
          blue: '#2563eb',
        },
        category: {
          agents: '#3b82f6',
          plugins: '#8b5cf6',
          commands: '#eab308',
          settings: '#6b7280',
          hooks: '#f97316',
          integrations: '#10a37f',
          templates: '#ec4899',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
