/**
 * Check if given value is empty.
 */
export const isEmpty = (value?: any): boolean => {
  if (isString(value)) {
    return value.length == 0
  }

  return value == null
}

/**
 * Check if given value is type of string.
 */
export const isString = (value: any): value is string => {
  return typeof value === 'string'
}

/**
 * Check if given HTMLElement is HTMLTemplateElement (<template>).
 */
export const isHTMLTemplateElement = (element: HTMLElement): element is HTMLTemplateElement => {
  return element instanceof HTMLTemplateElement
}

/**
 * Check if given HTMLElement is HTMLAnchorElement (<a>).
 */
export const isHTMLAnchorElement = (element: HTMLElement): element is HTMLAnchorElement => {
  return element instanceof HTMLAnchorElement
}
