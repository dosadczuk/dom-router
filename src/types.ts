// directives.d.ts
export type DirectiveDefinition = {
  /**
   * Directive factory, function to prepare DOM.
   */
  factory: Nullable<DirectiveFactory>

  /**
   * Direction options, automates selected things.
   */
  options?: DirectiveOptions
}
export type DirectiveFactory = (elements: ElementWithDirectives[], elementsWithDirective: ElementWithDirectives[], options: Nullable<DirectiveOptions>) => DirectiveCleanup | void
export type DirectiveCleanup = () => void
export type DirectiveOptions = {
  /**
   * Remove directive after set up.
   */
  removable: boolean,
}

// dom.d.ts
export type ElementWithDirectives<T extends Element = HTMLElement> = {
  /**
   * HTML element with directives.
   */
  content: T

  /**
   * Is page currently visible.
   */
  visible: boolean

  /**
   * Directives on the HTML element.
   */
  directives: ReadonlyMap<string, string>
}

export type ToggleElementVisibility = (element: ElementWithDirectives, canBeVisible: boolean) => boolean
export type ShowElement = (element: ElementWithDirectives) => boolean
export type HideElement = (element: ElementWithDirectives) => boolean

// events.d.ts
export type Subscriber = (data?: any) => void
export type Unsubscriber = () => void

export type ViewChangedPayload = {
  /**
   * Current page.
   */
  page: Nullable<HTMLElement>

  /**
   * Current route.
   */
  route: Nullable<string>
}

// common
export type Nullable<T> = T | null | undefined
