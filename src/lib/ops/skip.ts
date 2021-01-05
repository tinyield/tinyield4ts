import {Yield} from '../yield';
import {Operation} from '../operation';
import {Sequence} from '../sequence';

export class Skip<T> implements Operation<T> {
    private readonly upstream: Sequence<T>;
    private readonly n: number;
    private index: number;

    constructor(upstream: Sequence<T>, n: number) {
        this.upstream = upstream;
        this.n = n;
        this.index = 0;
    }

    tryAdvance(yld: Yield<T>): boolean {
        for (; this.index < this.n; this.index++) {
            this.upstream.adv.tryAdvance(() => {});
        }
        return this.upstream.adv.tryAdvance(yld);
    }

    traverse(yld: Yield<T>): void {
        for (; this.index < this.n; this.index++) {
            this.upstream.adv.tryAdvance(() => {});
        }
        this.upstream.trv.traverse(yld);
    }
}
