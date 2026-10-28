import type { ApiResult } from '@/apis/request'
import type { LoginData } from '@/apis/type/user'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { clearAuthToken, getAuthToken, setAuthToken } from '@/apis/authToken'

export interface UserStore {
  profile: {
    uid: string
    username: string
    image: string
    desc: string
    email: string
    bind_qq: boolean
    access_control_status: string
  }
  access_control: {
    status: string
    access_mode: string
    allowed_ops: string[]
    denied_ops: string[]
  }
  settings: {
    blacklist: string[]
  }
}

export const useUserStore = defineStore('user', () => {
  const auth = ref<UserStore | null>(null)
  const isAdmin = computed(() => auth.value?.profile?.access_control_status === 'admin')
  /** Persist the JWT from a login response: Authorization header first, body auth_token as fallback */
  function setToken(result: ApiResult<LoginData>) {
    if (!result.ok)
      return

    const fromHeader = result.headers.get('Authorization')
    if (fromHeader) {
      setAuthToken(fromHeader)
      return
    }

    const { auth_token } = result.data as { auth_token?: unknown }
    if (typeof auth_token === 'string')
      setAuthToken(auth_token)
  }
  async function refetch() {
    const result = await refetchProfile()
    if (result.ok)
      auth.value = result.data
  }

  function logout() {
    userLogout()
    clearAuthToken()
    auth.value = null
    sessionStorage.clear()
  }

  // skip refetch when logged out to avoid a guaranteed 401
  if (getAuthToken())
    refetch()

  return {
    auth,
    isAdmin,
    refetch,
    setToken,
    logout,
  }
})

// Hot Module Replacement (HMR) support
// When the file is saved, HMR will automatically update the store without refreshing the entire page.
// This ensures that user input data (e.g., the current name and previous names) remains unchanged.
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore as any, import.meta.hot))
