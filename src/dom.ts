/**
 * @source https://github.com/artemsites/dom
 * @source https://gitverse.ru/artemsites/dom
 *
 * @api:
 * createScope - creating an object in the DOM for working with the library
 * ref - reactive state
 * data-class is an attribute of an HTML element for dynamic class management
 */

// @note for browser js module
// import mitt from "../node_modules/mitt/dist/mitt.mjs";

// @note for vite compile
import mitt from "mitt";

interface State {
  value: boolean;
}

declare global {
  interface Window {
    [key: string]: any;
  }
}

const emitter = mitt();

let stateNamesHashes = new Map();

export function createScope(scopeId: string, scopeApp: () => void) {
  const wrapper = document.getElementById(scopeId);

  if (wrapper) {
    const appInstance = scopeApp();

    handlerClasses(wrapper, appInstance);

    window[scopeId] = appInstance;
  } else {
    throw Error("Нет wrapper: #" + scopeId);
  }
}

export function ref(defaultValue: any) {
  const stateNameHash = `state_${crypto.randomUUID()}`;

  const proxyState = new Proxy(
    { value: defaultValue },
    {
      set(target, prop, value) {
        if (prop === "value") {
          target[prop] = value;
          emitter.emit(stateNameHash, target);
          return true;
        }
        return false;
      },
    }
  );

  stateNamesHashes.set(proxyState, stateNameHash);

  emitter.emit(stateNameHash, proxyState);

  return proxyState;
}

function handlerClasses(wrapper: HTMLElement, appInstance: any) {
  const $classes = wrapper.querySelectorAll(
    "[data-class]"
  ) as NodeListOf<HTMLElement>;

  $classes.forEach(($el) => {
    if ($el.dataset.class) {
      let jsonString = $el.dataset.class;

      $el.removeAttribute("data-class");

      const parsedJson = JSON.parse(jsonString);
      if (Array.isArray(parsedJson)) {
        for (let i in parsedJson) {
          let jsExpressionTernary = parsedJson[i];

          const regex = /(.+?)\s*\?\s*(.+?)\s*:\s*(.+)/;
          const match = jsExpressionTernary.match(regex);

          let jsNameWithPrefix = match[1];
          const classNameTrue = match[2];
          const classNameFalse = match[3];
          const className = [classNameTrue, classNameFalse];

          handlerClassesInner($el, className, jsNameWithPrefix);
        }
      } else if (isObject(parsedJson)) {
        for (let className in parsedJson) {
          let jsNameWithPrefix = parsedJson[className];

          handlerClassesInner($el, className, jsNameWithPrefix);
        }
      }
    }
  });

  function handlerClassesInner(
    $el: HTMLElement,
    className: string | string[],
    jsNameWithPrefix: string
  ) {
    let isRevertVal = false;
    if (jsNameWithPrefix[0] === "!") {
      isRevertVal = true;
      jsNameWithPrefix = jsNameWithPrefix.slice(1);
    }

    let jsName = jsNameWithPrefix.replace(/^\w+\./, "");

    const state = appInstance[jsName];

    toggleClass(state, className, $el, isRevertVal);
    let stateNameHash = stateNamesHashes.get(state);

    emitter.on(stateNameHash, (newState) => {
      toggleClass(newState as State, className, $el, isRevertVal);
    });
  }
}

function toggleClass(
  state: State,
  className: string | string[],
  where: HTMLElement,
  isRevertVal = false
) {
  if (state.value && !isRevertVal) {
    if (Array.isArray(className)) {
      where.classList.remove(className[1]);
      where.classList.add(className[0]);
    } else {
      where.classList.add(className);
    }
  } else {
    if (Array.isArray(className)) {
      where.classList.remove(className[0]);
      where.classList.add(className[1]);
    } else {
      where.classList.remove(className);
    }
  }
}

function isObject(value: any) {
  return value !== null && typeof value === "object";
}
