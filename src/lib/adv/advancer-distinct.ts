import {Advancer} from '../advancer';
import {IteratorYieldImpl} from '../utils/iterator-yield';
import {IteratorReturnResultImpl} from '../utils/iterator-return-result';
import {Yield} from '../yield';

export class AdvancerDistinct<T> extends Advancer<T> {
    private readonly upstream: Advancer<T>;
    private readonly set: Set<any>;
    private readonly by: (elem: T) => any;

    constructor(upstream: Advancer<T>, by: (elem: T) => any) {
        super();
        this.upstream = upstream;
        this.by = by;
        this.set = new Set<T>();
    }

    next(): IteratorResult<T> {
        for (let curr = this.upstream.next(); !curr.done; curr = this.upstream.next()) {
            if (!this.set.has(this.by(curr.value as T))) {
                this.set.add(this.by(curr.value as T));
                return new IteratorYieldImpl(curr.value as T);
            }
        }
        return new IteratorReturnResultImpl(undefined);
    }

    traverse(yld: Yield<T>): void {
        this.upstream.traverse(element => {
            if (!this.set.has(this.by(element))) {
                this.set.add(this.by(element));
                yld(element);
            }
        });
    }
}
