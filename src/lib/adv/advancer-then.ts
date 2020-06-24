import {Advancer} from '../advancer';
import {Traverser} from '../traverser';
import {Sequence} from '../sequence';
import {Yield} from '../yield';

export class AdvancerThen<T, R> implements Advancer<R> {
    private readonly upstream: Sequence<T>;
    private readonly then: (source: Sequence<T>) => Traverser<R>;
    private iterator: Iterator<R>;
    private inMem = false;

    constructor(upstream: Sequence<T>, next: (source: Sequence<T>) => Traverser<R>) {
        this.upstream = upstream;
        this.then = next;
    }

    getIterator(): Iterator<R> {
        if (this.inMem) {
            return this.iterator;
        }
        const mem: R[] = [];
        this.then(this.upstream)(elem => mem.push(elem));
        this.inMem = true;
        this.iterator = mem[Symbol.iterator]();
        return this.iterator;
    }

    next(): IteratorResult<R, any> {
        return this.getIterator().next();
    }

    traverse(yld: Yield<R>): void {
        this.then(this.upstream)(elem => yld(elem));
    }
}
