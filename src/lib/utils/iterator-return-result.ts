class IteratorReturnResultImpl implements IteratorReturnResult<unknown> {
    readonly done: true;
    readonly value: unknown;

    constructor() {
        this.value = undefined;
        this.done = true;
    }
}

export const DONE = new IteratorReturnResultImpl();
