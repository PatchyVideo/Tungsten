import type { ApiResult } from './request'
import type { LoginData } from './type/user'
import type { UserStore } from '@/stores/user'
import { setAuthToken } from './authToken'

/**
 * 从登录响应中提取后端下发的 JWT
 *
 * 后端在两条通道上同时下发同一个令牌，这里按「响应头优先、响应体兜底」读取：
 * - 响应头 `Authorization`：需要后端 CORS 配置 `access-control-expose-headers`
 *   暴露该头，跨域时才读得到
 * - 响应体 `data.auth_token`：不受 CORS 配置影响，作为独立兜底通道
 *
 * @returns 成功提取到令牌时返回（可能带 `Bearer ` 前缀），否则返回 null
 */
function extractIssuedToken(result: ApiResult<LoginData>): string | null {
  if (!result.ok)
    return null

  const fromHeader = result.headers.get('Authorization')
  if (fromHeader)
    return fromHeader

  const { auth_token } = result.data as { auth_token?: unknown }
  return typeof auth_token === 'string' ? auth_token : null
}

export function getSession() {
  return request<string>('/auth/get_session.do', { type: 'LOGIN' })
}

/**
 * 登录，并在成功后保存后端下发的 JWT
 *
 * 「保存令牌」是登录接口自己的契约，因此写在这里，而不是塞进通用的 `request()`。
 */
export async function userLogin(username: string, password: string, session: string) {
  const result = await request<LoginData>('/login.do', { username, password, session })

  const token = extractIssuedToken(result)
  if (token)
    setAuthToken(token)

  return result
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

export function rateVideo(vid: string, stars: number) {
  return request<object>('/rating/video.do', { vid, stars })
}

export function ratePlaylist(pid: string, stars: number) {
  return request<object>('/rating/playlist.do', { pid, stars })
}

export function requestResetPassword(email: string) {
  return request<string>('/user/request_resetpass.do', { email, lang: 'CHS' })
}
