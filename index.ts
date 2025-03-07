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

interface ComponentInstance {
    [key: string]: any;
}

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

export function createScope(
    scopeId: string,
    scope: () => ComponentInstance,
    alias: string = ""
) {
    const $wrapper = document.getElementById(scopeId);

    if ($wrapper) {
        const scopeInstance = scope();

        // @note handle data-click
        handlerClickReactive($wrapper, scopeInstance);

        handlerClassesReactive($wrapper, scopeInstance);

        if (alias !== "") {
            window[alias] = scopeInstance;
        } else {
            window[scopeId] = scopeInstance;
        }
    } else {
        throw Error("Нет wrapper: #" + scopeId);
    }
}

export function createComponent(wrapperClass: string, component: () => {}) {
    const wrappers = document.getElementsByClassName(
        wrapperClass
    ) as HTMLCollection;
    for (let $wrapper of wrappers) {
        if ($wrapper) {
            const componentInstance: ComponentInstance = component();
            if (isObject(componentInstance)) {
                // @note handle data-ref
                const refsInDom = $wrapper.querySelectorAll(
                    `[data-ref]`
                ) as NodeListOf<HTMLElement>;
                refsInDom.forEach(($refEl) => {
                    const refName = $refEl.getAttribute("data-ref");
                    if (refName) {
                        componentInstance[refName].value = $refEl;
                    } else {
                        console.warn("The data-ref name was not found in: ", $refEl);
                    }
                });

                // @note handle data-click
                handlerClickReactive($wrapper as HTMLElement, componentInstance);

                // @note handle data-class
                handlerClassesReactive($wrapper as HTMLElement, componentInstance);
            }
        } else {
            throw Error("Нет wrapper: ." + wrapperClass);
        }
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

function handlerClickReactive($wrapper: HTMLElement, instance: ComponentInstance) {
    const elClicks = $wrapper.querySelectorAll(
        `[data-click]`
    ) as NodeListOf<HTMLElement>;
    elClicks.forEach(($elOnClick) => {
        $elOnClick.addEventListener("click", function (e) {
            let methodNameOnClick = $elOnClick.dataset.click;
            if (methodNameOnClick) {
                // ! Это для убирания префикса например header. - оно пока не мешает в случае если его нет вообще
                const methodNameOnClickWithoutPrefix = deleteWordPrefix(methodNameOnClick)

                const methodOnClick = instance[methodNameOnClickWithoutPrefix];
                methodOnClick();
            } else {
                console.warn(
                    "The name of the data-click method was not found in: ",
                    $elOnClick
                );
            }
        });
    });
}

function handlerClassesReactive($wrapper: HTMLElement, appInstance: ComponentInstance) {
    if ($wrapper.dataset && $wrapper.dataset.class) {
        handlerClassesReactiveSubFunc1($wrapper);
    }

    const $elementsWithDataClasses = $wrapper.querySelectorAll(
        "[data-class]"
    ) as NodeListOf<HTMLElement>;
    $elementsWithDataClasses.forEach(($el) => {
        handlerClassesReactiveSubFunc1($el);
    });

    function handlerClassesReactiveSubFunc1($el: HTMLElement) {
        let jsonString = $el.dataset.class;
        if (jsonString) {
            $el.removeAttribute("data-class");

            let parsedJson;
            try {
                parsedJson = JSON.parse(jsonString);
            } catch (error) {
                console.error("Error at JSON string: " + jsonString);
                console.error(error);
            }

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
        } else {
            console.warn("The data-class JSON string was not found in: ", $el);
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
