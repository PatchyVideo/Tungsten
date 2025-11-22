import type { AutocompleteResponse } from './type/autocomplete'

export function searchAutocomplete2(query: string) {
  return request<AutocompleteResponse>('/autocomplete/ql', { q: query })
}

let controller: AbortController | null = null

/**
 * Tab标签搜索推荐列表
 * @param query 搜索字符串
 * @returns 异步返回自动补全建议项数组
 */
export async function searchAutocomplete(query: string): Promise<AutocompleteResponse> {
  if (controller)
    controller.abort()

  controller = new AbortController()

  const url = `https://patchyvideo.com/be/autocomplete/ql?q=${query}`

  const res = await fetch(url, { method: 'GET', signal: controller.signal })
  return await res.json()
}
