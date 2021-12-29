import { isDirective } from '@router/directives'

export type HTMLElementWithDirectives = {
  element: HTMLElement;
  directives: ReadonlyMap<string, string | null>;
}

/**
 * Get HTMLElements with given directive.
 */
export const getHTMLElementsWithDirective = (directive: string): HTMLElementWithDirectives[] => {
  const elements = document.querySelectorAll<HTMLElement>(`[${directive}]`)
  if (elements.length === 0) {
    return []
  }

  return Array.from(elements, element => {
    const attributes = Array.from(element.attributes)
    const directives = new Map<string, string | null>()

    for (const { name, value } of attributes) {
      if (isDirective(name)) {
        directives.set(name, value)
      }
    }

    return { element, directives }
  })
}
