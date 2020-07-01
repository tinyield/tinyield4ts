import {Advancer} from '../advancer';
import {Yield} from '../yield';
import {IteratorYieldImpl} from '../utils/iterator-yield';

export class AdvancerGenerate<T> extends Advancer<T> {
    private readonly supplier: () => T;

    constructor(supplier: () => T) {
        super();
        this.supplier = supplier;
    }

    next(): IteratorResult<T, any> {
        return new IteratorYieldImpl(this.supplier());
    }

    traverse(yld: Yield<T>): void {
        while (true) {
            yld(this.supplier());
        }
    }
}
