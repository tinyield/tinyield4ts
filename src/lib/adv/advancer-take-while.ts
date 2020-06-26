import {Advancer} from '../advancer';
import {bye, Yield} from '../yield';
import {IteratorReturnResultImpl} from '../utils/iterator-return-result';
import {Query} from '../query';

export class AdvancerTakeWhile<T> extends Advancer<T> {
    private readonly upstream: Query<T>;
    private readonly predicate: (elem: T) => boolean;
    private finished: boolean;

    constructor(upstream: Query<T>, predicate: (elem: T) => boolean) {
        super();
        this.upstream = upstream;
        this.predicate = predicate;
        this.finished = false;
    }

    next(): IteratorResult<T, any> {
        const curr = this.upstream.next();
        if (this.finished || curr.done || !this.predicate(curr.value)) {
            this.finished = true;
            return new IteratorReturnResultImpl(undefined);
        }
        return curr;
    }

    traverse(yld: Yield<T>): void {
        this.upstream.shortCircuit(element => {
            if (!this.predicate(element)) {
                bye();
            }
            yld(element);
        });
    }
}
