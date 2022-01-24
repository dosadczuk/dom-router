import { defineDirective } from '@router/directives'
import { Directive } from '@router/enums'

/**
 * Directive:   data-router-page-fallback
 *
 * Description:
 *  Marks page as fallback when no page is matching URL.
 *
 * Usage:
 *  <section data-router-page="/404" data-router-page-fallback>
 *    <!-- page content -->
 *  </section>
 */
defineDirective(Directive.PageFallback, {
  factory: null,
  options: {
    removable: true,
  },
})
