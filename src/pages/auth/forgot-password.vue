<script setup lang="ts">
import { type ApiError, unwrap } from '@/apis/request'

const email = ref<string>('')
const errMsg = ref<string>('')
const successMsg = ref<string>('')
const loading = ref<boolean>(false)

async function send() {
  if (!validate())
    return

  if (loading.value)
    return

  successMsg.value = ''
  loading.value = true

  const fail = (e: ApiError) => {
    errMsg.value = e.message
  }

  const sent = await requestResetPassword(email.value).then(r => unwrap(r, fail))
  if (sent == null)
    return loading.value = false

  successMsg.value = '重置邮件已发送，请前往邮箱查收'
  loading.value = false
}

function validate() {
  if (!email.value) {
    errMsg.value = '邮箱不能为空'
  }
  else if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email.value)) {
    errMsg.value = '请输入有效的邮箱地址'
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
    <span class="ml-2 border-y-0 border-l-2 border-r-0 border-gray-600 border-style-solid pl-4 text-lg">忘记密码</span>
  </div>

  <!-- form -->
  <form
    class="w-full space-y-4"
    @submit.prevent="send"
  >
    <input
      v-model="email"
      class="w-full border-b-purple rounded-lg border-x-none border-t-none px-2 py-2 outline-none"
      name="email"
      type="email"
      placeholder="绑定的邮箱"
      @blur="validate"
    >

    <p class="text-xs text-gray-500">
      邮箱是找回密码的唯一途径，请填写注册时绑定的邮箱
    </p>

    <button class="w-full rounded-md border-none bg-purple-500 py-2 text-xl text-white dark:bg-purple-600 disabled:bg-purple-300 hover:bg-purple-600 focus:outline-none dark:hover:bg-purple-700 disabled:dark:bg-purple-400 disabled:hover:bg-purple-300 disabled:dark:hover:bg-purple-400">
      <span v-if="loading">
        发送中...
      </span>
      <span v-else>
        发送
      </span>
    </button>
  </form>

  <!-- errMsg / successMsg -->
  <div v-if="errMsg" class="text-sm text-red-500">
    {{ errMsg }}
  </div>
  <div v-if="successMsg" class="text-sm text-green-500">
    {{ successMsg }}
  </div>

  <div class="flex justify-center gap-2 text-sm text-purple-600 -mt-2 dark:text-purple-300">
    <RouterLink to="/auth/login">
      返回登录
    </RouterLink>
    |
    <RouterLink to="/auth/register">
      注册
    </RouterLink>
  </div>
</template>
