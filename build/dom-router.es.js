const directives = new Map();
const defineDirective = (name, factory) => {
  directives.set(name, factory);
};
const setUpDirectives = (elements, names) => {
  for (const name of names) {
    const factory = directives.get(name);
    if (factory == null) {
      continue;
    }
    factory(elements);
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
const getHTMLElementsWithAnyDirective = () => {
  const elements = document.querySelectorAll(getDirectivesAsSelector());
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
const getHTMLElementsWithDirective = (elements, directive) => {
  return elements.filter((element) => element.directives.has(directive));
};
const getFirstHTMLElementsWithDirective = (elements, directive) => {
  var _a;
  return (_a = getHTMLElementsWithDirective(elements, directive)[0]) != null ? _a : null;
};
const removeDirectiveFromHTMLElements = (elements, directive) => {
  elements.forEach(({ content: element }) => element.removeAttribute(directive));
};
const changeViewWithMode = (mode) => {
  return (element, canBeVisible) => {
    switch (mode) {
      case Mode.Display:
        return toggleDisplayElement(element, canBeVisible);
      case Mode.Template:
        return toggleTemplateElement(element, canBeVisible);
    }
    return false;
  };
};
const toggleDisplayElement = (element, canBeVisible) => {
  if (canBeVisible) {
    return displayShowElement(element);
  } else {
    return displayHideElement(element);
  }
};
const displayShowElement = ({ content: element }) => {
  element.style.display = "revert";
  return true;
};
const displayHideElement = ({ content: element }) => {
  element.style.display = "none";
  return false;
};
const toggleTemplateElement = (element, canBeVisible) => {
  if (canBeVisible) {
    return replaceTemplateWithElement(element);
  } else {
    return replaceElementWithTemplate(element);
  }
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
defineDirective(Directive.Init, () => {
  let mode = document.documentElement.getAttribute(Directive.Init);
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
  document.documentElement.removeAttribute(Directive.Init);
  dispatchToElement(document, ExternalEvent.Initialized);
});
defineDirective(Directive.Cloak, (elements) => {
  const elementsWithCloak = getHTMLElementsWithDirective(elements, Directive.Cloak);
  if (elementsWithCloak.length === 0) {
    return;
  }
  removeDirectiveFromHTMLElements(elementsWithCloak, Directive.Cloak);
});
defineDirective(Directive.Link, (elements) => {
  const elementsWithLink = getHTMLElementsWithDirective(elements, Directive.Link);
  if (elementsWithLink.length === 0) {
    return;
  }
  for (const link of elementsWithLink) {
    const route = getRouteFromLink(link);
    if (route == null) {
      continue;
    }
    link.content.addEventListener("click", prevented(() => {
      dispatch(InternalEvent.PageChange, route);
    }));
  }
  removeDirectiveFromHTMLElements(elementsWithLink, Directive.Link);
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
defineDirective(Directive.LinkActive, (elements) => {
  const elementsWithLinkActive = getHTMLElementsWithDirective(elements, Directive.LinkActive);
  if (elementsWithLinkActive.length === 0) {
    return;
  }
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
  removeDirectiveFromHTMLElements(elementsWithLinkActive, Directive.LinkActive);
});
defineDirective(Directive.Page, (elements) => {
  const elementsWithPage = getHTMLElementsWithDirective(elements, Directive.Page);
  if (elementsWithPage.length === 0) {
    return;
  }
  const elementWithFallback = getFirstHTMLElementsWithDirective(elementsWithPage, Directive.PageFallback);
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
    if (!hasVisiblePage && elementWithFallback != null) {
      toggleElementVisibility(elementWithFallback, true);
    }
    dispatchToElement(document, ExternalEvent.ViewChanged);
  });
  removeDirectiveFromHTMLElements(elementsWithPage, Directive.Page);
});
defineDirective(Directive.PageFallback, (elements) => {
  const elementsWithFallback = getHTMLElementsWithDirective(elements, Directive.PageFallback);
  if (elementsWithFallback.length === 0) {
    return;
  }
  removeDirectiveFromHTMLElements(elementsWithFallback, Directive.PageFallback);
});
defineDirective(Directive.Sitemap, (elements) => {
  const elementWithSitemap = getFirstHTMLElementsWithDirective(elements, Directive.Sitemap);
  if (elementWithSitemap == null) {
    return;
  }
  const elementsWithPage = getHTMLElementsWithDirective(elements, Directive.Page);
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
});
defineDirective(Directive.SitemapIgnore, (elements) => {
  const elementsWithSitemapIgnore = getHTMLElementsWithDirective(elements, Directive.SitemapIgnore);
  if (elementsWithSitemapIgnore.length === 0) {
    return;
  }
  removeDirectiveFromHTMLElements(elementsWithSitemapIgnore, Directive.SitemapIgnore);
});
defineDirective(Directive.Title, (elements) => {
  const elementsWithTitle = getHTMLElementsWithDirective(elements, Directive.Title);
  if (elementsWithTitle.length === 0) {
    return;
  }
  const elementsWithTitleAndPage = getHTMLElementsWithDirective(elementsWithTitle, Directive.Page);
  if (elementsWithTitleAndPage.length === 0) {
    return;
  }
  const titleTemplate = document.documentElement.getAttribute(Directive.Title);
  subscribe(InternalEvent.ViewChange, () => {
    for (const page of elementsWithTitleAndPage) {
      const route = page.directives.get(Directive.Page);
      const title = page.directives.get(Directive.Title);
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
  removeDirectiveFromHTMLElements(elementsWithTitle, Directive.Title);
});
const Router = () => {
  const canInitialize = document.documentElement.hasAttribute(Directive.Init);
  if (!canInitialize) {
    throw new Error(`Router cannot be initialized. Add '${Directive.Init}' attribute to <html></html> tag.`);
  }
  const elements = getHTMLElementsWithAnyDirective();
  if (elements.length === 0) {
    throw new Error(`Router cannot be initialized. No directive found.`);
  }
  setUpDirectives(elements, [
    Directive.Cloak,
    Directive.Title,
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
