import { getHTMLElementsWithAnyDirective } from '@router/dom'
import type { DirectiveFactory } from '@router/types'

const directives = new Map<string, DirectiveFactory>()

/**
 * Register directive with given factory function.
 */
export const defineDirective = (name: string, factory: DirectiveFactory): void => {
  directives.set(name, factory)
}

/**
 * Set up directives in given order.
 */
export const setUpDirectives = (names: string[]): void => {
  const elements = getHTMLElementsWithAnyDirective()

  for (const name of names) {
    const factory = directives.get(name)
    if (factory == null) {
      continue
    }

    factory(elements)
  }
}

/**
 * Check if name is registered as directive.
 */
export const isDirective = (name: string): boolean => {
  return getDirectives().includes(name)
}

/**
 * Get list of registered directives.
 */
export const getDirectives = (): string[] => {
  return Array.from(directives.keys())
}

/**
 * Get selector to find elements with any directive.
 */
export const getDirectivesAsSelector = (): string => {
  return getDirectives().map(it => `[${it}]`).join(', ')
}

/**
 * Remove all registered directives.
 */
export const clearDirectives = (): void => {
  directives.clear()
}
