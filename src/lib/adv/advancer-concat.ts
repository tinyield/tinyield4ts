import {Advancer} from '../advancer';
import {IteratorYieldImpl} from '../utils/iterator-yield';
import {IteratorReturnResultImpl} from '../utils/iterator-return-result';
import {Yield} from '../yield';
import {getMergedCharacteristics} from '../characteristics';

export class AdvancerConcat<T> extends Advancer<T> {
    private readonly first: Advancer<T>;
    private readonly second: Advancer<T>;

    constructor(first: Advancer<T>, second: Advancer<T>) {
        super(getMergedCharacteristics(first.characteristics, second.characteristics));
        this.first = first;
        this.second = second;
    }

    next(): IteratorResult<T> {
        const current = this.getNextFrom(this.first);
        if (!current.done) {
            return current;
        } else {
            return this.getNextFrom(this.second);
        }
    }

    traverse(yld: Yield<T>): void {
        this.first.traverse(element => yld(element));
        this.second.traverse(element => yld(element));
    }

    private getNextFrom(adv: Advancer<T>): IteratorResult<T> {
        const iteration = adv.next();
        if (!iteration.done) {
            return new IteratorYieldImpl(iteration.value);
        }
        return new IteratorReturnResultImpl(undefined);
    }
}
