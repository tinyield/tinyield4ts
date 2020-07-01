import {Advancer} from '../advancer';
import {Yield} from '../yield';
import {IteratorReturnResultImpl} from '../utils/iterator-return-result';

export class AdvancerDropWhile<T> extends Advancer<T> {
    private readonly upstream: Advancer<T>;
    private readonly predicate: (elem: T) => boolean;
    private dropped: boolean;

    constructor(upstream: Advancer<T>, predicate: (elem: T) => boolean) {
        super();
        this.upstream = upstream;
        this.predicate = predicate;
        this.dropped = false;
    }

    next(): IteratorResult<T, any> {
        let curr;
        while (!this.dropped && !(curr = this.upstream.next()).done) {
            if (!this.predicate(curr.value)) {
                this.dropped = true;
                return curr;
            }
        }
        if (this.dropped) {
            return this.upstream.next();
        }
        return new IteratorReturnResultImpl(undefined);
    }

    traverse(yld: Yield<T>): void {
        this.upstream.traverse(element => {
            if (!this.dropped && !this.predicate(element)) {
                this.dropped = true;
            }
            if (this.dropped) {
                yld(element);
            }
        });
    }
}
