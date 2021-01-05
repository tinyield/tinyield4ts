import {Yield} from '../yield';
import {Operation} from '../operation';
import {Sequence} from '../sequence';

export class DropWhile<T> implements Operation<T> {
    private readonly upstream: Sequence<T>;
    private readonly predicate: (elem: T) => boolean;
    private dropped: boolean;

    constructor(upstream: Sequence<T>, predicate: (elem: T) => boolean) {
        this.upstream = upstream;
        this.predicate = predicate;
        this.dropped = false;
    }

    tryAdvance(yld: Yield<T>): boolean {
        if (this.dropped) {
            return this.upstream.adv.tryAdvance(yld);
        } else {
            while (!this.dropped && this.dropNext(yld)) {
                // Intentionally empty. Action specified on yield statement of tryAdvance().
            }
            return this.dropped;
        }
    }

    traverse(yld: Yield<T>): void {
        while (!this.dropped && this.dropNext(yld)) {
            // Intentionally empty. Action specified on yield statement of traverse().
        }
        this.upstream.trv.traverse(yld);
    }

    private dropNext(yld: Yield<T>): boolean {
        return this.upstream.adv.tryAdvance(item => {
            if (!this.predicate(item)) {
                this.dropped = true;
                yld(item);
            }
        });
    }
}
