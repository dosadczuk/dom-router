import { defineDirective } from '@router/directives.old'
import { Directive } from '@router/enums'

/**
 * Directive:   data-router-title-default
 *
 * Description:
 *  Provides a way to set page default title. When page has no title provided -
 *  default value will be used. The directive can only be placed on <html> tag.
 *
 * Values:
 *  - page title
 *
 * Usage:
 *  <html lang="en" data-router data-router-title-default="Value of default title">
 *     ...
 *  </html>
 */
defineDirective(Directive.TitleDefault, {
  factory: null,
  options: {
    removable: true,
  },
})
