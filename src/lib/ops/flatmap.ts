import {Yield} from '../yield';
import {Query} from '../query';
import {Operation} from '../operation';
import {Sequence} from '../sequence';

export class Flatmap<T, R> implements Operation<R> {
    private readonly upstream: Sequence<T>;
    private readonly mapper: (elem: T) => Query<R>;
    private src: Query<R>;

    constructor(upstream: Sequence<T>, mapper: (elem: T) => Query<R>) {
        this.upstream = upstream;
        this.mapper = mapper;
        this.src = Query.empty();
    }

    tryAdvance(yld: Yield<R>): boolean {
        while (!this.src.tryAdvance(yld)) {
            if (!this.upstream.adv.tryAdvance(elem => (this.src = this.mapper(elem)))) {
                return false;
            }
        }
        return true;
    }

    traverse(yld: Yield<R>): void {
        this.upstream.trv.traverse(elem => this.mapper(elem).traverse(yld));
    }
}
