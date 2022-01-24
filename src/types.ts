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
export type DirectiveFactory = (elements: HTMLElementWithDirectives[], elementsWithDirective: HTMLElementWithDirectives[], options: Nullable<DirectiveOptions>) => DirectiveCleanup | void
export type DirectiveCleanup = () => void
export type DirectiveOptions = {
  /**
   * Remove directive after set up.
   */
  removable: boolean,
}

// dom.d.ts
export type HTMLElementWithDirectives = {
  /**
   * HTML element with directives.
   */
  content: HTMLElement

  /**
   * Directives on the HTML element.
   */
  directives: ReadonlyMap<string, string>
}

export type ToggleElementVisibility = (element: HTMLElementWithDirectives, canBeVisible: boolean) => boolean
export type ShowElement = (element: HTMLElementWithDirectives) => boolean
export type HideElement = (element: HTMLElementWithDirectives) => boolean

// events.d.ts
export type Subscriber = (data?: any) => void
export type Unsubscriber = () => void

// common
export type Nullable<T> = T | null | undefined
