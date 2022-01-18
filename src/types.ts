// directives.d.ts
export type DirectiveFactory = (elements: HTMLElementWithDirectives[]) => void;

// dom.d.ts
export type HTMLElementWithDirectives = {
  content: HTMLElement;
  directives: ReadonlyMap<string, string>;
}

export type ToggleElementVisibility = (element: HTMLElementWithDirectives, canBeVisible: boolean) => boolean;
export type ShowElement = (element: HTMLElementWithDirectives) => boolean;
export type HideElement = (element: HTMLElementWithDirectives) => boolean;

// events.d.ts
export type Subscriber = (data?: any) => void;
export type Unsubscriber = () => void;

// common
export type Nullable<T> = T | null | undefined
