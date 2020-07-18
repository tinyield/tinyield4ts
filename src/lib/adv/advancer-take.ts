import {Advancer} from '../advancer';
import {bye, Yield} from '../yield';
import {DONE} from '../utils/iterator-return-result';
import {Query} from '../query';

export class AdvancerTake<T> extends Advancer<T> {
    private readonly upstream: Query<T>;
    private readonly n: number;
    private index: number;

    constructor(upstream: Query<T>, n: number) {
        super(upstream.characteristics);
        this.upstream = upstream;
        this.n = n;
        this.index = 0;
    }

    next(): IteratorResult<T> {
        if (this.index >= this.n) {
            return DONE;
        }
        this.index++;
        return this.upstream.next();
    }

    traverse(yld: Yield<T>): void {
        if (this.upstream.characteristics.isAdvanceable) {
            let next: IteratorResult<T>;
            while (this.index < this.n && (next === undefined || !next.done)) {
                this.index++;
                next = this.upstream.next();
                if (!next.done) {
                    yld(next.value);
                }
            }
        } else {
            this.upstream.shortCircuit(element => {
                if (this.index >= this.n) {
                    bye();
                }
                this.index++;
                yld(element);
            });
        }
    }
}
