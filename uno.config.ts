import { defineConfig, presetIcons, presetUno } from 'unocss'
import { m3Theme } from './src/assets/material-theme'

export default defineConfig({
  presets: [
    presetUno(),
    // https://icones.js.org/collection/mdi
    presetIcons({
      collections: {
        mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
      },
    }),
  ],
  shortcuts: {
    btn: 'select-none px-4 py-2 rounded border-none bg-primary text-onPrimary  hover:bg-primary:80 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out',

  },
  theme: {
    colors: {
      copyright: '#DFBFFF',
      language: '#FFBFCF',
      character: '#AAF2AA',
      author: '#DDDDDD',
      general: '#B2D9FF',
      meta: '#FFDFBA',
      soundtrack: '#AAF2EE',
      ...m3Theme.schemes.light,
      dark: m3Theme.schemes.dark,
    },
  },
  // https://unocss.dev/config/#safelist
  safelist: [
    ...Array.from({ length: 100 }, (_, i) => `w-${i + 1}`),
  ],
})
