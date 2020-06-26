import {Advancer} from '../advancer';
import {Yield} from '../yield';
import {IteratorYieldImpl} from '../utils/iterator-yield';

export class AdvancerIterator<T> extends Advancer<T> {
    private readonly operation: (elem: T) => T;
    private previous: T;

    constructor(seed: T, operation: (elem: T) => T) {
        super();
        this.operation = operation;
        this.previous = seed;
    }

    next(): IteratorResult<T, any> {
        const current = this.previous;
        this.previous = this.operation(current);
        return new IteratorYieldImpl(current);
    }

    traverse(yld: Yield<T>): void {
        for (let current = this.previous; true; current = this.operation(current)) {
            yld(current);
        }
    }
}