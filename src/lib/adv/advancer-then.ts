import {Advancer} from '../advancer';
import {Traverser} from '../traverser';
import {Query} from '../query';
import {bye, Yield} from '../yield';
import {SHORT_CIRCUITING_ERROR} from '../../lib/error/short-circuiting-error';

export class AdvancerThen<T, R> implements Advancer<R> {
    private readonly upstream: Query<T>;
    private readonly then: (source: Query<T>) => Traverser<R>;
    private readonly pageSize = 10;
    private iterator: Iterator<R>;
    private paged = 0;
    private index = -1;

    constructor(upstream: Query<T>, next: (source: Query<T>) => Traverser<R>) {
        this.upstream = upstream;
        this.then = next;
    }

    getIterator(): Iterator<R> {
        if (this.index < this.paged) {
            return this.iterator;
        }
        const mem: R[] = [];
        try {
            this.then(this.upstream)(elem => {
                if (this.paged < this.index + this.pageSize) {
                    this.paged++;
                    mem.push(elem);
                } else {
                    bye();
                }
            });
        } catch (error) {
            if (SHORT_CIRCUITING_ERROR !== error) {
                throw error;
            }
        }
        this.iterator = mem[Symbol.iterator]();
        return this.iterator;
    }

    next(): IteratorResult<R> {
        this.index++;
        return this.getIterator().next();
    }

    traverse(yld: Yield<R>): void {
        this.then(this.upstream)(elem => yld(elem));
    }
}
