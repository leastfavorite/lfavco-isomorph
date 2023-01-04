// libfavorite! v0.2
// because i'm AFAB-brained (All Frameworks Are Bad)

// convenience functions
const onLoad = (fn) => addEventListener("DOMContentLoaded", fn);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const isComputer = () => window.matchMedia("(min-width: 768px)");


// shitty jquery
// i havent rly refined what i WANT here. and honestly i wish it could be
// nicer than just a bunch of prototypes like this but w/e
const $ = (...args) => document.querySelector(...args);
const $new = (type, ...cls) => {
  const newElem = document.createElement(type);
  newElem.classList.add(...cls);
  return newElem;
}
const $div = (...cls) => { return $new("div", ...cls); }
const $each = (item, fn) => { document.querySelectorAll(item).forEach(fn); };
Element.prototype.$           = function (...args) { return this.querySelector(...args); }
Element.prototype.$all        = function (...args) { return Array.from(this.querySelectorAll(...args)); }
Element.prototype.addClass    = function(...cls)   { this.classList.add(...cls); return this; }
Element.prototype.removeClass = function(...cls)   { this.classList.remove(...cls); return this; }
Element.prototype.html        = function(html)     { this.innerHTML = html; return this; }
Element.prototype.pushFront   = function(...child) { this.prepend(...child); return this; }
Element.prototype.push        = function(...child) { this.append(...child); return this; }
Element.prototype.has         = function(cls)      { return this.classList.contains(cls); }
Element.prototype.untilEvent  = function (eventName, predicate = (() => true)) {
  return new Promise(resolve => {
    let listener = (e) => {
      if (predicate(e)) {
        this.removeEventListener(eventName, listener);
        resolve(e);
      }
    };
    this.addEventListener(eventName, listener);
  });
}

// promise-based state management.
//   S.sub("propName", async () => { do something with S.propName here }
//   await S.pub("propName", "value"); // resolves once all subscribers resolve
const S = new Proxy(
  {
    _listeners: [],
    _state: {},

    sub(props, callback) {
      this.listeners.push({
        props: [].concat(props),
        callback: callback
      });
    },

    unsub(callback) {
      this._listeners = this._listeners.filter(l => l.callback !== callback);
    },

    async pub(prop, value) {
      if (prop in this) {
        console.error(`Reserved property name: ${prop}`);
        return;
      }
      this._state[prop] = value;
      const responses = await Promise.all(
        this._listeners.filter(l => l.props.includes(prop)).map(l => l.callback())
      );
      return (responses.length > 0) ?
        Object.assign(...(responses.map(o => o ?? {}))) : null;
    }
  },
  {
    get (target, prop) {
      if (prop in target) {
        return Reflect.get(target, prop);
      }
      if (prop in target._state) {
        return target._state[prop];
      }
      return undefined;
    },
    set (target, prop, value) {
      throw new TypeError("can't assign state props directly");
    }
  }
);

// sessionstorage proxy to store arbitrary objects
const session = new Proxy(localStorage, {
  get (target, prop) {
    if (prop in target) {
      return JSON.parse(target[prop]);
    } else {
      return null;
    }
  },
  set (target, prop, value) {
    target[prop] = JSON.stringify(value);
  }
});

// localstorage proxy to store arbitrary objects
const local = new Proxy(localStorage, {
  get (target, prop) {
    const item = target.getItem(prop);
    if (item === null) return null;
    return JSON.parse(item);
  },
  set (target, prop, value) {
    target.setItem(prop, JSON.stringify(value));
    return true;
  }
});

