declare global {
    interface Window {
        [key: string]: any;
    }
}
export declare function createScope(scopeId: string, scopeApp: () => void): void;
export declare function ref(defaultValue: any): {
    value: any;
};
