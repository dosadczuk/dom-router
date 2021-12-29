import { URLPattern } from 'urlpattern-polyfill/dist'

/**
 * Get current URL, based on window object.
 */
export const getCurrentURL = (): URL => {
  return new URL(window.location.href)
}

/**
 * Check if URL is matching given pattern.
 *
 * Reference: {@link https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API}
 */
export const isMatchingURL = (pattern: string, url: URL = getCurrentURL()): boolean => {
  return new URLPattern(pattern, url.origin).test(url.toString())
}
