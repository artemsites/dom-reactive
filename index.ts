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

    handlerClassesReactive(wrapper, appInstance);

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
        if (stateTarget["value"] !== valueNew) {
          stateTarget["value"] = valueNew;
          emitter.emit(stateNameHash, stateTarget);
        }
        return true;
      }
      return false;
    },
  });

  stateNamesHashes.set(proxyState, stateNameHash);

  emitter.emit(stateNameHash, proxyState);

  return proxyState;
}

function handlerClassesReactive($wrapper: HTMLElement, appInstance: any) {
  if ($wrapper.dataset.class) {
    handlerClassesReactiveSubFunc1($wrapper);
  }

  const $elementsWithDataClasses = $wrapper.querySelectorAll(
    "[data-class]"
  ) as NodeListOf<HTMLElement>;
  $elementsWithDataClasses.forEach(($el) => {
    handlerClassesReactiveSubFunc1($el);
  });

  function handlerClassesReactiveSubFunc1($el) {
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

        handlerClassesReactiveSubFunc2($el, className, jsNameWithPrefix);
      }
    } else if (isObject(parsedJson)) {
      for (let className in parsedJson) {
        let jsNameWithPrefix = parsedJson[className];

        handlerClassesReactiveSubFunc2($el, className, jsNameWithPrefix);
      }
    }
  }

  function handlerClassesReactiveSubFunc2(
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

    const isNotEqualExpression = jsExpression.includes("!=");
    const isEqualExpression = jsExpression.includes("==");
    if (isNotEqualExpression || isEqualExpression) {
      if (isNotEqualExpression) {
        const regex = /!=/;
        const operator = "!=";
        splitExpressionAndCompareAndUpdateClassesReactive(
          jsExpression,
          regex,
          operator,
          isRevertVal,
          className,
          $el
        );
      } else if (isEqualExpression) {
        const regex = /==/;
        const operator = "==";
        splitExpressionAndCompareAndUpdateClassesReactive(
          jsExpression,
          regex,
          operator,
          isRevertVal,
          className,
          $el
        );
      }
    } else {
      const operator = "==";
      const jsName = jsExpression;
      const jsVal = true;
      compareAndUpdateClassesReactive(
        jsName,
        jsVal,
        operator,
        isRevertVal,
        className,
        $el
      );
    }
  }

  function splitExpressionAndCompareAndUpdateClassesReactive(
    jsExpression: any,
    regex: any,
    operator: any,
    isRevertVal: any,
    className: any,
    $el: any
  ) {
    const res = splitExpression(jsExpression, regex);
    if (res && res.length === 2) {
      const [jsName, jsVal] = res;
      compareAndUpdateClassesReactive(
        jsName,
        jsVal,
        operator,
        isRevertVal,
        className,
        $el
      );
    }
  }

  function compareAndUpdateClassesReactive(
    jsName: any,
    jsVal: any,
    operator: any,
    isRevertVal: any,
    className: any,
    $el: any
  ) {
    const state = appInstance[jsName];
    const isTrue = compare(state.value, jsVal, operator);

    toggleClass(isTrue, className, $el, isRevertVal);
    const stateNameHash = stateNamesHashes.get(state);

    emitter.on(stateNameHash, (newState: any) => {
      const isTrue = compare(newState.value, jsVal, operator);
      toggleClass(isTrue, className, $el, isRevertVal);
    });
  }

  function toggleClass(
    value: any,
    className: string | string[],
    where: HTMLElement,
    isRevertVal = false
  ) {
    try {
      const isTrue = (value && !isRevertVal) || (!value && isRevertVal);
      if (typeof className === "string") {
        if (isTrue) {
          where.classList.add(className);
        } else {
          where.classList.remove(className);
        }
      } else if (Array.isArray(className)) {
        const [classIfTrue, classIfFalse] = className;
        if (isTrue) {
          where.classList.remove(classIfFalse);
          where.classList.add(classIfTrue);
        } else {
          where.classList.remove(classIfTrue);
          where.classList.add(classIfFalse);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

// @note tools:
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

function compare(value1: any, value2: any, operator: string) {
  switch (operator) {
    case "!=":
      return value1 != value2;
    case "==":
      return value1 == value2;
    case "<":
      return value1 < value2;
    case ">":
      return value1 > value2;
    case "<=":
      return value1 <= value2;
    case ">=":
      return value1 >= value2;
    default:
      throw new Error("Invalid operator");
  }
}
