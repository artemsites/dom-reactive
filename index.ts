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

export const emitter = mitt();

type Wrapper = any;

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

let stateNamesHashes = new Map();

let createUUID = ()=>{}
if (window && typeof window.crypto.randomUUID === 'function') {
    createUUID = window.crypto.randomUUID.bind(window.crypto)
} else {
    createUUID = generateUniqueId
}

export function createScope(
    scopeId: string,
    scope: (e) => ComponentInstance,
    alias: string = ""
) {
    const $wrapper = document.getElementById(scopeId);

    if ($wrapper) {
        const scopeInstance = scope($wrapper);

        // @note handle data-ref
        handlerRefsInDom($wrapper as Wrapper, scopeInstance);

        // @note handle data-click
        handlerClickReactive($wrapper, scopeInstance);

        // @note handle data-class
        handlerClassesReactive($wrapper, scopeInstance);

        // @note handle input[data-value]
        handlerInputDataValueReactive($wrapper, scopeInstance);

        // @note handle data-change
        handlerChangeReactive($wrapper, scopeInstance);

        // @note handle data-input
        handlerInputReactive($wrapper, scopeInstance);

        if (alias !== "") {
            window[alias] = scopeInstance;
        } else {
            window[scopeId] = scopeInstance;
        }
    } else {
        console.warn("Not found wrapper: #" + scopeId);
    }
}

export function createComponent(wrapperClass: string, component: (e) => {}) {
    const wrappers = document.getElementsByClassName(
        wrapperClass
    ) as HTMLCollection;
    for (let $wrapper of wrappers) {
        if ($wrapper) {
            const componentInstance: ComponentInstance = component($wrapper);
            if (isObject(componentInstance)) {
                // @note handle data-ref
                handlerRefsInDom($wrapper as Wrapper, componentInstance);

                // @note handle data-click
                handlerClickReactive($wrapper as Wrapper, componentInstance);

                // @note handle data-class
                handlerClassesReactive($wrapper as Wrapper, componentInstance);

                // @note handle input[data-value]
                // ! @todo not tested!!!
                handlerInputDataValueReactive(
                    $wrapper as Wrapper,
                    componentInstance
                );

                // @note handle data-change
                handlerChangeReactive($wrapper as Wrapper, componentInstance);

                // @note handle data-input
                handlerInputReactive($wrapper, componentInstance);
            }
        } else {
            console.warn("Not found wrapper: ." + wrapperClass);
        }
    }
}

export function ref(defaultValue: any): State {
    const stateNameHash = `state_${createUUID()}`;
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

function handlerRefsInDom($wrapper: Wrapper, instance: ComponentInstance) {
    const refsInDomAll = findAllByAttr("data-ref", $wrapper);

    refsInDomAll.forEach(($refEl) => {
        const refName = $refEl.getAttribute("data-ref");
        if (refName && instance[refName]) {
            instance[refName].value = $refEl;
        } else {
            console.warn("The data-ref name was not found in: ", $refEl);
        }
    });
}

function handlerInputDataValueReactive(
    $wrapper: Wrapper,
    instance: ComponentInstance
) {
    const dataValues = findAllByAttr("data-value", $wrapper);

    dataValues.forEach(($dataValue) => {
        if ($dataValue instanceof HTMLInputElement) {
            const dataValue: string | null = $dataValue.getAttribute('data-value') || null;

            if (dataValue) {
                const jsExpressionWithPrefix: string = dataValue;
                let jsExpression = deleteWordPrefix(jsExpressionWithPrefix);
                const state = instance[jsExpression];
                if (state) {
                    $dataValue.value = state.value;
                    const stateNameHash = stateNamesHashes.get(state);
                    emitter.on(stateNameHash, (newState: any) => {
                        $dataValue.value = newState.value;
                    });
                }
            }
        }
    });
}

function handlerClickReactive($wrapper: Wrapper, instance: ComponentInstance) {
    const elClicks = findAllByAttr("data-click", $wrapper);

    if (elClicks.length) {
        elClicks.forEach(($elOnClick) => {
            let methodNameOnClick = $elOnClick.getAttribute('data-click');

            if (methodNameOnClick) {
                // ! Это для убирания префикса например header. - оно пока не мешает в случае если его нет вообще
                const methodNameOnClickWithoutPrefix =
                    deleteWordPrefix(methodNameOnClick);

                const methodOnClick = instance[methodNameOnClickWithoutPrefix];
                if (methodOnClick) {
                    $elOnClick.addEventListener("click", function (e) {
                        methodOnClick(e);
                    });
                }
            } else {
                console.warn(
                    "The name of the data-click method was not found in: ",
                    $elOnClick
                );
            }
        });
    }
}

function handlerChangeReactive($wrapper: Wrapper, instance: ComponentInstance) {
    const elChanges = findAllByAttr("data-change", $wrapper);

    if (elChanges.length) {
        elChanges.forEach(($elOnchange) => {
            if ($elOnchange) {
                let methodNameOnChange = $elOnchange.getAttribute('data-change');
                if (methodNameOnChange) {
                    // ! Это для убирания префикса например header. - оно пока не мешает в случае если его нет вообще
                    const methodNameOnChangeWithoutPrefix =
                        deleteWordPrefix(methodNameOnChange);
                    const methodOnChange =
                        instance[methodNameOnChangeWithoutPrefix];
                    if (methodOnChange) {
                        $elOnchange.addEventListener("change", function (e) {
                            methodOnChange(e);
                        });
                    }
                }
            } else {
                console.warn(
                    "The name of the data-click method was not found in: ",
                    $elOnchange
                );
            }
        });
    }
}

function handlerInputReactive($wrapper: Wrapper, instance: ComponentInstance) {
    const elInputs = findAllByAttr("data-input", $wrapper);
    if (elInputs.length) {
        elInputs.forEach(($elOnInput) => {
            if ($elOnInput) {
                let methodNameOnInput = $elOnInput.getAttribute('data-input');
                if (methodNameOnInput) {
                    // ! Это для убирания префикса например header. - оно пока не мешает в случае если его нет вообще
                    const methodNameOnInputWithoutPrefix =
                        deleteWordPrefix(methodNameOnInput);
                    const methodOnInput =
                        instance[methodNameOnInputWithoutPrefix];
                    if (methodOnInput) {
                        $elOnInput.addEventListener("input", function (e) {
                            methodOnInput(e);
                        });
                    }
                }
            } else {
                console.warn(
                    "The name of the data-click method was not found in: ",
                    $elOnInput
                );
            }
        });
    }
}

function handlerClassesReactive(
    $wrapper: Wrapper,
    instance: ComponentInstance
) {
    const elClasses = findAllByAttr("data-class", $wrapper);

    elClasses.forEach(($el) => {
        handlerClassesReactiveSubFunc1($el);
    });

    function handlerClassesReactiveSubFunc1($el: HTMLElement) {
        let jsonString = $el.getAttribute('data-class');
        if (jsonString) {
            // @todo deletion is necessary in another place so that one component does not delete the data-class of another component.
            // $el.removeAttribute("data-class");

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

                    handlerClassesReactiveSubFunc2(
                        $el,
                        className,
                        jsNameWithPrefix
                    );
                }
            } else if (isObject(parsedJson)) {
                for (let className in parsedJson) {
                    let jsNameWithPrefix = parsedJson[className];

                    handlerClassesReactiveSubFunc2(
                        $el,
                        className,
                        jsNameWithPrefix
                    );
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
        const state = instance[jsName];
        if (!state) {
            showWarnIfRefNotFound($wrapper, jsName);
        } else {
            const isTrue = compare(state.value, jsVal, operator);

            toggleClass(isTrue, className, $el, isRevertVal);
            const stateNameHash = stateNamesHashes.get(state);

            emitter.on(stateNameHash, (newState: any) => {
                const isTrue = compare(newState.value, jsVal, operator);
                toggleClass(isTrue, className, $el, isRevertVal);
            });
        }
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

function showWarnIfRefNotFound($wrapper: Wrapper, jsName: string) {
    const instanceId =
        "#" + $wrapper.getAttribute("id") ||
        "." + $wrapper.getAttribute("class");
    console.warn(
        `Ref ${jsName} is not exists at ${instanceId}. Perhaps the component is located in another component.`
    );
}

// ! tools:
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

function findAllByAttr(attr: string, $wrapper: HTMLElement) {
    const els = $wrapper.querySelectorAll(`[${attr}]`) as NodeListOf<
        HTMLElement | HTMLInputElement
    >;

    const elsAll = [...Array.from(els)];

    if ($wrapper.dataset && $wrapper.getAttribute(attr)) {
        elsAll.push($wrapper);
    }

    return elsAll;
}

function generateUniqueId() {
    // 4 - версия UUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8); // Установка варианта UUID
        return v.toString(16);
    });
}
