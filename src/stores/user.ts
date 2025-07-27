import { acceptHMRUpdate, defineStore } from 'pinia'

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
  /**
   * Refetch the user's data.
   */
  async function refetch() {
    auth.value = await refetchProfile()
  }

  function logout() {
    userLogout()
    auth.value = null
    sessionStorage.clear()
  }

  refetch()

  return {
    auth,
    refetch,
    logout,
  }
})

// Hot Module Replacement (HMR) support
// When the file is saved, HMR will automatically update the store without refreshing the entire page.
// This ensures that user input data (e.g., the current name and previous names) remains unchanged.
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore as any, import.meta.hot))
