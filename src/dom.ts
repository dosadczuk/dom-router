import { isHTMLTemplateElement } from '@router/asserts'
import { isDirective } from '@router/directives'
import type { HTMLElementWithDirectives, Nullable } from "@router/types";

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
    const directives = new Map<string, string>()

    for (const { name, value } of attributes) {
      if (isDirective(name)) {
        directives.set(name, value)
      }
    }

    return { content: element, directives }
  })
}

/**
 * Toggle element visibility using CSS display property.
 */
export const toggleDisplayElement = (element: HTMLElementWithDirectives, canBeVisible: boolean): void => {
  if (canBeVisible) {
    displayShowElement(element)
  } else {
    displayHideElement(element)
  }
}

/**
 * Show element using CSS display property.
 */
export const displayShowElement = ({ content: element }: HTMLElementWithDirectives): void => {
  element.style.display = 'revert'
}

/**
 * Hide element using CSS display property.
 */
export const displayHideElement = ({ content: element }: HTMLElementWithDirectives): void => {
  element.style.display = 'none'
}

/**
 * Toggle element visibility using HTMLTemplateElement.
 */
export const toggleTemplateElement = (element: HTMLElementWithDirectives, canBeVisible: boolean): void => {
  if (canBeVisible) {
    replaceTemplateWithElement(element)
  } else {
    replaceElementWithTemplate(element)
  }
}

/**
 * Show element replacing HTMLTemplateElement with visible HTMLElement.
 */
export const replaceTemplateWithElement = (element: HTMLElementWithDirectives): void => {
  const { content: template } = element

  if (!isHTMLTemplateElement(template)) {
    return // already shown
  }

  const content = template.content.firstElementChild as Nullable<HTMLElement>
  if (content == null) {
    return // nothing to replace with
  }

  element.content.replaceWith(content)
  element.content = content
}

/**
 * Hide element replacing visible HTMLElement with HTMLTemplateElement.
 */
export const replaceElementWithTemplate = (element: HTMLElementWithDirectives): void => {
  const { content, directives } = element

  if (isHTMLTemplateElement(content)) {
    return // already hidden
  }

  const template = document.createElement('template')
  template.content.append(content.cloneNode(true))

  // copy directives from original HTMLElement
  directives.forEach((value, name) => {
    template.setAttribute(name, value)
  })

  element.content.replaceWith(template)
  element.content = template
}

/**
 * Append class names to HTMLElement.
 */
export const appendClassNamesToElement = (element: HTMLElementWithDirectives, classNames: string[]): void => {
  element.content.classList.add(...classNames)
}

/**
 * Remove class names from HTMLElement.
 */
export const removeClassNamesFromElement = (element: HTMLElementWithDirectives, classNames: string[]): void => {
  element.content.classList.remove(...classNames)
}
