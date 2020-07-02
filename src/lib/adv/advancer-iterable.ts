import {Advancer} from '../advancer';
import {Yield} from '../yield';

export class AdvancerIterable<T> extends Advancer<T> {
    source: Iterator<T>;

    constructor(source: Iterable<T>) {
        super();
        this.source = source[Symbol.iterator]();
    }

    next(): IteratorResult<T> {
        return this.source.next();
    }

    traverse(yld: Yield<T>): void {
        for (let current = this.source.next(); !current.done; current = this.source.next()) {
            yld(current.value as T);
        }
    }
}
