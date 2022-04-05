import { removeDirectiveFromElements } from '@router/dom'

export enum Directive {
  Initialize = 'data-router',

  Cloak = 'data-router-cloak',

  Title = 'data-router-title',
  TitleDefault = 'data-router-title-default',

  Link = 'data-router-link',
  LinkActive = 'data-router-link-active',

  Page = 'data-router-page',
  PageFallback = 'data-router-page-fallback',

  Sitemap = 'data-router-sitemap',
  SitemapIgnore = 'data-router-sitemap-ignore',
}

// -----------------------------------------------------------------------------
// -- Definition
// -----------------------------------------------------------------------------

const DirectiveRegistry = new Map<Directive, DirectiveDefinition>()

/**
 * Registers a directive.
 */
export const defineDirective = (directive: Directive, definition: DirectiveDefinition): void => {
  DirectiveRegistry.set(directive, definition)
}

/**
 * Processes directives on the given elements.
 */
export const processDirectives = (elements: ElementWithDirectives[], directives: Directive[]) => {
  for (const directive of directives) {
    const definition = DirectiveRegistry.get(directive)
    if (definition == null) {
      continue // directive not defined
    }

    const { factory, options } = definition

    if (factory != null) {
      const cleanup = factory(elements)
      if (cleanup != null) {
        cleanup() // cleanup after directive set up
      }
    }

    if (options != null) {
      if (options.removable) {
        removeDirectiveFromElements(elements, directive)
      }
    }
  }
}

/**
 * Returns registered directives.
 */
export const getDirectives = (): Directive[] => {
  return Array.from(DirectiveRegistry.keys())
}

/**
 * Returns a selector to find elements with any directive.
 */
export const getDirectivesAsSelector = (): string => {
  return getDirectives().map(directive => `[${directive}]`).join(', ')
}

/**
 * Unregisters the directives.
 */
export const clearDirectives = (): void => {
  DirectiveRegistry.clear()
}

// -----------------------------------------------------------------------------
// -- Types
// -----------------------------------------------------------------------------

/**
 * A directive is a function that does something for a specific element.
 */
type DirectiveDefinition = {
  /**
   * Directive factory function to prepare DOM.
   */
  factory?: DirectiveFactory

  /**
   * Directive options.
   */
  options?: DirectiveOptions
}

/**
 * A directive factory function to prepare DOM.
 */
type DirectiveFactory = (elements: ElementWithDirectives[]) => DirectiveCleanup | void

/**
 * A directive cleanup function to clean up after set up.
 */
type DirectiveCleanup = () => void

/**
 * A directive options.
 */
type DirectiveOptions = {
  /**
   * Remove directive from element after set up.
   */
  removable: boolean
}

/**
 * Definition of an element with the directives attached.
 */
export type ElementWithDirectives<T extends HTMLElement = HTMLElement> = {
  /**
   * The element to which the directives are attached.
   */
  element: T

  /**
   * Is the element currently attached to the DOM?
   */
  visible: boolean

  /**
   * The directives attached to the element.
   */
  directives: ReadonlyMap<Directive, string>
}
