/**
 * useDom.js
 */
// import mitt from "mitt";
import mitt from "./node_modules/mitt/dist/mitt.mjs";
const emitter = mitt();

let stateNamesHashes = new Map();

export function useDom(app, id) {
  const wrapper = document.getElementById(id);

  if (wrapper) {
    const appInstance = app();

    handlerClasses(wrapper, appInstance);

    window[id] = appInstance;
  } else {
    throw Error("Нет wrapper: #" + id);
  }
}

export function useState(defaultVal) {
  let state = { val: defaultVal };

  let stateNameHash = `state_${crypto.randomUUID()}`;
  stateNamesHashes.set(state, stateNameHash);
  emitter.emit(stateNameHash, state);

  function setState(newVal) {
    state.val = newVal;
    emitter.emit(stateNameHash, state);
  }

  return [state, setState];
}

function handlerClasses(wrapper, appInstance) {
  const $classes = wrapper.querySelectorAll("[data-class]");

  $classes.forEach(($el) => {
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
  });

  function handlerClassesInner($el, className, jsNameWithPrefix) {
    let isRevertVal = false;
    if (jsNameWithPrefix[0] === "!") {
      isRevertVal = true;
      jsNameWithPrefix = jsNameWithPrefix.slice(1);
    }

    let jsName = jsNameWithPrefix.replace(/^\w+\./, "");

    const state = appInstance[jsName];

    toggleClass(state, className, $el, isRevertVal);

    let stateNameHash = stateNamesHashes.get(appInstance[jsName]);

    emitter.on(stateNameHash, (newState) => {
      toggleClass(newState, className, $el, isRevertVal);
    });
  }
}

function toggleClass(state, className, where, isRevertVal = false) {
  let valLoc = state.val;

  if (isRevertVal) valLoc = !valLoc;

  if (valLoc) {
    if (Array.isArray(className)) {
      where.classList.add(className[0]);
      where.classList.remove(className[1]);
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

function isObject(value) {
  return value !== null && typeof value === "object";
}
