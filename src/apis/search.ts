import type { AutocompleteResponse } from './type/autocomplete'

export function searchAutocomplete2(query: string) {
  return request<AutocompleteResponse>('/autocomplete/ql', { q: query }, 'GET', true)
}

export async function searchAutocomplete(query: string): Promise<AutocompleteResponse> {
  return ((await fetch(`https://patchyvideo.com/be/autocomplete/ql?q=${query}`, { method: 'GET' })).json())
}
