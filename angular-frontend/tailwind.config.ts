import type { Config } from 'tailwindcss'

export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'pumpkin-spice': 'var(--color-pumpkin-spice)',
        'platinum': 'var(--color-platinum)',
        'silver': 'var(--color-silver)',
        'rich-cerulean': 'var(--color-rich-cerulean)',
        'steel-azure': 'var(--color-steel-azure)',
      },
    },
  },
  plugins: [],
} satisfies Config