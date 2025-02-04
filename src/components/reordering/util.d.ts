export interface ReorderableListReorderEvent {
    /**
     * Index of the dragged item.
     */
    from: number;
    /**
     * Index where the dragged item was released.
     */
    to: number;
}

export declare const reorderItems: <T>(
    data: T[],
    from: number,
    to: number,
) => T[];

declare const useActivateDrag: (a: boolean) => () => void;
export default useActivateDrag;
