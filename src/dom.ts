import { isHTMLTemplateElement } from '@router/asserts'
import { getDirectivesAsSelector, isDirective } from '@router/directives'
import { Mode } from '@router/enums'
import type {
  HideElement,
  HTMLElementWithDirectives,
  Nullable,
  ShowElement,
  ToggleElementVisibility,
} from '@router/types'

/**
 * Get all HTMLElements with any directive.
 */
export const getHTMLElementsWithAnyDirective = (): HTMLElementWithDirectives[] => {
  const elements = document.querySelectorAll<HTMLElement>(getDirectivesAsSelector())
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
 * Get HTMLElements with given directive.
 */
export const getHTMLElementsWithDirective = (elements: HTMLElementWithDirectives[], directive: string): HTMLElementWithDirectives[] => {
  return elements.filter(element => element.directives.has(directive))
}

/**
 * Get first HTMLElement of element with given directive.
 */
export const getFirstHTMLElementWithDirective = (elements: HTMLElementWithDirectives[], directive: string): Nullable<HTMLElementWithDirectives> => {
  return elements.find(element => element.directives.has(directive)) ?? null
}

/**
 * Remove given directive from elements.
 */
export const removeDirectiveFromHTMLElements = (elements: HTMLElementWithDirectives[], directive: string): void => {
  elements.forEach(({ content: element }) => element.removeAttribute(directive))
}

/**
 * Toggle element visibility, depends on mode.
 */
export const changeViewWithMode = (mode: string): ToggleElementVisibility => {
  return (element, canBeVisible) => {
    switch (mode) {
      case Mode.Display:
        return toggleDisplayElement(element, canBeVisible)

      case Mode.Template:
        return toggleTemplateElement(element, canBeVisible)
    }

    return false
  }
}

/**
 * Toggle element visibility using CSS display property.
 */
export const toggleDisplayElement: ToggleElementVisibility = (element, canBeVisible) => {
  if (canBeVisible) {
    return displayShowElement(element)
  } else {
    return displayHideElement(element)
  }
}

/**
 * Show element using CSS display property.
 */
export const displayShowElement: ShowElement = ({ content: element }) => {
  element.style.display = 'revert'

  return true
}

/**
 * Hide element using CSS display property.
 */
export const displayHideElement: HideElement = ({ content: element }) => {
  element.style.display = 'none'

  return false
}

/**
 * Toggle element visibility using HTMLTemplateElement.
 */
export const toggleTemplateElement: ToggleElementVisibility = (element, canBeVisible) => {
  if (canBeVisible) {
    return replaceTemplateWithElement(element)
  } else {
    return replaceElementWithTemplate(element)
  }
}

/**
 * Show element replacing HTMLTemplateElement with visible HTMLElement.
 */
export const replaceTemplateWithElement: ShowElement = (element) => {
  const { content: template } = element

  if (!isHTMLTemplateElement(template)) {
    return true // already shown
  }

  const content = template.content.firstElementChild as Nullable<HTMLElement>
  if (content == null) {
    return false // nothing to replace with
  }

  element.content.replaceWith(content)
  element.content = content

  return true
}

/**
 * Hide element replacing visible HTMLElement with HTMLTemplateElement.
 */
export const replaceElementWithTemplate: HideElement = (element) => {
  const { content } = element

  if (isHTMLTemplateElement(content)) {
    return false // already hidden
  }

  const template = document.createElement('template')
  template.content.append(content.cloneNode(true))

  element.content.replaceWith(template)
  element.content = template

  return false
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
