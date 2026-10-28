import { clearAuthToken, getAuthToken } from './authToken'
import { API_ERROR_MAP } from './errorCodes'

// 成功响应，data 为任意类型
interface SuccessResponse<T = unknown> {
  status: 'SUCCEED'
  data: T
  dataerr?: undefined
}

// 失败响应，包含错误信息
interface FailedResponse {
  status: 'ERROR' | 'FAILED'
  data: string
  dataerr: {
    reason: string
    aux?: unknown | null
  }
}

// 通用响应类型
type ApiResponse<T = unknown> = SuccessResponse<T> | FailedResponse

// Result 模式类型
export interface ApiError { message: string, reason?: string }
/**
 * 请求结果。
 * 成功时一并给出 `headers`，好让**端点自己的封装**去处理端点特有的响应头逻辑
 * （例如登录接口需要从 `Authorization` 响应头里取出后端下发的令牌），
 * 而不必把这些逻辑塞进通用的 `request()` 里。
 */
export type ApiResult<T> =
  | { ok: true, data: T, headers: Headers }
  | { ok: false, error: ApiError }

/** 通过 reason 从错误码字典解析友好提示，未命中时返回 fallback */
function resolveErrorMessage(reason: string | undefined, fallback: string): string {
  return reason ? API_ERROR_MAP[reason] ?? fallback : fallback
}

/**
 * 解包 ApiResult，失败时调用 onError 并返回 null
 * @returns 成功时返回 data，失败时返回 null
 */
export function unwrap<T>(result: ApiResult<T>, onError: (error: ApiError) => void): T | null {
  if (!result.ok) {
    onError(result.error)
    return null
  }
  return result.data
}

// In dev, /be is proxied by the Vite dev server (server.proxy in vite.config.ts)
export const API_BASE = import.meta.env.DEV ? '/be' : 'https://patchyvideo.com/be'
const HEADERS = { 'Content-Type': 'application/json' }

/**
 * 发送 API 请求
 *
 * 本函数只承担**传输层**职责，不感知任何具体端点：
 * - 携带鉴权：自动附带 `Authorization: Bearer <JWT>`（令牌本身由 `./authToken` 管理）
 * - 归一化结果：把统一 JSON 信封解包成 `ApiResult`，并把响应头一并交出
 * - 归一化错误：HTTP 状态码与信封里的 `status` 统一转成 `ApiError`
 *
 * 端点特有的逻辑请写在各自的接口封装里（用成功结果上的 `headers` 读取响应头），
 * 不要加进本函数。
 *
 * @param endpoint API 端点
 * @param payload 请求负载
 * @returns ApiResult 包装的响应数据
 */
export async function request<T>(
  endpoint: string,
  payload: any = {},
): Promise<ApiResult<T>> {
  const token = getAuthToken()

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: token ? { ...HEADERS, Authorization: `Bearer ${token}` } : HEADERS,
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  // 401 属于传输层就能判定的「未认证」信号：令牌已失效，顺手清掉本地副本
  if (res.status === 401) {
    clearAuthToken()
    return { ok: false, error: { message: API_ERROR_MAP.UNAUTHORISED_OPERATION, reason: 'UNAUTHORISED_OPERATION' } }
  }

  if (!res.ok) {
    return { ok: false, error: { message: `网络错误：${res.status}` } }
  }

  const json = await res.json() as ApiResponse<T>

  if (json.status === 'SUCCEED' && 'data' in json) {
    return { ok: true, data: json.data, headers: res.headers }
  }

  const reason = json.dataerr?.reason

  if (json.status === 'FAILED' && 'dataerr' in json) {
    return { ok: false, error: { message: resolveErrorMessage(reason, `失败：${reason || '未知原因'}`), reason } }
  }

  if (json.status === 'ERROR') {
    return { ok: false, error: { message: resolveErrorMessage(reason, reason || '未知错误'), reason } }
  }

  return { ok: false, error: { message: `请求错误：${json.status}` } }
}
