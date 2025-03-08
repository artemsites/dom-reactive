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
export declare function createScope(scopeId: string, scope: () => ComponentInstance, alias?: string): void;
export declare function createComponent(wrapperClass: string, component: () => {}): void;
export declare function ref(defaultValue: any): State;
export {};
