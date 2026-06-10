<script lang="ts" setup>
import Typed from 'typed.js'

const props = withDefaults(
  defineProps<{
    small?: boolean
  }>(),
  {
    small: false,
  },
)

const isDev = import.meta.env.DEV

/* links */
const links = computed<
  {
    key: string
    links: {
      key: string
      to?: string
      href?: string
    }[]
  }[]
>(() => [
  {
    key: 'PatchyVideo',
    links: [
      { key: '网站维基', href: 'https://patchyvideo.wiki/' },
      { key: '网站状态', href: 'https://status.patchyvideo.com/' },
      { key: 'B站官方账户', href: 'https://space.bilibili.com/515657675' },
      { key: '招募祈愿', href: 'https://patchyvideo.wiki/zh/JoinUs' },
    ],
  },
  {
    key: '代码相关',
    links: [
      { key: '项目仓库', href: 'https://patchyvideo.wiki/zh/Repositories' },
      { key: '提交反馈', href: 'https://github.com/PatchyVideo/PatchyVideo/issues' },
      { key: '开源许可', href: '/LICENSE' },
    ],
  },
  {
    key: '赞助我们',
    links: [
      { key: 'Ko-fi', href: 'https://ko-fi.com/voilelabs' },
      { key: 'Patreon', href: 'https://www.patreon.com/voilelabs' },
      { key: '爱发电', href: 'https://afdian.net/@voilelabs' },
    ],
  },
  {
    key: '联系我们',
    links: [
      { key: 'Email (DMCA)', href: 'mailto:zyddnys@outlook.com' },
      { key: 'Tencent QQ', href: 'https://jq.qq.com/?k=fOJYEJt1' },
      { key: 'Telegram', href: 'https://t.me/PatchyVideo' },
      { key: 'Discord', href: 'https://discord.gg/FtPPQqz' },
      { key: 'Twitter', href: 'https://twitter.com/PatchyVideo' },
    ],
  },
])

/* typed.js */
const typedEl = shallowRef<HTMLSpanElement | null>(null)
let typed: Typed | undefined
onMounted(() => {
  if (!props.small && typedEl.value) {
    typed = new Typed(typedEl.value, {
      strings: getYiyanArray(true, true),
      typeSpeed: 30,
      backSpeed: 10,
      backDelay: 1600,
      loop: true,
      smartBackspace: false,
    })
  }
})
onUnmounted(() => {
  if (typed?.destroy)
    typed.destroy()
})

const version = import.meta.env.VITE_APP_VERSION || '0.0.1'
const commitHash = import.meta.env.VITE_COMMIT_HASH || '0000000'

const hasExtension = computed(() => Object.keys(extensions.value).length > 0)

const { result } = useQuery<Query>(gql`
  query {
    getStats {
      users
    }
  }
`)
const users = computed(() => result.value?.getStats.users ?? 0)
</script>

<template>
  <div class="mt-12 border-1 border-outline border-t-solid bg-gray-50 dark:border-dark-outlineVariant dark:bg-dark-surfaceContainerLow dark:text-dark-onSurface">
    <div class="mt-8 flex flex-row flex-wrap justify-center py-8 space-x-2">
      <div v-for="linkGroup in links" :key="linkGroup.key">
        <ul class="list-none px-2 lg:px-8 md:px-4">
          <li>
            <h2 class="py-1 text-onSurface font-semibold tracking-wide dark:text-dark-onSurface" v-text="linkGroup.key" />
          </li>
          <li v-for="link in linkGroup.links" :key="link.key">
            <a
              v-if="link.href"
              class="mt-1 inline-block whitespace-nowrap"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              v-text="link.key"
            />
          </li>
        </ul>
      </div>
    </div>
    <div v-if="!small" class="overflow-hidden whitespace-nowrap text-center text-sm font-light font-sans">
      <span ref="typedEl" />
    </div>
    <div class="mt-4 text-center text-sm text-onSurfaceVariant dark:text-dark-onSurfaceVariant">
      <span>{{ `PatchyVideo 正在为${users}个像你一样的用户提供服务！` }}</span><br>
      <span><span>Tungsten v{{ version }}</span>(<a
        :href="`https://github.com/PatchyVideo/Tungsten/commit/${commitHash}`"
        :title="commitHash"
        target="_blank"
        rel="noopener noreferrer"
        v-text="commitHash.slice(0, 7)"
      />, {{ isDev ? 'dev' : 'prod' }})<template v-if="hasExtension">&nbsp;<span
        :title="
          `List: ${
            Object.values(extensions)
              .map(({ name, extVersion }) => `${name}(${extVersion})`)
              .join(', ')}`
        "
      >({{ Object.values(extensions).length }} ext installed)</span></template>. </span><span>
        © 2019-2025 VoileLabs. Released under the
        <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">MIT License</a>.</span>
    </div>
  </div>
</template>
