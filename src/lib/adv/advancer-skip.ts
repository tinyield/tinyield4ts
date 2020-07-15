import {Advancer} from '../advancer';
import {Yield} from '../yield';

export class AdvancerSkip<T> extends Advancer<T> {
    private readonly upstream: Advancer<T>;
    private readonly n: number;
    private index: number;

    constructor(upstream: Advancer<T>, n: number) {
        super(upstream.characteristics);
        this.upstream = upstream;
        this.n = n;
        this.index = 0;
    }

    next(): IteratorResult<T> {
        while (this.index < this.n && !this.upstream.next().done) {
            this.index++;
        }
        return this.upstream.next();
    }

    traverse(yld: Yield<T>): void {
        this.upstream.traverse(element => {
            if (this.index >= this.n) {
                yld(element);
            }
            this.index++;
        });
    }
}
