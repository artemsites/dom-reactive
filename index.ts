/**
 * @source https://github.com/artemsites/dom
 * @source https://gitverse.ru/artemsites/dom
 *
 * @api:
 * createScope - creating an object in the DOM for working with the library
 * ref - reactive state
 * data-class is an attribute of an HTML element for dynamic class management
 */
import mitt from "mitt";

interface State {
  value: any;
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

export function ref(defaultValue: any): State {
  const stateNameHash = `state_${crypto.randomUUID()}`;
  let state: State = { value: defaultValue };

  const proxyState = new Proxy<State>(state, {
    set(stateTarget, prop, valueNew) {
      if (prop === "value") {
        // {value: false}
        stateTarget["value"] = valueNew;
        emitter.emit(stateNameHash, stateTarget);
        return true;
      }
      return false;
    },
  });

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

    let jsExpression = deleteWordPrefix(jsNameWithPrefix);

    if (jsExpression.includes("==")) {
      let res = splitExpression(jsExpression, /==/);
      if (res && res.length === 2) {
        const [jsName, jsVal] = res;

        let state = appInstance[jsName];
        let isTrue = state.value == jsVal;
        toggleClass(isTrue, className, $el, isRevertVal);
        let stateNameHash = stateNamesHashes.get(state);

        emitter.on(stateNameHash, (newState: any) => {
          if (newState) {
            let isTrue = newState.value == jsVal;
            toggleClass(isTrue, className, $el, isRevertVal);
          }
        });
      }
    } else if (jsExpression.includes("!=")) {
      let res = splitExpression(jsExpression, /!=/);
      if (res && res.length === 2) {
        const [jsName, jsVal] = res;

        let state = appInstance[jsName];
        let isTrue = state.value != jsVal;
        toggleClass(isTrue, className, $el, isRevertVal);
        let stateNameHash = stateNamesHashes.get(state);

        emitter.on(stateNameHash, (newState: any) => {
          let isTrue = newState.value != jsVal;
          toggleClass(isTrue, className, $el, isRevertVal);
        });
      }
    } else {
      let state = appInstance[jsExpression];

      toggleClass(state.value, className, $el, isRevertVal);
      let stateNameHash = stateNamesHashes.get(state);

      emitter.on(stateNameHash, (newState: any) => {
        toggleClass(newState.value, className, $el, isRevertVal);
      });
    }
  }
}

function toggleClass(
  value: any,
  className: string | string[],
  where: HTMLElement,
  isRevertVal = false
) {
  try {
    if (value && !isRevertVal) {
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
  } catch (error) {
    console.error(error);
  }
}

function isObject(value: any) {
  return value !== null && typeof value === "object";
}

function deleteWordPrefix(strWithprefixWithDot: string) {
  return strWithprefixWithDot.replace(/^\w+\./, "");
}

function splitExpression(
  expression: string,
  regex: RegExp
): [string, string] | null {
  const parts = expression.split(regex);

  if (parts.length === 2) {
    return [parts[0].trim(), parts[1].trim()];
  }

  return null;
}
