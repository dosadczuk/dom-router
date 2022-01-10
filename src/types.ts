// dom.d.ts
export type HTMLElementWithDirectives = {
  content: HTMLElement;
  directives: ReadonlyMap<string, string>;
}

// events.d.ts
export type Subscriber = (data?: any) => void;
export type Unsubscriber = () => void;

// common
export type Nullable<T> = T | null
