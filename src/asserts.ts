import type { Nullable } from '@router/types'

// -----------------------------------------------------------------------------
// -- String assertion functions
// -----------------------------------------------------------------------------

/**
 * Asserts that the given value is a string.
 */
export const isString = (value: unknown): value is string => {
  return typeof value === 'string' || value instanceof String
}

/**
 * Asserts that the given value is an empty string (or null).
 */
export const isEmptyString = (value: unknown): value is Nullable<string> => {
  return value == null || (isString(value) && value.length === 0)
}

// -----------------------------------------------------------------------------
// -- Enum
// -----------------------------------------------------------------------------

/**
 * Asserts that the given value is an enum.
 */
export const isEnum = (value: unknown, enumObject: object): value is keyof typeof enumObject => {
  return Object.values(enumObject).includes(String(value))
}

// -----------------------------------------------------------------------------
// -- HTML element assertion functions
// -----------------------------------------------------------------------------

/**
 * Asserts that the given value is a DOM anchor element.
 */
export const isHTMLAnchorElement = (value: unknown): value is HTMLAnchorElement => {
  return value instanceof HTMLAnchorElement
}

/**
 * Asserts that the given value is a DOM template element.
 */
export const isHTMLTemplateElement = (value: unknown): value is HTMLTemplateElement => {
  return value instanceof HTMLTemplateElement
}
