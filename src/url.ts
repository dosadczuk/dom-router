import { URLPattern } from 'urlpattern-polyfill/dist'

export const getCurrentURL = (): URL => {
  return new URL(window.location.href)
}

/**
 * Reference: {@link https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API}
 */
export const isMatchingURL = (pattern: string, url: URL = getCurrentURL()): boolean => {
  return new URLPattern(pattern, url.origin).test(url.toString())
}
