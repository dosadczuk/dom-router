import { Directive } from '@router/directives'
import '@router/directives/data-router'
import '@router/directives/data-router-cloak'
import '@router/directives/data-router-link'
import '@router/directives/data-router-link-active'
import '@router/directives/data-router-page'
import '@router/directives/data-router-page-fallback'
import '@router/directives/data-router-sitemap'
import '@router/directives/data-router-sitemap-ignore'
import '@router/directives/data-router-title'
import '@router/directives/data-router-title-default'

/**
 * Directives to be executed in the order.
 */
export const definition = [
  Directive.Cloak,

  Directive.TitleDefault,
  Directive.Title,

  Directive.PageFallback,
  Directive.Page,

  Directive.SitemapIgnore,
  Directive.Sitemap,

  Directive.LinkActive,
  Directive.Link,

  // init at the end
  Directive.Initialize,
]
