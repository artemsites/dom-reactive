declare global {
    interface Window {
        [key: string]: any;
    }
}
export declare function useDom(app: () => void, htmlId: string): void;
export declare function ref(defaultValue: any): {
    value: any;
};
