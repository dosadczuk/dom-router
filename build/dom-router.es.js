const isString = (value) => {
  return typeof value === "string";
};
const isEmptyString = (value) => {
  return value == null || isString(value) && value.length === 0;
};
const isEnumValue = (enumObject, value) => {
  return Object.values(enumObject).includes(value);
};
const isHTMLTemplateElement = (element) => {
  return element instanceof HTMLTemplateElement;
};
const isHTMLAnchorElement = (element) => {
  return element instanceof HTMLAnchorElement;
};
var Directive;
(function(Directive2) {
  Directive2["Init"] = "data-router";
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
var InternalEvent;
(function(InternalEvent2) {
  InternalEvent2["PageChange"] = "page-change";
  InternalEvent2["ViewChange"] = "view-change";
})(InternalEvent || (InternalEvent = {}));
var ExternalEvent;
(function(ExternalEvent2) {
  ExternalEvent2["Initialize"] = "router:initialize";
  ExternalEvent2["Initialized"] = "router:initialized";
  ExternalEvent2["ViewChanged"] = "router:view-changed";
})(ExternalEvent || (ExternalEvent = {}));
var Mode;
(function(Mode2) {
  Mode2["Display"] = "display";
  Mode2["Template"] = "template";
})(Mode || (Mode = {}));
const root = document.documentElement;
const getRootElementDirective = (directive) => {
  var _a;
  return (_a = root.getAttribute(directive)) != null ? _a : null;
};
const getRootElementDirectives = (directives2) => {
  return directives2.map(getRootElementDirective);
};
const hasRootElementDirective = (directive) => {
  return root.hasAttribute(directive);
};
const removeDirectiveFromRootElement = (directive) => {
  root.removeAttribute(directive);
};
const removeDirectivesFromRootElement = (directives2) => {
  directives2.forEach(removeDirectiveFromRootElement);
};
const getElementsWithAnyDirective = () => {
  const elements = root.querySelectorAll(getDirectivesAsSelector());
  if (elements.length === 0) {
    return [];
  }
  return Array.from(elements, (element) => {
    const attributes = Array.from(element.attributes);
    const directives2 = new Map();
    for (const { name, value } of attributes) {
      if (isDirective(name)) {
        directives2.set(name, value);
      }
    }
    return { content: element, directives: directives2 };
  });
};
const getElementsWithDirective = (elements, directive) => {
  return elements.filter((element) => element.directives.has(directive));
};
const getFirstElementWithDirective = (elements, directive) => {
  var _a;
  return (_a = elements.find((element) => element.directives.has(directive))) != null ? _a : null;
};
const removeDirectiveFromElements = (elements, directive) => {
  elements.forEach(({ content: element }) => element.removeAttribute(directive));
};
const changeViewWithMode = (mode) => {
  return (element, canBeVisible) => {
    switch (mode) {
      case Mode.Display: {
        return canBeVisible ? displayShowElement(element) : displayHideElement(element);
      }
      case Mode.Template: {
        return canBeVisible ? replaceTemplateWithElement(element) : replaceElementWithTemplate(element);
      }
    }
    return false;
  };
};
const displayShowElement = ({ content: element }) => {
  element.style.display = "revert";
  return true;
};
const displayHideElement = ({ content: element }) => {
  element.style.display = "none";
  return false;
};
const replaceTemplateWithElement = (element) => {
  const { content: template } = element;
  if (!isHTMLTemplateElement(template)) {
    return true;
  }
  const content = template.content.firstElementChild;
  if (content == null) {
    return false;
  }
  element.content.replaceWith(content);
  element.content = content;
  return true;
};
const replaceElementWithTemplate = (element) => {
  const { content } = element;
  if (isHTMLTemplateElement(content)) {
    return false;
  }
  const template = document.createElement("template");
  template.content.append(content.cloneNode(true));
  element.content.replaceWith(template);
  element.content = template;
  return false;
};
const appendClassNamesToElement = (element, classNames) => {
  element.content.classList.add(...classNames);
};
const removeClassNamesFromElement = (element, classNames) => {
  element.content.classList.remove(...classNames);
};
const directives = new Map();
const defineDirective = (name, definition) => {
  directives.set(name, definition);
};
const setUpDirectives = (elements, names) => {
  for (const name of names) {
    const definition = directives.get(name);
    if (definition == null) {
      continue;
    }
    const { factory, options } = definition;
    if (factory != null) {
      const cleanup = factory(elements, getElementsWithDirective(elements, name), options);
      if (cleanup != null) {
        cleanup();
      }
    }
    if (options != null) {
      if (options.removable) {
        removeDirectiveFromElements(elements, name);
      }
    }
  }
};
const isDirective = (name) => {
  return getDirectives().includes(name);
};
const getDirectives = () => {
  return Array.from(directives.keys());
};
const getDirectivesAsSelector = () => {
  return getDirectives().map((it) => `[${it}]`).join(", ");
};
const EventBus = new Map();
const subscribe = (event, handler) => {
  if (!EventBus.has(event)) {
    EventBus.set(event, new Set());
  }
  EventBus.get(event).add(handler);
  return () => {
    if (EventBus.has(event)) {
      EventBus.get(event).delete(handler);
    }
  };
};
const dispatch = (event, data) => {
  var _a;
  (_a = EventBus.get(event)) == null ? void 0 : _a.forEach((handler) => handler(data));
};
const subscribeToElement = (element, event, handler) => {
  element.addEventListener(event, handler);
  return () => {
    element.removeEventListener(event, handler);
  };
};
const dispatchToElement = (element, event, data) => {
  element.dispatchEvent(new CustomEvent(event, {
    detail: data,
    bubbles: true,
    composed: true,
    cancelable: true
  }));
};
const prevented = (handler) => {
  return (event) => {
    event.preventDefault();
    handler(event);
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
defineDirective(Directive.Init, {
  factory: () => {
    var _a;
    let mode = (_a = getRootElementDirective(Directive.Init)) != null ? _a : "";
    if (!isEnumValue(Mode, mode)) {
      mode = Mode.Display;
    }
    dispatchToElement(document, ExternalEvent.Initialize);
    subscribe(InternalEvent.PageChange, (route) => {
      if (isMatchingURL(route, getCurrentURL())) {
        return;
      }
      history.pushState(null, "", route);
      dispatch(InternalEvent.ViewChange, changeViewWithMode(mode));
    });
    subscribeToElement(window, "popstate", () => {
      dispatch(InternalEvent.ViewChange, changeViewWithMode(mode));
    });
    dispatch(InternalEvent.ViewChange, changeViewWithMode(mode));
    removeDirectiveFromRootElement(Directive.Init);
    dispatchToElement(document, ExternalEvent.Initialized);
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
      const route = getRouteFromLink(link);
      if (isEmptyString(route)) {
        continue;
      }
      link.content.addEventListener("click", prevented(() => {
        dispatch(InternalEvent.PageChange, route);
      }));
    }
  },
  options: {
    removable: true
  }
});
const getRouteFromLink = ({ content: link, directives: directives2 }) => {
  var _a;
  const route = directives2.get(Directive.Link);
  if (!isEmptyString(route)) {
    return route;
  }
  if (isHTMLAnchorElement(link)) {
    return (_a = link.pathname) != null ? _a : null;
  }
  return null;
};
defineDirective(Directive.LinkActive, {
  factory: (_, elementsWithLinkActive) => {
    subscribe(InternalEvent.ViewChange, () => {
      for (const link of elementsWithLinkActive) {
        const route = getRouteFromLink(link);
        if (isEmptyString(route)) {
          continue;
        }
        let className = link.directives.get(Directive.LinkActive);
        if (isEmptyString(className)) {
          className = "active";
        }
        if (isMatchingURL(route)) {
          appendClassNamesToElement(link, className.split(" "));
        } else {
          removeClassNamesFromElement(link, className.split(" "));
        }
      }
    });
  },
  options: {
    removable: true
  }
});
defineDirective(Directive.Page, {
  factory: (_, elementsWithPage) => {
    const fallback = getFirstElementWithDirective(elementsWithPage, Directive.PageFallback);
    subscribe(InternalEvent.ViewChange, (toggleElementVisibility) => {
      let hasVisiblePage = false;
      for (const page of elementsWithPage) {
        const route = page.directives.get(Directive.Page);
        if (isEmptyString(route)) {
          continue;
        }
        const isPageVisible = toggleElementVisibility(page, isMatchingURL(route));
        hasVisiblePage || (hasVisiblePage = isPageVisible);
      }
      if (!hasVisiblePage && fallback != null) {
        toggleElementVisibility(fallback, true);
      }
      dispatchToElement(document, ExternalEvent.ViewChanged);
    });
  },
  options: {
    removable: true
  }
});
defineDirective(Directive.PageFallback, {
  factory: null,
  options: {
    removable: true
  }
});
defineDirective(Directive.Sitemap, {
  factory: (elements) => {
    const elementWithSitemap = getFirstElementWithDirective(elements, Directive.Sitemap);
    if (elementWithSitemap == null) {
      return;
    }
    const elementsWithPage = getElementsWithDirective(elements, Directive.Page);
    if (elementsWithPage.length === 0) {
      return;
    }
    const list = document.createElement("ol");
    for (const { directives: directives2 } of elementsWithPage) {
      if (directives2.has(Directive.SitemapIgnore)) {
        continue;
      }
      const route = directives2.get(Directive.Page);
      const title = directives2.get(Directive.Title);
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
    elementWithSitemap.content.append(list);
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
    const [titleTemplate, titleFallback] = getRootElementDirectives([Directive.Title, Directive.TitleDefault]);
    subscribe(InternalEvent.ViewChange, () => {
      var _a;
      for (const page of elementsWithPage) {
        const route = page.directives.get(Directive.Page);
        const title = (_a = page.directives.get(Directive.Title)) != null ? _a : titleFallback;
        if (isEmptyString(route) || isEmptyString(title)) {
          continue;
        }
        if (isMatchingURL(route)) {
          if (titleTemplate != null) {
            document.title = titleTemplate.replace("{title}", title);
          } else {
            document.title = title;
          }
          break;
        }
      }
    });
    return () => {
      removeDirectivesFromRootElement([Directive.Title, Directive.TitleDefault]);
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
const Router = () => {
  const canInitialize = hasRootElementDirective(Directive.Init);
  if (!canInitialize) {
    throw new Error(`Router cannot be initialized. Add '${Directive.Init}' attribute to <html></html> tag.`);
  }
  const elements = getElementsWithAnyDirective();
  if (elements.length === 0) {
    throw new Error(`Router cannot be initialized. No directive found.`);
  }
  setUpDirectives(elements, [
    Directive.Cloak,
    Directive.Title,
    Directive.TitleDefault,
    Directive.Page,
    Directive.PageFallback,
    Directive.Sitemap,
    Directive.SitemapIgnore,
    Directive.Link,
    Directive.LinkActive,
    Directive.Init
  ]);
};
Router();
