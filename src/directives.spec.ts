import { clearDirectives, setDirective, getDirectives, isDirective } from '@router/directives'
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
    setDirective(directiveName, directiveFactory)

    // then
    expect(isDirective(directiveName)).toBeTruthy()
    expect(directiveFactory).toBeCalledTimes(0)
  })

  it('should list directives', () => {
    // given
    setDirective('test1', fn())
    setDirective('test2', fn())

    // when
    const directives = getDirectives()

    // then
    expect(directives).length(2)
  })

  it('should clear directives', () => {
    // given
    setDirective('test1', fn())
    setDirective('test2', fn())

    // when
    const directivesBeforeClear = getDirectives()
    clearDirectives()
    const directivesAfterClear = getDirectives()

    // then
    expect(directivesBeforeClear).length(2)
    expect(directivesAfterClear).length(0)
  })
})
