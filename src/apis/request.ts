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

const API_BASE = 'https://patchyvideo.com/be'
const HEADERS = { 'Content-Type': 'application/json' }

const toast = useToast()

/**
 * 发送 API 请求
 * @param endpoint API 端点
 * @param payload 请求负载
 * @returns API 响应数据
 */
export async function request<T>(
  endpoint: string,
  payload: any = {},
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: HEADERS,
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    toast.error('网络错误，请稍后重试。')
    throw new Error(`网络错误：${res.status}`)
  }

  const json = await res.json() as ApiResponse<T>

  if (json.status === 'SUCCEED' && 'data' in json) {
    return json.data!
  }

  if (json.status === 'FAILED' && 'dataerr' in json) {
    throw new Error(`失败：${json.dataerr?.reason || '未知原因'}`)
  }

  if (json.status === 'ERROR') {
    if (json.dataerr.reason === 'UNAUTHORISED_OPERATION')
      throw new Error('未授权操作，请重新登录。')
    throw new Error(`错误：${json.dataerr?.reason || '未知错误'}`)
  }

  throw new Error(`请求错误：${json.status}`)
}
