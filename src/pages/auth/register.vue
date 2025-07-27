<script setup lang="ts">
const username = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')
const email = ref<string>('')
const errMsg = ref<string>('')
const loading = ref<boolean>(false)

const router = useRouter()

async function register() {
  if (!validate())
    return

  if (loading.value)
    return

  loading.value = true

  try {
    // 检查用户名是否存在
    const usernameExists = await checkUsername(username.value)
    if (usernameExists) {
      errMsg.value = '用户名已存在'
      return
    }

    // 检查邮箱是否存在
    const emailExists = await checkEmail(email.value)
    if (emailExists) {
      errMsg.value = '邮箱已被使用'
      return
    }

    // 获取会话令牌
    const session = await getSession()
    if (!session)
      return

    // 注册用户
    await userSignup(username.value, password.value, session, email.value)
    await useUserStore().refetch()
    router.push('/')
  }
  catch (error) {
    errMsg.value = (error as Error).message
  }
  finally {
    loading.value = false
  }
}

function validate() {
  if (!username.value) {
    errMsg.value = '用户名不能为空'
  }
  else if (username.value.length < 2 || username.value.length > 32) {
    errMsg.value = '用户名长度在2~32之间'
  }
  else if (!email.value) {
    errMsg.value = '邮箱不能为空'
  }
  else if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email.value)) {
    errMsg.value = '请输入有效的邮箱地址'
  }
  else if (!password.value) {
    errMsg.value = '密码不能为空'
  }
  else if (password.value.length < 6 || password.value.length > 64) {
    errMsg.value = '密码长度在6~64之间'
  }
  else if (password.value !== confirmPassword.value) {
    errMsg.value = '两次输入的密码不一致'
  }
  else {
    errMsg.value = ''
    return true
  }
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
    <span class="ml-2 border-y-0 border-l-2 border-r-0 border-gray-600 border-style-solid pl-4 text-lg">注册</span>
  </div>

  <!-- form -->
  <form
    class="w-full space-y-4"
    @submit.prevent="register"
  >
    <input
      v-model="username"
      class="w-full border-b-purple rounded-lg border-x-none border-t-none px-2 py-2 outline-none"
      name="username"
      type="text"
      placeholder="用户名"
      @blur="validate"
    >
    <input
      v-model="email"
      class="w-full border-b-purple rounded-lg border-x-none border-t-none px-2 py-2 outline-none"
      name="email"
      type="email"
      placeholder="邮箱"
      @blur="validate"
    >
    <input
      v-model="password"
      class="w-full border-b-purple rounded-lg border-x-none border-t-none px-2 py-2 outline-none"
      name="password"
      type="password"
      placeholder="密码"
      @blur="validate"
    >
    <input
      v-model="confirmPassword"
      class="w-full border-b-purple rounded-lg border-x-none border-t-none px-2 py-2 outline-none"
      name="confirmPassword"
      type="password"
      placeholder="确认密码"
      @blur="validate"
    >

    <button class="w-full rounded-md border-none bg-purple-500 py-2 text-xl text-white dark:bg-purple-600 disabled:bg-purple-300 hover:bg-purple-600 focus:outline-none dark:hover:bg-purple-700 disabled:dark:bg-purple-400 disabled:hover:bg-purple-300 disabled:dark:hover:bg-purple-400">
      <span v-if="loading">
        注册中...
      </span>
      <span v-else>
        注册
      </span>
    </button>
  </form>

  <!-- errMsg -->
  <div v-if="errMsg" class="text-sm text-red-500">
    {{ errMsg }}
  </div>

  <div class="flex justify-center text-sm text-purple-600 -mt-2 dark:text-purple-300">
    <RouterLink to="/login">
      已有账号？去登录
    </RouterLink>
  </div>
</template>

<style scoped>
.login {
  background-image: url('@/assets/login.jpg');
}
</style>
