import { isDirective } from '../src/asserts'
import {
  clearDirectives,
  defineDirective,
  Directive,
  getDirectives,
  getDirectivesAsSelector
} from '../src/directives'
import { beforeEach, describe, expect, vi, it } from 'vitest'

describe('directives', () => {

  beforeEach(() => {
    clearDirectives()
  })

  it('should define directive', () => {
    // given
    const directiveName = Directive.Initialize
    const directiveFactory = vi.fn()

    // when
    defineDirective(directiveName, { factory: directiveFactory })

    // then
    expect(isDirective(directiveName)).toBe(true)
    expect(directiveFactory).not.toHaveBeenCalled()
  })

  it('should get all registered directives', () => {
    // given
    defineDirective(Directive.Initialize, { factory: vi.fn() })

    // when
    const directives = getDirectives()

    // then
    expect(directives).toHaveLength(1)
  })

  it('should get selector to find elements with any directive', () => {
    // given
    const directiveName = Directive.Initialize

    defineDirective(directiveName, { factory: vi.fn() })

    // when
    const selector = getDirectivesAsSelector()

    // then
    expect(selector).toBe(`[${directiveName}]`)
  })

  it('should unregister all directives', () => {
    // given
    defineDirective(Directive.Initialize, { factory: vi.fn() })

    // when
    const beforeUnregister = getDirectives()
    clearDirectives()
    const afterUnregister = getDirectives()

    // then
    expect(beforeUnregister).toHaveLength(1)
    expect(afterUnregister).toHaveLength(0)
  })
})
