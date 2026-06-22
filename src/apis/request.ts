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
export interface ApiError { message: string; reason?: string }
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError }

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

const API_BASE = 'https://patchyvideo.com/be'
const HEADERS = { 'Content-Type': 'application/json' }

/**
 * 发送 API 请求
 * @param endpoint API 端点
 * @param payload 请求负载
 * @returns ApiResult 包装的响应数据
 */
export async function request<T>(
  endpoint: string,
  payload: any = {},
): Promise<ApiResult<T>> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: HEADERS,
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    return { ok: false, error: { message: `网络错误：${res.status}` } }
  }

  const json = await res.json() as ApiResponse<T>

  if (json.status === 'SUCCEED' && 'data' in json) {
    return { ok: true, data: json.data! }
  }

  const reason = json.dataerr?.reason

  if (json.status === 'FAILED' && 'dataerr' in json) {
    return { ok: false, error: { message: `失败：${reason || '未知原因'}`, reason } }
  }

  if (json.status === 'ERROR') {
    return { ok: false, error: { message: reason || '未知错误', reason } }
  }

  return { ok: false, error: { message: `请求错误：${json.status}` } }
}
