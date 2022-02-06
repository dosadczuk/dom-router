import { isEmptyString, isEnumValue, isHTMLAnchorElement, isHTMLTemplateElement, isString } from '@router/asserts'
import { describe, expect, it } from 'vitest'

describe('asserts', () => {

  it('should assert empty string', () => {
    // given
    const notEmptyString = 'sample string'
    const realEmptyString = ''
    const undfEmptyString = undefined
    const nullEmptyString = null

    // when
    const isNotEmptyString = isEmptyString(notEmptyString)
    const isEmptyString1 = isEmptyString(realEmptyString)
    const isEmptyString2 = isEmptyString(undfEmptyString)
    const isEmptyString3 = isEmptyString(nullEmptyString)

    // then
    expect(isNotEmptyString).toBeFalsy()
    expect(isEmptyString1).toBeTruthy()
    expect(isEmptyString2).toBeTruthy()
    expect(isEmptyString3).toBeTruthy()
  })

  it('should assert is string', () => {
    // given
    const string = 'samples string'
    const number = 123

    // when
    const isValidString = isString(string)
    const isInvalidString = isString(number)

    // then
    expect(isValidString).toBeTruthy()
    expect(isInvalidString).toBeFalsy()
  })

  it('should assert is enum value', () => {
    // given
    enum Test {
      Value = 'value'
    }

    const value = 'value'

    // when
    const isEnum = isEnumValue(Test, value)

    // then
    expect(isEnum).toBeTruthy()
  })

  it('should assert is not enum value', () => {
    // given
    enum Test {
      Value = 'value'
    }

    const value = 'test'

    // when
    const isEnum = isEnumValue(Test, value)

    // then
    expect(isEnum).toBeFalsy()
  })

  it('should assert is HTMLTemplateElement', () => {
    // given
    const randomElement = document.createElement('div')
    const templateElement = document.createElement('template')

    // when
    const isRandomElementHTMLTemplateElement = isHTMLTemplateElement(randomElement)
    const isTemplateElementHTMLTemplateElement = isHTMLTemplateElement(templateElement)

    // then
    expect(isRandomElementHTMLTemplateElement).toBeFalsy()
    expect(isTemplateElementHTMLTemplateElement).toBeTruthy()
  })

  it('should assert is HTMLAnchorElement', () => {
    // given
    const randomElement = document.createElement('div')
    const anchorElement = document.createElement('a')

    // when
    const isRandomElementHTMLAnchorElement = isHTMLAnchorElement(randomElement)
    const isAnchorElementHTMLAnchorElement = isHTMLAnchorElement(anchorElement)

    // then
    expect(isRandomElementHTMLAnchorElement).toBeFalsy()
    expect(isAnchorElementHTMLAnchorElement).toBeTruthy()
  })
})
