$ = function (param, base) {
  if (typeof param === "string" || param instanceof String) {
    base = base ? base : document;
    return new UtilitiesCollection(...base.querySelectorAll(param));
  } else {
    return new UtilitiesCollection(param);
  }
};

$.ajax = function (
  { url, data = {}, method = "get" },
  success = () => {},
  dataType
) {
  var queryString = Object.entries(data)
    .map(([key, value]) => {
      return `${key}=${value}`;
    })
    .join("&");

  return new AjaxPromises(
    fetch(`${url}?${queryString}`, {
      headers: {
        "Content-Type": dataType,
      },
      method: method.toUpperCase(),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.status);
        }
      })
      .then((data) => {
        success(data);
        return data;
      })
  );
};

class UtilitiesCollection extends Array {
  ready(callback, callOnResize, resizeThrottle) {
    const isReady = this.some((e) => {
      return e.readyState != null && e.readyState != "loading";
    });
    if (isReady) {
      callback();
    } else {
      this.on("DOMContentLoaded", callback);
    }
    if (callOnResize) {
      $(window).resize(callback, resizeThrottle);
    }
    return this;
  }

  resize(callback, throttle) {
    if (this[0] == window && this.length == 1) {
      let x, y, timeout;
      const set = () => {
        x = window.innerWidth;
        y = window.outerHeight;
        timeout = null;
        clearTimeout(timeout);
      };
      set();
      this.on("resize", function () {
        if ((x != window.innerWidth || y != window.outerHeight) && !timeout) {
          timeout = setTimeout(
            function () {
              set();
              callback();
            },
            throttle ? throttle : 200
          );
        }
      });
    } else {
      console.log("Resize can only be called on window");
    }
    return this;
  }

  on(event, callbackOrSelector, callback) {
    if (typeof callbackOrSelector === "function") {
      this.forEach((e) => e.addEventListener(event, callbackOrSelector));
    } else {
      this.forEach((e) => {
        e.addEventListener(event, (t) => {
          if (t.target.matches(callbackOrSelector)) callback(t);
        });
      });
    }
    return this;
  }

  each(callback) {
    this.forEach(function (e, i) {
      callback(e, i);
    });
    return this;
  }

  find(selector) {
    return $(selector, this[0]);
  }

  parent(find) {
    if (find) {
      return $(this[0].parentNode, this[0]).find(find);
    } else {
      return $(this[0].parentNode, this[0]);
    }
  }

  first() {
    return this.map((e) => e[0]).filter((e) => e != null);
  }

  last() {
    return this.map((e) => e[e.length - 1]).filter((e) => e != null);
  }

  next() {
    return this.map((e) => e.nextElementSibling).filter((e) => e != null);
  }

  prev() {
    return this.map((e) => e.previousElementSibling).filter((e) => e != null);
  }

  attr(property, value) {
    if (value) {
      this.forEach((e) => {
        e.setAttribute(property, value);
      });
      return this;
    } else {
      return this[0].getAttribute(property);
    }
  }
  removeAttr(property) {
    this.forEach((e) => {
      e.removeAttribute(property);
    });
    return this;
  }
  data(property, value) {
    if (value) {
      this.forEach((e) => {
        e.dataset[property] = value;
      });
      return this;
    } else {
      return this[0].dataset[property];
    }
  }
  removeData(property) {
    this.forEach((e) => {
      delete this.dataset[property];
    });
    return this;
  }

  css(property, value) {
    if (__isObject(property)) {
      this.forEach((e) => {
        for (const [key, value] of Object.entries(property)) {
          e.style[__toCamel(key)] = value;
        }
      });
    } else if (__isString(property)) {
      this.forEach((e) => {
        e.style[__toCamel(property)] = value;
      });
    }
    return this;
  }

  addClass(className) {
    const classNames = className.split(" ");
    this.forEach((e) => {
      classNames.forEach(function (c) {
        e.classList.add(c);
      });
    });
  }

  hasClass(className) {
    return this[0].classList.contains(className);
  }

  removeClass(className) {
    const classNames = className.split(" ");
    this.forEach((e) => {
      classNames.forEach(function (c) {
        e.classList.remove(c);
      });
    });
  }

  toggleClass(className) {
    const classNames = className.split(" ");
    this.forEach((e) => {
      classNames.forEach(function (c) {
        e.classList.toggle(c);
      });
    });
  }

  elem() {
    return this[0];
  }
  height(offset) {
    return offset ? this[0].offsetHeight : this[0].clientHeight;
  }
  width(offset) {
    return offset ? this[0].offsetWidth : this[0].clientWidth;
  }
  offset() {
    const position = this[0].getBoundingClientRect(),
      scrollX = window.scrollX,
      scrollY = window.scrollY;
    return {
      bottom: position.bottom + scrollY,
      left: position.left + scrollX,
      right: position.right + scrollX,
      top: position.top + scrollY,
    };
  }
  position() {
    const el = this[0];
    return {
      bottom: el.offsetTop + el.scrollHeight,
      left: el.offsetLeft,
      right: el.offsetLeft + el.scrollWidth,
      top: el.offsetTop,
    };
  }
}

class AjaxPromises {
  constructor(promise) {
    this.promise = promise;
  }
  done(callback) {
    this.promise = this.promise.then((data) => {
      callback(data);
      return data;
    });
    return this;
  }
  fail(callback) {
    this.promise = this.promise.catch(callback);
    return this;
  }
  always(callback) {
    this.promise = this.promise.finally(callback);
    return this;
  }
}

function __$(e) {
  return {
    element: () => e instanceof Element || e instanceof HTMLDocument,

    object: () => typeof e === "object" || e instanceof Object,

    string: () => typeof e === "string" || e instanceof String,

    toCamel: () =>
      e.replace(/(-[a-z])/, (group) => {
        return group.replace("-", "").toUpperCase();
      }),
  };
}

function __isElement(e) {
  return e instanceof Element || e instanceof HTMLDocument;
}
function __isObject(e) {
  return typeof e === "object" || e instanceof Object;
}
function __isString(e) {
  return typeof e === "string" || e instanceof String;
}
function __toCamel(e) {
  if (__isString(e)) {
    const camelProp = e.replace(/(-[a-z])/, (group) => {
      return group.replace("-", "").toUpperCase();
    });
    return camelProp;
  }
}
