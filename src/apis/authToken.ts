/**
 * JWT 令牌的存取入口（全项目唯一数据源）
 *
 * 后端鉴权已由「服务端 session + Cookie」改为「无状态 JWT」：登录成功后由后端下发
 * 令牌，前端负责保管，并在每个需登录的请求上回传 `Authorization` 头。
 *
 * 存放位置：浏览器本地存储，键名 `auth_token`；统一保存**不带** `Bearer ` 前缀的
 * 裸令牌，前缀由发起请求的一侧按需拼上，避免出现 `Bearer Bearer xxx`。
 */

const TOKEN_KEY = 'auth_token'

/** 读取本地保存的 JWT，未登录时返回空字符串 */
export function getAuthToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? ''
}

/**
 * 保存 JWT
 * @param token 令牌，可带或不带 `Bearer ` 前缀；传入空值等同于清除
 */
export function setAuthToken(token: string | null | undefined): void {
  const raw = token?.replace(/^Bearer\s+/i, '').trim()
  if (raw)
    localStorage.setItem(TOKEN_KEY, raw)
  else
    localStorage.removeItem(TOKEN_KEY)
}

/** 清除本地 JWT（登出，或令牌被后端判定失效时调用） */
export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}
