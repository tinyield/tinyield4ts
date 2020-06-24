import {Advancer} from '../advancer';
import {IteratorYieldImpl} from '../utils/iterator-yield';
import {IteratorReturnResultImpl} from '../utils/iterator-return-result';
import {Yield} from '../yield';

export class AdvancerMap<T, R> implements Advancer<R> {
    private readonly upstream: Advancer<T>;
    private readonly mapper: (elem: T) => R;

    constructor(upstream: Advancer<T>, mapper: (elem: T) => R) {
        this.upstream = upstream;
        this.mapper = mapper;
    }

    next(): IteratorResult<R, any> {
        let curr: IteratorResult<T, any>;
        while (!(curr = this.upstream.next()).done) {
            return new IteratorYieldImpl(this.mapper(curr.value as T));
        }
        return new IteratorReturnResultImpl(undefined);
    }

    traverse(yld: Yield<R>): void {
        this.upstream.traverse(element => yld(this.mapper(element)));
    }
}
