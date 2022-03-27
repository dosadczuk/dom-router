import type { Nullable } from '@router/types'

export enum Directive {
  Initialize = 'data-router',
}

// -----------------------------------------------------------------------------
// -- Functions
// -----------------------------------------------------------------------------

const DirectiveRegistry = new Map<Directive, Nullable<DirectiveDefinition>>()

/**
 * Registers a directive.
 */
export const defineDirective = (directive: Directive, definition?: DirectiveDefinition): void => {
  DirectiveRegistry.set(directive, definition ?? null)
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
export type DirectiveDefinition = {
  /**
   * Directive factory function to prepare DOM.
   */
  factory: Nullable<DirectiveFactory>

  /**
   * Directive options.
   */
  options?: DirectiveOptions
}

/**
 * A directive factory function to prepare DOM.
 */
export type DirectiveFactory = (elements: ElementWithDirectives[], elementsWithDirective: ElementWithDirectives[], options: Nullable<DirectiveOptions>) => DirectiveCleanup | void

/**
 * A directive cleanup function to clean up after set up.
 */
export type DirectiveCleanup = () => void

/**
 * A directive options.
 */
export type DirectiveOptions = {
  /**
   * Remove directive from element after set up.
   */
  removable: boolean
}

/**
 * Definition of an element with the directives attached.
 */
export type ElementWithDirectives<T extends Element = HTMLElement> = {
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
