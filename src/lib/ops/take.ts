import {Yield} from '../yield';
import {Operation} from '../operation';
import {Sequence} from '../sequence';

export class Take<T> implements Operation<T> {
    private readonly upstream: Sequence<T>;
    private readonly n: number;
    private count: number;

    constructor(upstream: Sequence<T>, n: number) {
        this.upstream = upstream;
        this.n = n;
        this.count = 0;
    }

    tryAdvance(yld: Yield<T>): boolean {
        if (this.count >= this.n) {
            return false;
        }
        this.count++;
        return this.upstream.adv.tryAdvance(yld);
    }

    traverse(yld: Yield<T>): void {
        if (this.count >= this.n) {
            throw new Error('Traverser has already been operated on or closed!');
        }
        while (this.count < this.n && this.upstream.adv.tryAdvance(yld)) {
            this.count++;
        }
    }
}
