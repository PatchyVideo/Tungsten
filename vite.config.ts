import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import simpleGit from 'simple-git'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import { version } from './package.json'

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const data = {
    mode,
    isDev: mode !== 'production',
    isProd: mode === 'production',
    version,
    gitLatest: (await simpleGit().log({ maxCount: 1 })).latest || { hash: 'unknown', date: new Date().toISOString() },
    date: new Date(),
  }

  return defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    define: {
      '__DEV__': JSON.stringify(mode !== 'production'),
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
      'import.meta.env.VITE_COMMIT_HASH': JSON.stringify(data.gitLatest.hash),
      'import.meta.env.VITE_APP_BUILDTIME': JSON.stringify(data.date.toISOString()),
    },
    plugins: [
      VueRouter({}),
      vue(),
      UnoCSS(),
      AutoImport({
        imports: [
          'vue',
          '@vueuse/core',
          VueRouterAutoImports,
          {
            '@vue/apollo-composable': [
              'useQuery',
              'useLazyQuery',
            ],
            'graphql-tag': [
              'gql',
            ],
            'nprogress': [
              ['default', 'NProgress'],
            ],
            'vue-toastification': ['useToast'],
          },
          {
            from: '@/graphql',
            imports: ['Query', 'schema'],
            type: true,
          },
        ],
        dts: true,
        dirs: [
          'src/apis/**',
          'src/composables/**',
          'src/utils/**',
          'src/stores',
        ],
        vueTemplate: true,
        eslintrc: {
          enabled: true,
        },
      }),
      Components({
        resolvers: [
          HeadlessUiResolver({ prefix: 'H' }),
        ],
      }),
    ],
  })
})
