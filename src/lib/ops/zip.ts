import {Yield} from '../yield';
import {Operation} from '../operation';
import {Sequence} from '../sequence';

export class Zip<T, U, R> implements Operation<R> {
    private readonly upstream: Sequence<T>;
    private readonly other: Sequence<U>;
    private readonly zip: (elem1: T, elem2: U) => R;

    constructor(upstream: Sequence<T>, other: Sequence<U>, zipper: (elem1: T, elem2: U) => R) {
        this.upstream = upstream;
        this.other = other;
        this.zip = zipper;
    }

    tryAdvance(yld: Yield<R>): boolean {
        let consumed = false;
        this.upstream.adv.tryAdvance(one =>
            this.other.adv.tryAdvance(another => {
                yld(this.zip(one, another));
                consumed = true;
            })
        );
        return consumed;
    }

    traverse(yld: Yield<R>): void {
        this.upstream.trv.traverse(e1 => this.other.adv.tryAdvance(e2 => yld(this.zip(e1, e2))));
    }
}
