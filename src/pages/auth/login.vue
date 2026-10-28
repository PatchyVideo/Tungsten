<script setup lang="ts">
import { type ApiError, unwrap } from '@/apis/request'

const username = ref<string>('')
const password = ref<string>('')
const errMsg = ref<string>('')
const loading = ref<boolean>(false)

const router = useRouter()

async function login() {
  if (loading.value)
    return

  errMsg.value = validate() ?? ''
  if (errMsg.value)
    return

  loading.value = true

  const fail = (e: ApiError) => {
    errMsg.value = e.message
    return null
  }

  try {
    const session = await getSession().then(r => unwrap(r, fail))
    if (session == null)
      return

    // keep the full ApiResult so setToken can read the Authorization header
    const loginResult = await userLogin(username.value, password.value, session)
    if (!loginResult.ok) {
      fail(loginResult.error)
      return
    }

    useUserStore().setToken(loginResult)

    await useUserStore().refetch()

    // no history when opened directly; fall back to home
    if (router.options.history.state.back)
      router.back()
    else
      router.push('/home')
  }
  finally {
    loading.value = false
  }
}

/** @returns null if valid, otherwise an error message */
function validate(): string | null {
  if (!username.value)
    return '用户名/邮箱不能为空'
  if (username.value.length < 2 || username.value.length > 32)
    return '用户名/邮箱长度在2~32之间'
  if (!password.value)
    return '密码不能为空'
  if (password.value.length < 6 || password.value.length > 64)
    return '密码长度在6~64之间'
  return null
}

function onBlur() {
  errMsg.value = validate() ?? ''
}
</script>

<route lang="yaml">
  meta:
    layout: auth
</route>

<template>
  <!-- header -->
  <div class="m-b-6 flex items-center text-2xl text-gray-800 space-x-2">
    <Logo :larger="8" />
    <span class="ml-2 border-y-0 border-l-2 border-r-0 border-gray-600 border-style-solid pl-4 text-lg">登录</span>
  </div>

  <!-- form -->
  <form
    class="w-full space-y-4"
    @submit.prevent="login"
  >
    <input
      v-model="username"
      class="w-full border-b-purple rounded-lg border-x-none border-t-none px-2 py-2 outline-none"
      name="username"
      type="text"
      placeholder="用户名/邮箱"
      label="用户名"
      @blur="onBlur"
    >
    <input
      v-model="password"
      class="w-full border-b-purple rounded-lg border-x-none border-t-none px-2 py-2 outline-none"
      name="password"
      type="password"
      placeholder="密码"
      label="密码"
      @blur="onBlur"
    >

    <button class="w-full rounded-md border-none bg-purple-500 py-2 text-xl text-white dark:bg-purple-600 disabled:bg-purple-300 hover:bg-purple-600 focus:outline-none dark:hover:bg-purple-700 disabled:dark:bg-purple-400 disabled:hover:bg-purple-300 disabled:dark:hover:bg-purple-400">
      <span v-if="loading">
        登录中...
      </span>
      <span v-else>
        登录
      </span>
    </button>
  </form>

  <!-- errMsg -->
  <div v-if="errMsg" class="text-sm text-red-500">
    {{ errMsg }}
  </div>

  <div class="flex justify-center gap-2 text-sm text-purple-600 -mt-2 dark:text-purple-300">
    <RouterLink to="/auth/forgot-password">
      忘记密码
    </RouterLink>
    |
    <RouterLink to="/auth/register">
      注册
    </RouterLink>
  </div>
</template>

<style scoped>
.login {
  background-image: url('@/assets/login.jpg');
}
</style>
