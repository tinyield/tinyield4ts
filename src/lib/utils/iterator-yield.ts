export class IteratorYieldImpl<T> implements IteratorYieldResult<T> {
    done: false;
    value: T;

    constructor(value: T) {
        this.value = value;
        this.done = false;
    }
}
