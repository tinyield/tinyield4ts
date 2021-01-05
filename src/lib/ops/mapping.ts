import {Yield} from '../yield';
import {Operation} from '../operation';
import {Sequence} from '../sequence';

export class Mapping<T, R> implements Operation<R> {
    private readonly upstream: Sequence<T>;
    private readonly mapper: (elem: T) => R;

    constructor(upstream: Sequence<T>, mapper: (elem: T) => R) {
        this.upstream = upstream;
        this.mapper = mapper;
    }

    tryAdvance(yld: Yield<R>): boolean {
        return this.upstream.adv.tryAdvance(this.mapping(yld));
    }

    traverse(yld: Yield<R>): void {
        this.upstream.trv.traverse(this.mapping(yld));
    }

    private mapping(yld: (element: R) => void): Yield<T> {
        return (element: T) => yld(this.mapper(element));
    }
}
