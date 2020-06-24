import {Advancer} from '../advancer';
import {IteratorReturnResultImpl} from '../utils/iterator-return-result';
import {Yield} from '../yield';
import {Sequence} from '../sequence';

export class AdvancerFlatmap<T, R> implements Advancer<R> {
    private readonly upstream: Sequence<T>;
    private readonly mapper: (elem: T) => Sequence<R>;
    private src: Sequence<R>;

    constructor(upstream: Sequence<T>, mapper: (elem: T) => Sequence<R>) {
        this.upstream = upstream;
        this.mapper = mapper;
        this.src = new Sequence<R>(Advancer.empty());
    }

    next(): IteratorResult<R, any> {
        let curr: IteratorResult<R, any>;
        while ((curr = this.src.next()).done) {
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
