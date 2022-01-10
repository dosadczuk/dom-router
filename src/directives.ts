export enum Directive {
  Init = 'data-router',
  Cloak = 'data-router-cloak',
  Title = 'data-router-title',
  Link = 'data-router-link',
  LinkActive = 'data-router-link-active',
  Page = 'data-router-page',
}

const directives = new Map<string, Function>()

/**
 * Register directive with given factory function.
 */
export const setDirective = (name: string, factory: Function): void => {
  directives.set(name, factory)
}

/**
 * Set up directives in given order.
 */
export const setUpDirectives = (names: string[]): void => {
  names.forEach(name => setUpDirective(name))
}

/**
 * Set up directive with registered factory.
 */
export const setUpDirective = (name: string): void => {
  const factory = directives.get(name)
  if (factory == null) {
    return
  }

  factory()
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
