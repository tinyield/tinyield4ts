import {Advancer} from '../advancer';
import {IteratorReturnResultImpl} from '../utils/iterator-return-result';
import {Yield} from '../yield';
import {Query} from '../query';
import {DEFAULT_CHARACTERISTICS} from '../characteristics';

export class AdvancerFlatmap<T, R> implements Advancer<R> {
    private readonly upstream: Query<T>;
    private readonly mapper: (elem: T) => Query<R>;
    private src: Query<R>;

    constructor(upstream: Query<T>, mapper: (elem: T) => Query<R>) {
        this.upstream = upstream;
        this.mapper = mapper;
        this.src = new Query<R>(Advancer.empty(), DEFAULT_CHARACTERISTICS);
    }

    next(): IteratorResult<R> {
        let curr: IteratorResult<R>;
        for (curr = this.src.next(); curr.done; curr = this.src.next()) {
            const aux = this.upstream.next();
            if (aux.done) {
                return new IteratorReturnResultImpl(undefined);
            }
            this.src = this.mapper(aux.value as T);
        }
        return curr;
    }

    traverse(yld: Yield<R>): void {
        this.upstream.traverse(elem => this.mapper(elem).traverse(yld));
    }
}
