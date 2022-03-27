import { defineDirective } from '@router/directives.old'
import { Directive } from '@router/enums'

/**
 * Directive:   data-router-sitemap-ignore
 *
 * Description:
 *  Marks page to be excluded from sitemap.
 *
 * Usage:
 *  <section data-router-page="/page" data-router-sitemap-ignore>
 *    <!-- page content -->
 *  </section>
 */
defineDirective(Directive.SitemapIgnore, {
  factory: null,
  options: {
    removable: true,
  },
})
