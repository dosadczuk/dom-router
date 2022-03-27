import type { Nullable } from '@router/types'

/**
 * Check if given value is type of string.
 */
export const isString = (value: any): value is string => {
  return typeof value === 'string'
}

/**
 * Check if given value is an empty string.
 */
export const isEmptyString = (value: any): value is Nullable<string> => {
  return value == null || (isString(value) && value.length === 0)
}

/**
 * Check if given value is a value of given enum.
 */
export const isEnumValue = (enumObject: object, value: any): boolean => {
  return Object.values(enumObject).includes(value)
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
