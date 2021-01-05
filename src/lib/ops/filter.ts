import {Yield} from '../yield';
import {Operation} from '../operation';
import {Sequence} from '../sequence';

export class Filter<T> implements Operation<T> {
    private readonly upstream: Sequence<T>;
    private readonly predicate: (elem: T) => boolean;

    constructor(upstream: Sequence<T>, predicate: (elem: T) => boolean) {
        this.upstream = upstream;
        this.predicate = predicate;
    }

    tryAdvance(yld: Yield<T>): boolean {
        let found = false;
        const find = (item: T) => {
            if (this.predicate(item)) {
                yld(item);
                found = true;
            }
        };
        while (!found && this.upstream.adv.tryAdvance(find)) {
            // Looking for next item that matches the predicate
        }
        return found;
    }

    traverse(yld: Yield<T>): void {
        this.upstream.trv.traverse(element => {
            if (this.predicate(element)) {
                yld(element);
            }
        });
    }
}
