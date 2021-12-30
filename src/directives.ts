export enum Directive {
  Cloak = 'data-router-cloak',
  Title = 'data-router-title',
  Link = 'data-router-link',
  Page = 'data-router-page'
}

const directives = new Map<string, Function>()

/**
 * Register directive with given factory function.
 */
export const setDirective = (name: string, factory: Function): void => {
  directives.set(name, factory)
}

/**
 * Set up directive with registered factory.
 */
export const runDirective = (name: string): void => {
  const directiveFactory = directives.get(name)
  if (directiveFactory == null) {
    return
  }

  directiveFactory()
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
 * Remove all registered directives.
 */
export const clearDirectives = (): void => {
  directives.clear()
}
