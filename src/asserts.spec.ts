import {
  isEmptyString,
  isEnum,
  isHTMLAnchorElement,
  isHTMLTemplateElement,
  isString,
} from '@router/asserts'
import { describe, expect, it } from 'vitest'

describe('asserts', () => {

  it('should assert string', () => {
    type TestCase = {
      input: unknown
      expected: boolean
    }

    const testCases: TestCase[] = [
      { input: '', expected: true },
      { input: 'test', expected: true },
      { input: 1, expected: false },
      { input: {}, expected: false },
      { input: [], expected: false },
      { input: null, expected: false },
      { input: undefined, expected: false },
      { input: true, expected: false },
      { input: false, expected: false },
    ]

    testCases.forEach(({ input, expected }) => {
      expect(isString(input)).toEqual(expected)
    })
  })

  it('should assert an empty string', () => {
    type TestCase = {
      input: unknown
      expected: boolean
    }

    const testCases: TestCase[] = [
      { input: '', expected: true },
      { input: 'test', expected: false },
      { input: 1, expected: false },
      { input: {}, expected: false },
      { input: [], expected: false },
      { input: null, expected: true },
      { input: undefined, expected: true },
      { input: true, expected: false },
      { input: false, expected: false },
    ]

    testCases.forEach(({ input, expected }) => {
      expect(isEmptyString(input)).toEqual(expected)
    })
  })

  it('should assert enum value', () => {
    type TestCase = {
      input: unknown
      expected: boolean
    }

    enum TestEnum {
      A = 'a',
      B = 'b',
    }

    const testCases: TestCase[] = [
      { input: TestEnum.A, expected: true },
      { input: TestEnum.B, expected: true },
      { input: 'a', expected: true },
      { input: 'b', expected: true },
      { input: 'c', expected: false },
      { input: 'd', expected: false },
    ]

    testCases.forEach(({ input, expected }) => {
      expect(isEnum(input, TestEnum)).toEqual(expected)
    })
  })

  it('should asserts HTMLAnchorElement', () => {
    type TestCase = {
      input: HTMLElement
      expected: boolean
    }

    const testCases: TestCase[] = [
      { input: document.createElement('a'), expected: true },
      { input: document.createElement('div'), expected: false },
      { input: document.createElement('input'), expected: false },
      { input: document.createElement('button'), expected: false },
    ]

    testCases.forEach(({ input, expected }) => {
      expect(isHTMLAnchorElement(input)).toEqual(expected)
    })
  })

  it('should assert HTMLTemplateElement', () => {
    type TestCase = {
      input: HTMLElement
      expected: boolean
    }

    const testCases: TestCase[] = [
      { input: document.createElement('template'), expected: true },
      { input: document.createElement('div'), expected: false },
      { input: document.createElement('input'), expected: false },
      { input: document.createElement('button'), expected: false },
    ]

    testCases.forEach(({ input, expected }) => {
      expect(isHTMLTemplateElement(input)).toEqual(expected)
    })
  })
})
