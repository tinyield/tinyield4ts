import {Yield} from '../yield';
import {Operation} from '../operation';
import {Sequence} from '../sequence';

export class Concat<T> implements Operation<T> {
    private readonly first: Sequence<T>;
    private readonly second: Sequence<T>;

    constructor(first: Sequence<T>, second: Sequence<T>) {
        this.first = first;
        this.second = second;
    }

    tryAdvance(yld: Yield<T>): boolean {
        return this.first.adv.tryAdvance(yld) || this.second.adv.tryAdvance(yld);
    }

    traverse(yld: Yield<T>): void {
        this.first.trv.traverse(element => yld(element));
        this.second.trv.traverse(element => yld(element));
    }
}
