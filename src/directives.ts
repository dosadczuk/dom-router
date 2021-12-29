const directives = new Map<string, Function>()

/**
 * Register directive with given factory function.
 */
export const directive = (name: string, factory: Function): void => {
  directives.set(name, factory)
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
