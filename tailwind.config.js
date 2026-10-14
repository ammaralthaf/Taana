/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Colours read CSS variables defined in src/index.css, so light and dark themes switch automatically.
      colors: {
        bg: 'var(--bg)',
        panel: 'var(--panel)',
        panel2: 'var(--panel2)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        accent: 'var(--accent)',
        onaccent: 'var(--on-accent)',
        stage: 'var(--stage)',
        hero: 'var(--hero)',
        danger: 'var(--danger)',
        deep: 'var(--deep)',
        ondeep: 'var(--on-deep)'
      },
      fontFamily: {
        display: ["'Archivo'", 'system-ui', 'sans-serif'],
        body: ["'Archivo'", 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
