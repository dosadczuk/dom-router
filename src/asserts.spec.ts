import { isEmpty, isEnumValue, isHTMLAnchorElement, isHTMLTemplateElement, isString } from '@router/asserts'
import { describe, expect, it } from 'vitest'

describe('asserts', () => {

  it('should assert empty string', () => {
    // given
    const emptyString = ''
    const notEmptyString = 'sample string'

    const emptyValue = undefined
    const notEmptyValue = 123

    // when
    const isEmptyString = isEmpty(emptyString)
    const isNotEmptyString = isEmpty(notEmptyString)
    const isEmptyValue = isEmpty(emptyValue)
    const isNotEmptyValue = isEmpty(notEmptyValue)

    // then
    expect(isEmptyString).toBeTruthy()
    expect(isNotEmptyString).toBeFalsy()
    expect(isEmptyValue).toBeTruthy()
    expect(isNotEmptyValue).toBeFalsy()
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

  it('should assert is enum value', function () {
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

  it('should assert is not enum value', function () {
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
