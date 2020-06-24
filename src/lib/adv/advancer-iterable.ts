import {Advancer} from '../advancer';
import {Yield} from '../yield';

export class AdvancerIterable<T> extends Advancer<T> {
    source: Iterator<T>;

    constructor(source: Iterable<T>) {
        super();
        this.source = source[Symbol.iterator]();
    }

    next(): IteratorResult<T, any> {
        return this.source.next();
    }

    traverse(yld: Yield<T>): void {
        let current: IteratorResult<T>;
        while (!(current = this.next()).done) {
            yld(current.value as T);
        }
    }
}
