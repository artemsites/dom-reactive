/**
 * @source https://github.com/artemsites/dom
 * @source https://gitverse.ru/artemsites/dom
 *
 * @api:
 * createScope - creating an object in the DOM for working with the library
 * ref - reactive state
 * data-class is an attribute of an HTML element for dynamic class management
 */
declare global {
    interface Window {
        [key: string]: any;
    }
}
export declare function createScope(scopeId: string, scopeApp: () => void): void;
export declare function ref(defaultValue: any): {
    value: any;
};
