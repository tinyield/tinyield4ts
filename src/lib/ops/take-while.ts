import {Yield} from '../yield';
import {Operation} from '../operation';
import {Sequence} from '../sequence';

export class TakeWhile<T> implements Operation<T> {
    private readonly upstream: Sequence<T>;
    private readonly predicate: (elem: T) => boolean;
    private finished: boolean;

    constructor(upstream: Sequence<T>, predicate: (elem: T) => boolean) {
        this.upstream = upstream;
        this.predicate = predicate;
        this.finished = false;
    }

    tryAdvance(yld: Yield<T>): boolean {
        if (this.finished) {
            return false; // Once predicate is false it finishes the iteration
        }
        return this.upstream.adv.tryAdvance(this.yieldWhile(yld)) && !this.finished;
    }

    traverse(yld: Yield<T>): void {
        if (this.finished) {
            return; // Once predicate is false it finishes the iteration
        }
        const takeWhile: Yield<T> = this.yieldWhile(yld);
        while (this.upstream.adv.tryAdvance(takeWhile) && !this.finished) {
            // Intentionally empty. Action specified on yield statement of tryAdvance().
        }
    }

    private yieldWhile(yld: (element: T) => void): Yield<T> {
        return item => {
            if (this.predicate(item)) {
                yld(item);
            } else {
                this.finished = true;
            }
        };
    }
}
