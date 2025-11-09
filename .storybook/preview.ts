import type { Preview } from '@storybook/vue3-vite'
import '../src/assets/main.css'

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'app-dark',
      values: [
        { name: 'app-dark', value: '#0f172a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  decorators: [
    (story) => ({
      components: { story },
      template: `
        <div class="min-h-screen bg-slate-950 text-slate-100">
          <div class="mx-auto min-h-screen max-w-6xl px-4 py-10">
            <story />
          </div>
        </div>
      `,
    }),
  ],
}

export default preview