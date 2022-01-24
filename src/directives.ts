import { getHTMLElementsWithDirective, removeDirectiveFromHTMLElements } from '@router/dom'
import type { DirectiveDefinition, HTMLElementWithDirectives } from '@router/types'

const directives = new Map<string, DirectiveDefinition>()

/**
 * Register directive with given factory function.
 */
export const defineDirective = (name: string, definition: DirectiveDefinition): void => {
  directives.set(name, definition)
}

/**
 * Set up directives in given order.
 */
export const setUpDirectives = (elements: HTMLElementWithDirectives[], names: string[]): void => {
  for (const name of names) {
    const definition = directives.get(name)
    if (definition == null) {
      continue
    }

    const { factory, options } = definition

    // check factory
    if (factory != null) {
      const cleanup = factory(elements, getHTMLElementsWithDirective(elements, name), options)
      if (cleanup != null) {
        cleanup() // cleanup after set up
      }
    }

    // check options
    if (options != null) {
      if (options.removable) {
        removeDirectiveFromHTMLElements(elements, name)
      }
    }
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
