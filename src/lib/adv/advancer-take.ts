import {Advancer} from '../advancer';
import {bye, Yield} from '../yield';
import {IteratorReturnResultImpl} from '../utils/iterator-return-result';
import {Sequence} from '../sequence';

export class AdvancerTake<T> extends Advancer<T> {
    private readonly upstream: Sequence<T>;
    private readonly n: number;
    private index: number;

    constructor(upstream: Sequence<T>, n: number) {
        super();
        this.upstream = upstream;
        this.n = n;
        this.index = 0;
    }

    next(): IteratorResult<T, any> {
        if (this.index >= this.n) {
            return new IteratorReturnResultImpl(undefined);
        }
        this.index++;
        return this.upstream.next();
    }

    traverse(yld: Yield<T>): void {
        this.upstream.shortCircuit(element => {
            if (this.index >= this.n) {
                bye();
            }
            this.index++;
            yld(element);
        });
    }
}
