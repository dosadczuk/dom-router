const isString = (value) => {
  return typeof value === "string" || value instanceof String;
};
const isEmptyString = (value) => {
  return value == null || isString(value) && value.length === 0;
};
const isEnum = (value, enumObject) => {
  return Object.values(enumObject).includes(String(value));
};
const isDirective = (value) => {
  return isEnum(value, Directive) && getDirectives().includes(value);
};
const isHTMLAnchorElement = (value) => {
  return value instanceof HTMLAnchorElement;
};
const isHTMLTemplateElement = (value) => {
  return value instanceof HTMLTemplateElement;
};
var ToggleMode;
(function(ToggleMode2) {
  ToggleMode2["Display"] = "display";
  ToggleMode2["Template"] = "template";
})(ToggleMode || (ToggleMode = {}));
let Root = document.documentElement;
const getRootDirective = (directive, defaultValue) => {
  var _a;
  return (_a = Root.getAttribute(String(directive))) != null ? _a : defaultValue;
};
const getRootDirectives = (directives) => {
  return directives.map((directive) => getRootDirective(directive));
};
const hasRootDirective = (directive) => {
  return Root.hasAttribute(String(directive));
};
const removeRootDirective = (directive) => {
  Root.removeAttribute(String(directive));
};
const removeRootDirectives = (directives) => {
  directives.forEach((directive) => removeRootDirective(directive));
};
const getElementsWithAnyDirective = () => {
  const elements = Root.querySelectorAll(getDirectivesAsSelector());
  if (elements.length === 0) {
    return [];
  }
  return Array.from(elements, (element) => {
    const attributes = Array.from(element.attributes);
    const directives = new Map();
    for (const { name, value } of attributes) {
      if (isDirective(name)) {
        directives.set(name, value);
      }
    }
    return {
      element,
      visible: false,
      directives
    };
  });
};
const getElementsWithDirective = (elements, directive) => {
  return elements.filter((element) => element.directives.has(directive));
};
const getElementWithDirective = (elements, directive) => {
  var _a;
  return (_a = elements.find((element) => element.directives.has(directive))) != null ? _a : null;
};
const removeDirectiveFromElements = (elements, directive) => {
  elements.forEach(({ element }) => {
    element.removeAttribute(directive);
  });
};
const toggleViewWithMode = (mode) => {
  return (element, visible) => {
    switch (mode) {
      case ToggleMode.Display:
        visible ? displayShowElement(element) : displayHideElement(element);
        break;
      case ToggleMode.Template:
        visible ? replaceTemplateWithElement(element) : replaceElementWithTemplate(element);
        break;
    }
    return element.visible;
  };
};
const displayShowElement = (element) => {
  element.element.style.display = "revert";
  element.visible = true;
};
const displayHideElement = (element) => {
  element.element.style.display = "none";
  element.visible = false;
};
const replaceTemplateWithElement = (element) => {
  const { element: elementToHide } = element;
  if (!isHTMLTemplateElement(elementToHide)) {
    return;
  }
  const elementToShow = elementToHide.content.firstElementChild;
  if (elementToShow == null) {
    return;
  }
  element.element.replaceWith(elementToShow);
  element.element = elementToShow;
  element.visible = true;
};
const replaceElementWithTemplate = (element) => {
  const { element: elementToHide } = element;
  if (isHTMLTemplateElement(elementToHide)) {
    return;
  }
  const elementToShow = document.createElement("template");
  elementToShow.content.append(elementToHide.cloneNode(true));
  element.element.replaceWith(elementToShow);
  element.element = elementToShow;
  element.visible = false;
};
const appendClassNameToElement = (element, classes) => {
  element.element.classList.add(...classes);
};
const removeClassNameFromElement = (element, classes) => {
  element.element.classList.remove(...classes);
};
var Directive;
(function(Directive2) {
  Directive2["Initialize"] = "data-router";
  Directive2["Cloak"] = "data-router-cloak";
  Directive2["Title"] = "data-router-title";
  Directive2["TitleDefault"] = "data-router-title-default";
  Directive2["Link"] = "data-router-link";
  Directive2["LinkActive"] = "data-router-link-active";
  Directive2["Page"] = "data-router-page";
  Directive2["PageFallback"] = "data-router-page-fallback";
  Directive2["Sitemap"] = "data-router-sitemap";
  Directive2["SitemapIgnore"] = "data-router-sitemap-ignore";
})(Directive || (Directive = {}));
const DirectiveRegistry = new Map();
const defineDirective = (directive, definition2) => {
  DirectiveRegistry.set(directive, definition2 != null ? definition2 : null);
};
const processDirectives = (elements, directives) => {
  for (const directive of directives) {
    const definition2 = DirectiveRegistry.get(directive);
    if (definition2 == null) {
      continue;
    }
    const { factory, options } = definition2;
    if (factory != null) {
      const cleanup = factory(elements, getElementsWithDirective(elements, directive), options);
      if (cleanup != null) {
        cleanup();
      }
    }
    if (options != null) {
      if (options.removable) {
        removeDirectiveFromElements(elements, directive);
      }
    }
  }
};
const getDirectives = () => {
  return Array.from(DirectiveRegistry.keys());
};
const getDirectivesAsSelector = () => {
  return getDirectives().map((directive) => `[${directive}]`).join(", ");
};
var InternalEvent;
(function(InternalEvent2) {
  InternalEvent2[InternalEvent2["PageChange"] = 0] = "PageChange";
  InternalEvent2[InternalEvent2["ViewChange"] = 1] = "ViewChange";
})(InternalEvent || (InternalEvent = {}));
var ExternalEvent;
(function(ExternalEvent2) {
  ExternalEvent2["BeforeMount"] = "router:before-mount";
  ExternalEvent2["Mounted"] = "router:mounted";
  ExternalEvent2["BeforePageUpdate"] = "router:before-page-update";
  ExternalEvent2["PageUpdated"] = "router:page-updated";
  ExternalEvent2["BeforeViewUpdate"] = "router:before-view-update";
  ExternalEvent2["ViewUpdated"] = "router:view-updated";
})(ExternalEvent || (ExternalEvent = {}));
const EventBus = new Map();
const subscribe = (event, fn) => {
  if (!EventBus.has(event)) {
    EventBus.set(event, new Set());
  }
  EventBus.get(event).add(fn);
  return () => {
    EventBus.get(event).delete(fn);
  };
};
const dispatch = (event, data) => {
  var _a;
  (_a = EventBus.get(event)) == null ? void 0 : _a.forEach((fn) => fn(data));
};
const subscribeTo = (target, event, fn) => {
  target.addEventListener(String(event), fn);
  return () => {
    target.removeEventListener(String(event), fn);
  };
};
const dispatchTo = (target, event, data) => {
  target.dispatchEvent(new CustomEvent(String(event), {
    detail: data,
    bubbles: true,
    composed: true,
    cancelable: true
  }));
};
const prevent = (fn) => {
  return (event) => {
    event.preventDefault();
    event.stopPropagation();
    fn(event);
  };
};
function parse(str, loose) {
  if (str instanceof RegExp)
    return { keys: false, pattern: str };
  var c, o, tmp, ext, keys = [], pattern = "", arr = str.split("/");
  arr[0] || arr.shift();
  while (tmp = arr.shift()) {
    c = tmp[0];
    if (c === "*") {
      keys.push("wild");
      pattern += "/(.*)";
    } else if (c === ":") {
      o = tmp.indexOf("?", 1);
      ext = tmp.indexOf(".", 1);
      keys.push(tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length));
      pattern += !!~o && !~ext ? "(?:/([^/]+?))?" : "/([^/]+?)";
      if (!!~ext)
        pattern += (!!~o ? "?" : "") + "\\" + tmp.substring(ext);
    } else {
      pattern += "/" + tmp;
    }
  }
  return {
    keys,
    pattern: new RegExp("^" + pattern + (loose ? "(?=$|/)" : "/?$"), "i")
  };
}
const getCurrentURL = () => {
  return new URL(window.location.href);
};
const isMatchingURL = (pattern, url = getCurrentURL()) => {
  return parse(pattern).pattern.test(url.pathname);
};
defineDirective(Directive.Initialize, {
  factory: () => {
    let mode = getRootDirective(Directive.Initialize, "");
    if (!isEnum(mode, ToggleMode)) {
      mode = ToggleMode.Display;
    }
    dispatchTo(document, ExternalEvent.BeforeMount);
    subscribe(InternalEvent.PageChange, (route) => {
      if (!isMatchingURL(route, getCurrentURL())) {
        return;
      }
      dispatchTo(document, ExternalEvent.BeforePageUpdate);
      history.pushState(null, "", route);
      dispatchTo(document, ExternalEvent.PageUpdated);
      dispatch(InternalEvent.ViewChange, toggleViewWithMode(mode));
    });
    subscribeTo(window, "popstate", () => {
      dispatch(InternalEvent.ViewChange, toggleViewWithMode(mode));
    });
    dispatch(InternalEvent.ViewChange, toggleViewWithMode(mode));
    dispatchTo(document, ExternalEvent.Mounted);
  },
  options: {
    removable: true
  }
});
defineDirective(Directive.Cloak, {
  factory: null,
  options: {
    removable: true
  }
});
defineDirective(Directive.Link, {
  factory: (_, elementsWithLink) => {
    for (const link of elementsWithLink) {
      const route = getRoute(link);
      if (isEmptyString(route)) {
        continue;
      }
      link.element.addEventListener("click", prevent(() => {
        dispatch(InternalEvent.PageChange, route);
      }));
    }
  },
  options: {
    removable: true
  }
});
const getRoute = (element) => {
  var _a;
  const { element: link, directives } = element;
  if (isHTMLAnchorElement(link) && !isEmptyString(link.href)) {
    return link.pathname;
  }
  return (_a = directives.get(Directive.Link)) != null ? _a : null;
};
defineDirective(Directive.LinkActive, {
  factory: (_, elementsWithLinkActive) => {
    subscribe(InternalEvent.ViewChange, () => {
      for (const link of elementsWithLinkActive) {
        const route = getRoute(link);
        if (isEmptyString(route)) {
          continue;
        }
        let className = link.directives.get(Directive.LinkActive);
        if (isEmptyString(className)) {
          className = "active";
        }
        if (isMatchingURL(route)) {
          appendClassNameToElement(link, className.split(" "));
        } else {
          removeClassNameFromElement(link, className.split(" "));
        }
      }
    });
  },
  options: {
    removable: true
  }
});
defineDirective(Directive.Page, {
  factory: (elements, elementsWithPage) => {
    const pages = getRoutePages(elements);
    if (pages.size === 0) {
      return;
    }
    const fallback = getElementWithDirective(elementsWithPage, Directive.PageFallback);
    subscribe(InternalEvent.ViewChange, (toggleElementVisibility) => {
      const payload = {
        route: null,
        element: null
      };
      dispatchTo(document, ExternalEvent.BeforeViewUpdate, payload);
      for (const [route, page] of pages) {
        if (toggleElementVisibility(page, isMatchingURL(route))) {
          payload.route = route;
          payload.element = page.element;
        }
      }
      if (payload.element == null && fallback != null) {
        if (toggleElementVisibility(fallback, true)) {
          payload.element = fallback.element;
        }
      }
      dispatchTo(document, ExternalEvent.ViewUpdated, payload);
    });
  },
  options: {
    removable: true
  }
});
const getRoutePages = (elements) => {
  const pages = new Map();
  for (const element of elements) {
    const route = element.directives.get(Directive.Page);
    if (isEmptyString(route)) {
      continue;
    }
    pages.set(route, element);
  }
  return pages;
};
defineDirective(Directive.PageFallback, {
  factory: null,
  options: {
    removable: true
  }
});
defineDirective(Directive.Sitemap, {
  factory: (elements) => {
    const elementWithSitemap = getElementWithDirective(elements, Directive.Sitemap);
    if (elementWithSitemap == null) {
      return;
    }
    const elementsWithPage = getElementsWithDirective(elements, Directive.Page);
    if (elementsWithPage.length === 0) {
      return;
    }
    const list = document.createElement("ol");
    for (const { directives } of elementsWithPage) {
      if (directives.has(Directive.SitemapIgnore)) {
        continue;
      }
      const route = directives.get(Directive.Page);
      const title = directives.get(Directive.Title);
      if (isEmptyString(route) || isEmptyString(title)) {
        continue;
      }
      const link = document.createElement("a");
      link.href = route;
      link.text = title;
      const item = document.createElement("li");
      item.append(link);
      list.append(item);
    }
    elementWithSitemap.element.append(list);
  },
  options: {
    removable: false
  }
});
defineDirective(Directive.SitemapIgnore, {
  factory: null,
  options: {
    removable: true
  }
});
defineDirective(Directive.Title, {
  factory: (elements) => {
    const elementsWithPage = getElementsWithDirective(elements, Directive.Page);
    if (elementsWithPage.length === 0) {
      return;
    }
    const [titleTemplate, titleFallback] = getRootDirectives([Directive.Title, Directive.TitleDefault]);
    subscribe(InternalEvent.ViewChange, () => {
      var _a;
      for (const page of elementsWithPage) {
        const route = page.directives.get(Directive.Page);
        const title = (_a = page.directives.get(Directive.Title)) != null ? _a : titleFallback;
        if (isEmptyString(route) || isEmptyString(title)) {
          continue;
        }
        if (!isMatchingURL(route)) {
          continue;
        }
        if (titleTemplate != null) {
          document.title = titleTemplate.replace("{{title}}", title);
        } else {
          document.title = title;
        }
        break;
      }
    });
    return () => {
      removeRootDirectives([Directive.Title, Directive.TitleDefault]);
    };
  },
  options: {
    removable: true
  }
});
defineDirective(Directive.TitleDefault, {
  factory: null,
  options: {
    removable: true
  }
});
const definition = [
  Directive.Cloak,
  Directive.TitleDefault,
  Directive.Title,
  Directive.PageFallback,
  Directive.Page,
  Directive.SitemapIgnore,
  Directive.Sitemap,
  Directive.LinkActive,
  Directive.Link,
  Directive.Initialize
];
(function Router() {
  const canInitialize = hasRootDirective(Directive.Initialize);
  if (!canInitialize) {
    throw new Error(`Router cannot be initialized. Add '${Directive.Initialize}' attribute to root element.`);
  }
  const elements = getElementsWithAnyDirective();
  if (elements.length === 0) {
    throw new Error(`Router cannot be initialized. No directive found.`);
  }
  processDirectives(elements, definition);
})();
