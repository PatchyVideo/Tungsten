<script setup lang="ts">
import { storeToRefs } from 'pinia'

setSiteTitle('个人信息')

const toast = useToast()
// 获取路由参数
const route = useRoute()
const uid = computed(() => {
  const params = route.params as { uid?: string }
  return params.uid || ''
})

// ======Show user info======
// 使用 GraphQL 查询
const { result, loading, error, refetch } = useQuery<Query>(gql`
    query($uid: String!){
        getUser(para:{
            uid:$uid
        }){
            id
            username
            desc
            image
            email
            bindQq
            meta {
                createdAt
            }
        }
    }
`, { uid })

// 计算属性：用户数据
const auth = computed(() => result.value?.getUser)

// 格式化日期的计算属性
const formattedDate = computed(() => {
  if (!auth.value?.meta.createdAt)
    return 'N/A'
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(new Date(auth.value.meta.createdAt))
})

// ======Edit user info======
// 获取用户数据，用于判断是否为当前用户
const userStore = useUserStore()
const { auth: myAuth } = storeToRefs(userStore)

const isMe = computed(() => myAuth.value?.profile.uid === uid.value)
const isEdit = ref(false)

// edit username
async function updateUsername(e: FocusEvent) {
  const target = e.target as HTMLElement
  const username = target.textContent?.trim() || ''
  isEdit.value = false

  if (username === auth.value?.username)
    return

  if (!username) {
    target.textContent = auth.value?.username || 'Unknown User'
    return
  }

  try {
    const usernameExists = await checkUsername(username)
    if (usernameExists) {
      toast.error('用户名已存在')
      return
    }

    const changeUsernameState = await changeUsername(username)
    if (changeUsernameState)
      refetch()
  }
  catch (error) {
    toast.error((error as Error).message)
    // target.textContent = auth.value?.username || 'Unknown User'
  }
}

// edit desc
function updateDesc(e: FocusEvent) {
  const target = e.target as HTMLElement
  const desc = target.textContent?.trim() || ''

  if (desc === auth.value?.desc)
    return

  NProgress.start()
  changeDesc(desc).then((res) => {
    if (res)
      refetch()
  }).finally(() => {
    NProgress.done()
  })
}

// update password
const isEditPassword = ref(false)
const passwordform = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const passwordState = ref<0 | 1 | 2>(0)
const passwordMsg = ref({
  0: '确保其至少包含 6 个字符且不多于 64 个字符。',
  1: '',
  2: '校验通过',
})
const passwordMsgColor = computed(() => {
  switch (passwordState.value) {
    case 0:
      return 'text-gray-600 dark:text-gray-400'
    case 1:
      return 'text-red-600 dark:text-red-400'
    case 2:
      return 'text-green-600 dark:text-green-400'
  }

  return ' text-white'
})

function validate() {
  if (!passwordform.oldPassword) {
    passwordMsg.value[1] = '旧密码不能为空'
    return false
  }
  if (!passwordform.newPassword) {
    passwordMsg.value[1] = '新密码不能为空'
    return false
  }
  if (passwordform.newPassword.length < 6 || passwordform.newPassword.length > 64) {
    passwordMsg.value[1] = '新密码长度至少为6个字符, 最多为64个字符'
    return false
  }
  if (passwordform.newPassword !== passwordform.confirmPassword) {
    passwordMsg.value[1] = '两次输入的密码不一致'
    return false
  }
  return true
}

async function updatePassword() {
  passwordState.value = 1
  validate()
  if (!validate())
    return
  passwordState.value = 2
  NProgress.start()
  try {
    await changePassword(passwordform.oldPassword, passwordform.newPassword)
    toast.success('密码已更新')
    passwordMsg.value[2] = '密码已更新'
  }
  catch (error) {
    passwordState.value = 1
    passwordMsg.value[1] = (error as Error).message
  }
  finally {
    NProgress.done()
  }
}
// ====== Loding ======
// 监听加载状态并控制进度条
watchEffect(() => {
  if (loading.value) { // 如果数据正在加载
    if (!NProgress.isStarted()) // 如果进度条未启动
      NProgress.start() // 启动进度条
  }
  else { // 如果数据加载完成
    if (NProgress.isStarted()) // 如果进度条正在运行
      NProgress.done() // 完成进度条
  }
})
</script>

<template>
  <div class="m-t-16 max-w-5xl flex flex-col">
    <!-- 错误提示 -->
    <div v-if="error" class="relative mb-4 border border-red-400 rounded bg-red-100 px-4 py-3 text-red-700">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ error.message }}</span>
    </div>

    <div class="flex items-center bg-primaryContainer p-6 text-onPrimaryContainer dark:bg-dark-primaryContainer dark:text-white">
      <!-- 用户头像和昵称 -->
      <Avatar
        class="h-20 w-20 rounded-full transition-all duration-300"
        :image="auth?.image || 'default'"
      />
      <div class="ml-6">
        <div class="flex items-center gap-4">
          <h2
            class="text-2xl font-bold outline-none transition-all duration-300"
            :class="isEdit && 'bg-white/20 p-x-2  rounded'"
            :contenteditable="isMe && isEdit"
            @blur="updateUsername"
          >
            {{ auth?.username || 'Unknown User' }}
          </h2>
          <div v-if="isMe" class="i-mdi:edit text-2xl" @click="isEdit = !isEdit" />
        </div>

        <p class="text-sm">
          注册时间: {{ formattedDate }}
        </p>
      </div>
    </div>

    <div class="bg-white p-8 shadow-md dark:bg-dark-700 dark:text-gray-200">
      <!-- about -->
      <div class="mb-8">
        <h2 class="mb-2 text-xl font-semibold">
          简介
        </h2>
        <p
          class="border border-transparent text-gray-700 transition-all duration-300 dark:text-gray-300"
          :contenteditable="isMe"
          :class="isMe && 'focus:bg-purple/20 focus:ring-1 focus:ring-purple/80 hover:bg-purple-2/30 hover:ring-1 hover:ring-purple/40 dark:hover:bg-white/20 focus:p-x-2  dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.3)] dark:focus:shadow-[0_0_0_1px_rgba(255,255,255,0.5)] rounded focus:outline-none dark:focus:bg-white/20'"
          @blur="updateDesc"
        >
          {{ auth?.desc || 'No description available.' }}
        </p>
      </div>

      <!-- info -->
      <div v-if="isMe" class="mb-8">
        <h2 class="mb-2 text-xl font-semibold">
          其他信息
        </h2>
        <ul class="p-0 space-y-2">
          <li class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-300">User ID:</span>
            <span class="text-gray-800 dark:text-gray">{{ auth?.id || 'N/A' }}</span>
          </li>
          <li class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-300">Email:</span>
            <span class="text-gray-800 dark:text-gray">{{ auth?.email || 'Not provided' }}</span>
          </li>
          <li class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-300">QQ Account:</span>
            <span class="text-gray-800 dark:text-gray">{{ auth?.bindQq || 'Not bound' }}</span>
          </li>
        </ul>
      </div>

      <!-- edit password -->
      <div v-if="isMe" class="mt-8">
        <div class="mb-2 flex items-center justify-between">
          <h2 class="text-xl font-semibold">
            修改密码
          </h2>
          <button class="border border-fuchsia-2 rounded border-solid bg-white p-x-3 p-y-2 text-gray-700 dark:border-gray-6 dark:bg-dark-5 hover:bg-fuchsia-1 dark:text-gray-300 dark:hover:bg-dark-4" @click="isEditPassword = !isEditPassword">
            {{ isEditPassword ? '取消' : '修改密码' }}
          </button>
        </div>

        <div v-if="isEditPassword" class="m-t-6 flex flex-col gap-4">
          <!-- Old password -->
          <label for="old-password" class="block max-w-md text-sm text-gray-700 font-medium dark:text-gray-300">
            旧密码
          </label>
          <input
            id="old-password"
            v-model="passwordform.oldPassword"
            type="password"
            class="max-w-md border border-gray-300 rounded border-solid bg-gray-1 p-x-2 p-y-1 outline-none transition-all duration-300 dark:border-dark-3 dark:bg-dark-5 focus:bg-white dark:text-white dark:focus:border-indigo-600 dark:focus:bg-dark-4 dark:placeholder:text-gray-400"
          >
          <!-- New password -->
          <label for="new-password" class="block max-w-md text-sm text-gray-700 font-medium dark:text-gray-300">
            新密码
          </label>
          <input
            id="new-password"
            v-model="passwordform.newPassword"
            type="password"
            class="max-w-md border border-gray-300 rounded border-solid bg-gray-1 p-x-2 p-y-1 outline-none transition-all duration-300 dark:border-dark-3 dark:bg-dark-5 focus:bg-white dark:text-white dark:focus:border-indigo-600 dark:focus:bg-dark-4 dark:placeholder:text-gray-400"
          >
          <!-- Confirm password -->
          <label for="confirm-password" class="block max-w-md text-sm text-gray-700 font-medium dark:text-gray-300">
            确认密码
          </label>
          <input
            id="confirm-password"
            v-model="passwordform.confirmPassword"
            type="password"
            class="max-w-md border border-gray-300 rounded border-solid bg-gray-1 p-x-2 p-y-1 outline-none transition-all duration-300 dark:border-dark-3 dark:bg-dark-5 focus:bg-white dark:text-white dark:focus:border-indigo-600 dark:focus:bg-dark-4 dark:placeholder:text-gray-400"
          >

          <div>
            <p
              class="m-0 p-none text-sm text-gray-600 transition-all duration-300 dark:text-gray-400"
              :class="passwordMsgColor"
            >
              {{ passwordMsg[passwordState] }}
            </p>
            <button class="block max-w-md rounded border-none bg-purple-500 p-x-4 p-y-2 text-white hover:bg-purple-600" @click="updatePassword">
              更新密码
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
