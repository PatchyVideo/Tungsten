import type { UserStore } from '@/stores/user'

export function getSession() {
  return request<string>('/auth/get_session.do', { type: 'LOGIN' })
}

export function userLogin(username: string, password: string, session: string) {
  return request('/login.do', { username, password, session })
}

export function refetchProfile() {
  return request<UserStore>('/user/myprofile.do')
}

export function checkUsername(username: string) {
  return request<boolean>('/user/exists.do', { username })
}

export function checkEmail(email: string) {
  return request<boolean>('/user/email_avail.do', { email })
}

export function userSignup(username: string, password: string, session: string, email: string) {
  return request<{ uid: string }>('/signup.do', { username, password, session, email })
}

export function changeUsername(username: string) {
  return request('/user/changename.do', { name: username })
}

export function changeDesc(desc: string) {
  return request('/user/changedesc.do', { desc })
}

export function changePassword(old_pass: string, new_pass: string) {
  return request('/user/changepass.do', { old_pass, new_pass })
}

export function userLogout() {
  return request('/logout.do')
}
