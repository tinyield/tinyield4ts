import {Yield} from '../yield';
import {Operation} from '../operation';
import {Sequence} from '../sequence';

const DO_NOTHING = () => {}; // nosonar

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
            this.upstream.adv.tryAdvance(DO_NOTHING);
        }
        return this.upstream.adv.tryAdvance(yld);
    }

    traverse(yld: Yield<T>): void {
        for (; this.index < this.n; this.index++) {
            this.upstream.adv.tryAdvance(DO_NOTHING);
        }
        this.upstream.trv.traverse(yld);
    }
}
