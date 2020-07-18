import {Advancer} from '../advancer';
import {Yield} from '../yield';
import {IteratorYieldImpl} from '../utils/iterator-yield';
import {DONE} from '../utils/iterator-return-result';

export class AdvancerArray<T> extends Advancer<T> {
    readonly source: T[];
    private current: number;

    constructor(source: T[]) {
        super();
        this.source = source;
        this.current = 0;
    }

    next(): IteratorResult<T> {
        if (this.current < this.source.length) {
            const index = this.current;
            this.current++;
            return new IteratorYieldImpl(this.source[index]);
        }
        return DONE;
    }

    traverse(yld: Yield<T>): void {
        for (; this.current < this.source.length; this.current++) {
            yld(this.source[this.current]);
        }
    }
}
