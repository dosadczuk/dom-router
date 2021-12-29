import { directive } from '@router/directives'
import { getHTMLElementsWithDirective } from '@router/dom'
import { afterEach, describe, expect, it } from 'vitest'

describe('dom', () => {

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should get HTMLElements with directive', () => {
    // given
    directive('data-test', () => true)

    const elementWithTestDirective = document.createElement('div')
    elementWithTestDirective.setAttribute('data-test', 'test')

    document.body.append(elementWithTestDirective)

    // when
    const elements = getHTMLElementsWithDirective('data-test')
    const { element, directives } = elements[0]

    // then
    expect(elements).length(1)
    expect(element.isEqualNode(elementWithTestDirective)).toBeTruthy()
    expect(directives.size).toEqual(1)
    expect(directives.has('data-test')).toBeTruthy()
    expect(directives.get('data-test')).toEqual('test')
  })
})
