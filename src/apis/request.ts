import { clearAuthToken, getAuthToken } from './authToken'
import { API_ERROR_MAP } from './errorCodes'

interface SuccessResponse<T = unknown> {
  status: 'SUCCEED'
  data: T
  dataerr?: undefined
}

interface FailedResponse {
  status: 'ERROR' | 'FAILED'
  data: string
  dataerr: {
    reason: string
    aux?: unknown | null
  }
}

type ApiResponse<T = unknown> = SuccessResponse<T> | FailedResponse

export interface ApiError { message: string, reason?: string }

export type ApiResult<T> =
  | { ok: true, data: T, headers: Headers }
  | { ok: false, error: ApiError }

/** Resolve a friendly message by reason code; fall back if unknown */
function resolveErrorMessage(reason: string | undefined, fallback: string): string {
  return reason ? API_ERROR_MAP[reason] ?? fallback : fallback
}

/** Unwrap ApiResult; on failure call onError and return null */
export function unwrap<T>(result: ApiResult<T>, onError: (error: ApiError) => void): T | null {
  if (!result.ok) {
    onError(result.error)
    return null
  }
  return result.data
}

// /be is proxied by the Vite dev server in dev
export const API_BASE = import.meta.env.DEV ? '/be' : 'https://patchyvideo.com/be'
const HEADERS = { 'Content-Type': 'application/json' }

/** Send a POST request and normalize the response into ApiResult */
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

  // 401: token no longer valid; clear the local copy
  // todo 审查
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
