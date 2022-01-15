import {
  clearDirectives,
  defineDirective,
  getDirectives,
  getDirectivesAsSelector,
  isDirective,
} from '@router/directives'
import { afterEach, describe, expect, fn, it } from 'vitest'

describe('directives', () => {

  afterEach(() => {
    clearDirectives()
  })

  it('should add directive', () => {
    // given
    const directiveName = 'test'
    const directiveFactory = fn()

    // when
    defineDirective(directiveName, directiveFactory)

    // then
    expect(isDirective(directiveName)).toBeTruthy()
    expect(directiveFactory).toBeCalledTimes(0)
  })

  it('should list directives', () => {
    // given
    defineDirective('test1', fn())
    defineDirective('test2', fn())

    // when
    const directives = getDirectives()

    // then
    expect(directives).length(2)
  })

  it('should get selector to find elements with any directive', function () {
    // given
    defineDirective('test1', fn())
    defineDirective('test2', fn())

    // when
    const selector = getDirectivesAsSelector()

    // then
    expect(selector, '[test1], [test2]')
  })

  it('should clear directives', () => {
    // given
    defineDirective('test1', fn())
    defineDirective('test2', fn())

    // when
    const directivesBeforeClear = getDirectives()
    clearDirectives()
    const directivesAfterClear = getDirectives()

    // then
    expect(directivesBeforeClear).length(2)
    expect(directivesAfterClear).length(0)
  })
})
