import { isHTMLTemplateElement } from '@router/asserts'
import { describe, expect, it } from 'vitest'

describe('asserts', () => {

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
})
