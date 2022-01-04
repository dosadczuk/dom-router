var Directive;
(function(Directive2) {
  Directive2["Init"] = "data-router";
  Directive2["Cloak"] = "data-router-cloak";
  Directive2["Title"] = "data-router-title";
  Directive2["Link"] = "data-router-link";
  Directive2["Page"] = "data-router-page";
})(Directive || (Directive = {}));
const directives = new Map();
const setDirective = (name, factory) => {
  directives.set(name, factory);
};
const runDirective = (name) => {
  const directiveFactory = directives.get(name);
  if (directiveFactory == null) {
    return;
  }
  directiveFactory();
};
const isDirective = (name) => {
  return getDirectives().includes(name);
};
const getDirectives = () => {
  return Array.from(directives.keys());
};
var Event;
(function(Event2) {
  Event2["Initialize"] = "router:initialize";
  Event2["Initialized"] = "router:initialized";
  Event2["PageChange"] = "router:page-change";
  Event2["PageChanged"] = "router:page-changed";
  Event2["ViewChanged"] = "router:view-changed";
})(Event || (Event = {}));
const subscribe = (element, event, handler) => {
  element.addEventListener(event, handler);
  return () => {
    element.removeEventListener(event, handler);
  };
};
const dispatch = (element, event, data) => {
  element.dispatchEvent(new CustomEvent(event, {
    detail: data,
    bubbles: true,
    composed: true,
    cancelable: true
  }));
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
setDirective(Directive.Init, () => {
  dispatch(document, Event.Initialize);
  subscribe(document, Event.PageChange, (event) => {
    const { detail: route } = event;
    if (isMatchingURL(route, getCurrentURL())) {
      return;
    }
    history.pushState(null, "", route);
    dispatch(document, Event.ViewChange);
  });
  subscribe(window, "popstate", () => {
    dispatch(document, Event.ViewChange);
  });
  dispatch(document, Event.ViewChange);
  dispatch(document, Event.Initialized);
});
const isEmpty = (value) => {
  if (isString(value)) {
    return value.length == 0;
  }
  return value == null;
};
const isString = (value) => {
  return typeof value === "string";
};
const isHTMLTemplateElement = (element) => {
  return element instanceof HTMLTemplateElement;
};
const isHTMLAnchorElement = (element) => {
  return element instanceof HTMLAnchorElement;
};
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
const showHTMLElement = (element) => {
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
const hideHTMLElement = (element) => {
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
  const links = getHTMLElementsWithDirective(Directive.Link);
  if (links.length === 0) {
    return;
  }
  links.forEach(({ content: link, directives: directives2 }) => {
    let route = directives2.get(Directive.Link);
    if (isEmpty(route) && isHTMLAnchorElement(link)) {
      route = link.href;
    }
    if (route == null) {
      return;
    }
    link.addEventListener("click", (event) => {
      event.preventDefault();
      dispatch(document, Event.PageChange, route);
    });
  });
});
setDirective(Directive.Page, () => {
  const pages = getHTMLElementsWithDirective(Directive.Page);
  if (pages.length === 0) {
    return;
  }
  subscribe(document, Event.ViewChange, () => {
    const url = getCurrentURL();
    for (const page of pages) {
      const route = page.directives.get(Directive.Page);
      if (route == null) {
        continue;
      }
      if (isMatchingURL(route, url)) {
        showHTMLElement(page);
      } else {
        hideHTMLElement(page);
      }
    }
    dispatch(document, Event.ViewChanged);
  });
});
setDirective(Directive.Title, () => {
  const elementsWithTitle = getHTMLElementsWithDirective(Directive.Title);
  if (elementsWithTitle.length === 0) {
    return;
  }
  const titleTemplate = document.documentElement.getAttribute(Directive.Title);
  subscribe(document, Event.ViewChange, () => {
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
  runDirective(Directive.Cloak);
  runDirective(Directive.Title);
  runDirective(Directive.Page);
  runDirective(Directive.Link);
  runDirective(Directive.Init);
})();
