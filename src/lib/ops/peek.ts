import {Yield} from '../yield';
import {Operation} from '../operation';
import {Sequence} from '../sequence';

export class Peek<T> implements Operation<T> {
    private readonly upstream: Sequence<T>;
    private readonly action: (elem: T) => void;

    constructor(upstream: Sequence<T>, action: (elem: T) => void) {
        this.upstream = upstream;
        this.action = action;
    }

    tryAdvance(yld: Yield<T>): boolean {
        return this.upstream.adv.tryAdvance(this.peeking(yld));
    }

    traverse(yld: Yield<T>): void {
        this.upstream.trv.traverse(this.peeking(yld));
    }

    private peeking(yld: (element: T) => void): Yield<T> {
        return (element: T) => {
            this.action(element);
            yld(element);
        };
    }
}
