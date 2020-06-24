import {Advancer} from '../advancer';
import {Yield} from '../yield';
import {IteratorYieldImpl} from '../utils/iterator-yield';
import {IteratorReturnResultImpl} from '../utils/iterator-return-result';

export class AdvancerFilter<T> extends Advancer<T> {
    private readonly upstream: Advancer<T>;
    private readonly predicate: (elem: T) => boolean;

    constructor(upstream: Advancer<T>, predicate: (elem: T) => boolean) {
        super();
        this.upstream = upstream;
        this.predicate = predicate;
    }

    next(): IteratorResult<T, any> {
        let curr: IteratorResult<T, any>;
        while (!(curr = this.upstream.next()).done) {
            if (this.predicate(curr.value as T)) {
                return new IteratorYieldImpl(curr.value as T);
            }
        }
        return new IteratorReturnResultImpl(undefined);
    }

    traverse(yld: Yield<T>): void {
        this.upstream.traverse(element => {
            if (this.predicate(element)) {
                yld(element);
            }
        });
    }
}