var Directive;
(function(Directive2) {
  Directive2["Init"] = "data-router";
  Directive2["Cloak"] = "data-router-cloak";
  Directive2["Title"] = "data-router-title";
  Directive2["Link"] = "data-router-link";
  Directive2["LinkActive"] = "data-router-link-active";
  Directive2["Page"] = "data-router-page";
})(Directive || (Directive = {}));
const directives = new Map();
const setDirective = (name, factory) => {
  directives.set(name, factory);
};
const setUpDirectives = (names) => {
  names.forEach((name) => setUpDirective(name));
};
const setUpDirective = (name) => {
  const factory = directives.get(name);
  if (factory == null) {
    return;
  }
  factory();
};
const isDirective = (name) => {
  return getDirectives().includes(name);
};
const getDirectives = () => {
  return Array.from(directives.keys());
};
const isEmpty = (value) => {
  if (isString(value)) {
    return value.length == 0;
  }
  return value == null;
};
const isString = (value) => {
  return typeof value === "string";
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
  (_a = EventBus.get(event)) == null ? void 0 : _a.forEach((handler) => {
    handler(data);
  });
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
var Mode;
(function(Mode2) {
  Mode2["Display"] = "display";
  Mode2["Template"] = "template";
})(Mode || (Mode = {}));
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
setDirective(Directive.Init, () => {
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
    dispatch(InternalEvent.ViewChange, mode);
  });
  subscribeToElement(window, "popstate", () => {
    dispatch(InternalEvent.ViewChange, mode);
  });
  dispatch(InternalEvent.ViewChange, mode);
  dispatchToElement(document, ExternalEvent.Initialized);
});
const getHTMLElementsWithDirective = (directive) => {
  const elements = document.querySelectorAll(`[${directive}]`);
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
const toggleDisplayElement = (element, canBeVisible) => {
  if (canBeVisible) {
    displayShowElement(element);
  } else {
    displayHideElement(element);
  }
};
const displayShowElement = ({ content: element }) => {
  element.style.display = "revert";
};
const displayHideElement = ({ content: element }) => {
  element.style.display = "none";
};
const toggleTemplateElement = (element, canBeVisible) => {
  if (canBeVisible) {
    replaceTemplateWithElement(element);
  } else {
    replaceElementWithTemplate(element);
  }
};
const replaceTemplateWithElement = (element) => {
  const { content: template } = element;
  if (!isHTMLTemplateElement(template)) {
    return;
  }
  const content = template.content.firstElementChild;
  if (content == null) {
    return;
  }
  element.content.replaceWith(content);
  element.content = content;
};
const replaceElementWithTemplate = (element) => {
  const { content, directives: directives2 } = element;
  if (isHTMLTemplateElement(content)) {
    return;
  }
  const template = document.createElement("template");
  template.content.append(content.cloneNode(true));
  directives2.forEach((value, name) => {
    template.setAttribute(name, value);
  });
  element.content.replaceWith(template);
  element.content = template;
};
const appendClassNamesToElement = (element, classNames) => {
  element.content.classList.add(...classNames);
};
const removeClassNamesFromElement = (element, classNames) => {
  element.content.classList.remove(...classNames);
};
setDirective(Directive.Cloak, () => {
  const elementsWithCloak = getHTMLElementsWithDirective(Directive.Cloak);
  if (elementsWithCloak.length === 0) {
    return;
  }
  for (const element of elementsWithCloak) {
    element.content.removeAttribute(Directive.Cloak);
  }
});
setDirective(Directive.Link, () => {
  const elementsWithLink = getHTMLElementsWithDirective(Directive.Link);
  if (elementsWithLink.length === 0) {
    return;
  }
  for (const element of elementsWithLink) {
    const route = getRouteFromLink(element);
    if (route == null) {
      continue;
    }
    element.content.addEventListener("click", (event) => {
      event.preventDefault();
      dispatch(InternalEvent.PageChange, route);
    });
  }
});
const getRouteFromLink = ({ content: link, directives: directives2 }) => {
  var _a;
  const route = directives2.get(Directive.Link);
  if (route != null && !isEmpty(route)) {
    return route;
  }
  if (isHTMLAnchorElement(link)) {
    return (_a = link.pathname) != null ? _a : null;
  }
  return null;
};
setDirective(Directive.LinkActive, () => {
  const elementsWithLinkActive = getHTMLElementsWithDirective(Directive.LinkActive);
  if (elementsWithLinkActive.length === 0) {
    return;
  }
  subscribe(InternalEvent.ViewChange, () => {
    const url = getCurrentURL();
    for (const element of elementsWithLinkActive) {
      const route = getRouteFromLink(element);
      if (route == null) {
        continue;
      }
      let className = element.directives.get(Directive.LinkActive);
      if (className == null || isEmpty(className)) {
        className = "active";
      }
      const classNames = className.split(" ");
      if (isMatchingURL(route, url)) {
        appendClassNamesToElement(element, classNames);
      } else {
        removeClassNamesFromElement(element, classNames);
      }
    }
  });
});
setDirective(Directive.Page, () => {
  const elementsWithPage = getHTMLElementsWithDirective(Directive.Page);
  if (elementsWithPage.length === 0) {
    return;
  }
  subscribe(InternalEvent.ViewChange, (mode) => {
    const url = getCurrentURL();
    for (const element of elementsWithPage) {
      const route = element.directives.get(Directive.Page);
      if (route == null || isEmpty(route)) {
        continue;
      }
      const canBeVisible = isMatchingURL(route, url);
      switch (mode) {
        case Mode.Display:
          toggleDisplayElement(element, canBeVisible);
          break;
        case Mode.Template:
          toggleTemplateElement(element, canBeVisible);
          break;
      }
    }
    dispatchToElement(document, ExternalEvent.ViewChanged);
  });
});
setDirective(Directive.Title, () => {
  const elementsWithTitle = getHTMLElementsWithDirective(Directive.Title);
  if (elementsWithTitle.length === 0) {
    return;
  }
  const titleTemplate = document.documentElement.getAttribute(Directive.Title);
  subscribe(InternalEvent.ViewChange, () => {
    const url = getCurrentURL();
    for (const element of elementsWithTitle) {
      const route = element.directives.get(Directive.Page);
      const title = element.directives.get(Directive.Title);
      if (route == null || title == null) {
        continue;
      }
      if (isMatchingURL(route, url)) {
        if (titleTemplate != null) {
          document.title = titleTemplate.replace("{title}", title);
        } else {
          document.title = title;
        }
        break;
      }
    }
  });
});
(() => {
  const canInitialize = document.documentElement.hasAttribute(Directive.Init);
  if (!canInitialize) {
    return console.warn(`Router cannot be initialized. Add '${Directive.Init}' attribute to <html></html> tag.`);
  }
  setUpDirectives([
    Directive.Cloak,
    Directive.Title,
    Directive.Page,
    Directive.Link,
    Directive.LinkActive,
    Directive.Init
  ]);
})();
