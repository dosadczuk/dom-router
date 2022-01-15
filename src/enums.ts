// directives.ts
export enum Directive {
  Init = 'data-router',
  Cloak = 'data-router-cloak',
  Title = 'data-router-title',
  Link = 'data-router-link',
  LinkActive = 'data-router-link-active',
  Page = 'data-router-page',
}

// events.ts
export enum InternalEvent {
  PageChange = 'page-change',
  ViewChange = 'view-change'
}

export enum ExternalEvent {
  Initialize = 'router:initialize',
  Initialized = 'router:initialized',

  ViewChanged = 'router:view-changed'
}

// common
export enum Mode {
  Display = 'display',
  Template = 'template'
}
