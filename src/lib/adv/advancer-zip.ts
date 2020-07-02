import {Advancer} from '../advancer';
import {IteratorYieldImpl} from '../utils/iterator-yield';
import {IteratorReturnResultImpl} from '../utils/iterator-return-result';
import {Yield} from '../yield';

export class AdvancerZip<T, U, R> implements Advancer<R> {
    private readonly upstream: Advancer<T>;
    private readonly other: Advancer<U>;
    private readonly zipper: (elem1: T, elem2: U) => R;

    constructor(upstream: Advancer<T>, other: Advancer<U>, zipper: (elem1: T, elem2: U) => R) {
        this.upstream = upstream;
        this.other = other;
        this.zipper = zipper;
    }

    next(): IteratorResult<R> {
        const upstreamCurrent: IteratorResult<T> = this.upstream.next();
        const otherCurrent: IteratorResult<U> = this.other.next();
        if (upstreamCurrent.done || otherCurrent.done) {
            return new IteratorReturnResultImpl(undefined);
        }
        return new IteratorYieldImpl(this.zipper(upstreamCurrent.value as T, otherCurrent.value as U));
    }

    traverse(yld: Yield<R>): void {
        this.upstream.traverse(element => {
            const otherCurrent = this.other.next();
            if (!otherCurrent.done) {
                yld(this.zipper(element, otherCurrent.value as U));
            }
        });
    }
}
