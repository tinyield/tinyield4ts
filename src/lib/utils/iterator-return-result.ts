class IteratorReturnResultImpl implements IteratorReturnResult<any> {
    readonly done: true;
    readonly value: any;

    constructor() {
        this.value = undefined;
        this.done = true;
    }
}

export const DONE = new IteratorReturnResultImpl();
