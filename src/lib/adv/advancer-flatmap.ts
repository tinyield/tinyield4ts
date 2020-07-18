import {Advancer} from '../advancer';
import {DONE} from '../utils/iterator-return-result';
import {Yield} from '../yield';
import {Query} from '../query';

export class AdvancerFlatmap<T, R> extends Advancer<R> {
    private readonly upstream: Advancer<T>;
    private readonly mapper: (elem: T) => Query<R>;
    private src: Query<R>;

    constructor(upstream: Advancer<T>, mapper: (elem: T) => Query<R>) {
        super(upstream.characteristics);
        this.upstream = upstream;
        this.mapper = mapper;
        this.src = new Query<R>(Advancer.empty());
    }

    next(): IteratorResult<R> {
        let curr: IteratorResult<R>;
        for (curr = this.src.next(); curr.done; curr = this.src.next()) {
            const aux = this.upstream.next();
            if (aux.done) {
                return DONE;
            }
            this.src = this.mapper(aux.value as T);
        }
        return curr;
    }

    traverse(yld: Yield<R>): void {
        this.upstream.traverse(elem => this.mapper(elem).traverse(yld));
    }
}
