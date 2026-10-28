/**
 * JWT storage (single source of truth).
 * Stores the bare token without the `Bearer ` prefix; callers prepend it when needed.
 */

const TOKEN_KEY = 'auth_token'

export function getAuthToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? ''
}

/** Save JWT (`Bearer ` prefix stripped; empty value clears) */
export function setAuthToken(token: string | null | undefined): void {
  const raw = token?.replace(/^Bearer\s+/i, '').trim()
  if (raw)
    localStorage.setItem(TOKEN_KEY, raw)
  else
    localStorage.removeItem(TOKEN_KEY)
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}
