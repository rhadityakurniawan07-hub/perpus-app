const tailwindConfig = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        lavender: '#f5f3ff',
        ink: '#1e1b4b',
        archive: '#241f38',
        warm: {
          50: '#fef3e7',
          400: '#c8874a',
          500: '#b06a35',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 2px 12px rgba(79, 70, 229, 0.08)',
        card: '0 4px 20px rgba(30, 27, 75, 0.06)',
        hero: '0 24px 60px rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'hero-library': "url('/hero-library.jpg')",
      },
    },
  },
  plugins: [],
};
export default tailwindConfig;