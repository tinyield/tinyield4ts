import {Advancer} from '../advancer';
import {Yield} from '../yield';
import {DONE} from '../utils/iterator-return-result';

export class AdvancerDropWhile<T> extends Advancer<T> {
    private readonly upstream: Advancer<T>;
    private readonly predicate: (elem: T) => boolean;
    private dropped: boolean;

    constructor(upstream: Advancer<T>, predicate: (elem: T) => boolean) {
        super(upstream.characteristics);
        this.upstream = upstream;
        this.predicate = predicate;
        this.dropped = false;
    }

    next(): IteratorResult<T> {
        if (this.dropped) {
            return this.upstream.next();
        }
        let curr = this.upstream.next();
        while (!this.dropped && !curr.done) {
            if (!this.predicate(curr.value)) {
                this.dropped = true;
                return curr;
            }
            curr = this.upstream.next();
        }
        return DONE;
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
