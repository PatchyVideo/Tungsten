import type { UserStore } from '@/stores/user'

export const USER_AUTH_ERROR_MAP: Record<string, string> = {
  // 登录
  INCORRECT_LOGIN: '用户名或密码错误',
  INCORRECT_SESSION: '登录已过期，请重新登录',
  INCORRECT_SESSION_TYPE: '会话类型错误',
  // 注册
  USER_EXIST: '用户名已被占用',
  EMAIL_EXIST: '该邮箱已被注册',
  INCORRECT_EMAIL: '邮箱格式不正确',
  QQ_ALREADY_BIND: '该QQ号已绑定其他账号',
  // 用户名
  USERNAME_TOO_LONG: '用户名过长',
  USERNAME_TOO_SHORT: '用户名过短',
  NAME_LENGTH: '用户名长度不合法',
  USER_ALREADY_EXIST: '用户名已被占用',
  // 密码
  PASSWORD_TOO_LONG: '密码过长',
  PASSWORD_TOO_SHORT: '密码过短',
  PASSWORD_LENGTH: '密码长度不合法',
  INCORRECT_PASSWORD: '原密码错误',
  // 其他
  DESC_TOO_LONG: '个人简介过长',
  USER_NOT_EXIST: '用户不存在',
  UNAUTHORISED_OPERATION: '未登录或权限不足',
}

/** 根据后端错误码获取友好提示，未命中则返回原始 message */
export function getAuthErrorMessage(error: { message: string; reason?: string }): string {
  return USER_AUTH_ERROR_MAP[error.reason ?? ''] ?? error.message
}

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
