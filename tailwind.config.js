/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./layouts/**/*.html",
    "./src/**/*.{js,css}"
  ],
  theme: {
    extend: {
      colors: {
        // Interlou purple theme
        background: {
          DEFAULT: '#371554',
          alt: '#451d67'
        },
        text: {
          DEFAULT: '#eeeeee',
          alt: '#cda0f4'
        },
        accent: {
          DEFAULT: 'rgb(217, 70, 239)', // fuchsia-500ish
          alt: '#490123',
          code: 'rgb(162, 28, 175)',    // fuchsia-700ish
          'code-text': 'rgb(245, 208, 254)'
        }
      },
      fontFamily: {
        sans: ['Rubik', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace']
      },
      fontSize: {
        'site-title': ['4rem', { lineHeight: '1', fontWeight: '800' }],
        'heading-1': ['3.625rem', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'heading-3': ['1.125rem', { lineHeight: '1', letterSpacing: '2px', fontWeight: '700' }],
        'body': ['1.125rem', { lineHeight: '1.5' }],
        'blockquote': ['1.75rem', { lineHeight: '1.5' }],
        'code': ['1rem', { lineHeight: '1.5' }]
      },
      spacing: {
        'content-gap': '120px',
        'content-gap-mobile': '60px'
      },
      maxWidth: {
        'content': '1100px'
      }
    }
  },
  plugins: []
}
