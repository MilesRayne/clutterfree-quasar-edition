function GM_addStyle(styles) {
  const style = document.createElement('style');
  style.textContent = styles;
  (
    document.head ||
    document.body ||
    document.documentElement ||
    document
  ).appendChild(style);
}

function GM_xmlhttpRequest(options) {
  const request = new XMLHttpRequest();

  request.onload = function () {
    options.onload(this);
  };

  request.onerror = function () {
    options.onerror(this);
  };

  request.ontimeout = function () {
    options.ontimeout(this);
  };

  request.open(options.method, options.url);

  if (options.headers) {
    for (const header in options.headers) {
      if (options.headers.hasOwnProperty(header)) {
        request.setRequestHeader(header, options.headers[header]);
      }
    }
  }

  if (typeof options.timeout !== 'undefined') {
    request.timeout = options.timeout;
  }

  if (typeof options.data === 'undefined') {
    request.send();
  } else {
    request.send(options.data);
  }
}

/* Extensions cannot access the document's window directly */
function inject(func) {
  const script = document.createElement('script');
  script.appendChild(document.createTextNode(`(${func})();`));
  const target =
    document.head || document.body || document.documentElement || document;
  target.appendChild(script);
  target.removeChild(script); // Removing since once it executes it is no longer needed
}

function applyConsolePrefix() {
  const log = console.log;
  console.log = (...args) => {
    log('[Clutterfree]', ...args);
  };

  console.log('Clutterfree is now active');
}

//redefine console.log to add prefix

async function importCSS(path) {
  const src = chrome.runtime.getURL(path);
  return await fetch(src).then((response) => response.text());
}

function createElement(tag, attrs?, styles?) {
  const element = document.createElement(tag);
  if (attrs) {
    for (const aKey in attrs) {
      if (!Object.prototype.hasOwnProperty.call(attrs, aKey)) continue;
      element.setAttribute(aKey, attrs[aKey]);
    }
  }
  if (styles) {
    for (const sKey in styles) {
      if (!Object.prototype.hasOwnProperty.call(styles, sKey)) continue;
      element.style.setProperty(sKey, styles[sKey]);
      element.style[sKey] = styles[sKey];
    }
  }
  return element;
}
function page(regex, href = false) {
  return regex.test(href ? window.location.href : window.location.pathname);
}

export default {
  applyConsolePrefix,
  GM_addStyle,
  GM_xmlhttpRequest,
  inject,
  importCSS,
  createElement,
  page,
};
