interface State {
    value: any;
}
declare global {
    interface Window {
        [key: string]: any;
    }
}
export declare function createScope(scopeId: string, scope: () => void, alias?: string): void;
export declare function createComponent(wrapperClass: string, component: () => {}): void;
export declare function ref(defaultValue: any): State;
export {};
