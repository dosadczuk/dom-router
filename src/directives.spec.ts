import {
  clearDirectives,
  defineDirective,
  getDirectives,
  getDirectivesAsSelector,
  isDirective,
  setUpDirectives,
} from '@router/directives'
import type { DirectiveCleanup, DirectiveFactory } from '@router/types'
import { afterEach, describe, expect, fn, it } from 'vitest'

describe('directives', () => {

  afterEach(() => {
    clearDirectives()
  })

  it('should define directive', () => {
    // given
    const directiveName = 'test'
    const directiveFactory = fn()

    // when
    defineDirective(directiveName, { factory: directiveFactory })

    // then
    expect(isDirective(directiveName)).toBeTruthy()
    expect(directiveFactory).toBeCalledTimes(0)
  })

  it('should list directives', () => {
    // given
    defineDirective('test1', { factory: null })
    defineDirective('test2', { factory: null })

    // when
    const directives = getDirectives()

    // then
    expect(directives).length(2)
  })

  it('should set up directives with factory function', () => {
    // given
    const directiveName = 'test1'
    const directiveCleanup: DirectiveCleanup = fn()
    const directiveFactory: DirectiveFactory = fn(() => directiveCleanup)

    defineDirective(directiveName, {
      factory: directiveFactory,
    })

    // when
    setUpDirectives([], [ directiveName ])

    // then
    expect(directiveFactory).toBeCalledTimes(1)
    expect(directiveCleanup).toBeCalledTimes(1)
  })

  it('should get selector to find elements with any directive', function () {
    // given
    defineDirective('test1', { factory: null })
    defineDirective('test2', { factory: null })

    // when
    const selector = getDirectivesAsSelector()

    // then
    expect(selector, '[test1], [test2]')
  })

  it('should clear directives', () => {
    // given
    defineDirective('test1', { factory: null })
    defineDirective('test2', { factory: null })

    // when
    const directivesBeforeClear = getDirectives()
    clearDirectives()
    const directivesAfterClear = getDirectives()

    // then
    expect(directivesBeforeClear).length(2)
    expect(directivesAfterClear).length(0)
  })
})
