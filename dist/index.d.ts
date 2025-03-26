export declare const emitter: import('mitt').Emitter<Record<import('mitt').EventType, unknown>>;
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
export declare function createScope(scopeId: string, scope: (e: any) => ComponentInstance, alias?: string): void;
export declare function createComponent(wrapperClass: string, component: (e: any) => {}): void;
export declare function ref(defaultValue: any): State;
export {};
