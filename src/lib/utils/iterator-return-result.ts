export class IteratorReturnResultImpl<T> implements IteratorReturnResult<T> {
    done: true;
    value: T;

    constructor(value: T) {
        this.value = value;
        this.done = true;
    }
}
