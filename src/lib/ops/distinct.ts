import {Yield} from '../yield';
import {Operation} from '../operation';
import {Sequence} from '../sequence';

export class Distinct<T, U> implements Operation<T> {
    private readonly upstream: Sequence<T>;
    private readonly set: Set<U>;
    private readonly by: (elem: T) => U;

    constructor(upstream: Sequence<T>, by: (elem: T) => U) {
        this.upstream = upstream;
        this.by = by;
        this.set = new Set<U>();
    }

    tryAdvance(yld: Yield<T>): boolean {
        let found = false;
        const find = (element: T) => {
            if (!this.set.has(this.by(element))) {
                this.set.add(this.by(element));
                found = true;
                yld(element);
            }
        };
        while (!found && this.upstream.adv.tryAdvance(find)) {
            // Looking for next distinct element
        }
        return found;
    }

    traverse(yld: Yield<T>): void {
        this.upstream.trv.traverse(element => {
            if (!this.set.has(this.by(element))) {
                this.set.add(this.by(element));
                yld(element);
            }
        });
    }
}
