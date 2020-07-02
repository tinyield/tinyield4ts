import {Advancer} from '../advancer';
import {Yield} from '../yield';

export class AdvancerPeek<T> implements Advancer<T> {
    private readonly upstream: Advancer<T>;
    private readonly action: (elem: T) => void;

    constructor(upstream: Advancer<T>, action: (elem: T) => void) {
        this.upstream = upstream;
        this.action = action;
    }

    next(): IteratorResult<T> {
        const curr = this.upstream.next();
        if (!curr.done) {
            this.action(curr.value as T);
        }
        return curr;
    }

    traverse(yld: Yield<T>): void {
        this.upstream.traverse(element => {
            this.action(element);
            yld(element);
        });
    }
}
