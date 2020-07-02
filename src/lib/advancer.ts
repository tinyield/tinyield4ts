import {Traverseable} from './traverser';
import {IteratorReturnResultImpl} from './utils/iterator-return-result';
import {Yield} from './yield';

export abstract class Advancer<T> implements Iterator<T>, Traverseable<T> {
    static empty<R>(): Advancer<R> {
        // tslint:disable-next-line
        return new (class extends Advancer<R> {
            next(): IteratorResult<R> {
                return new IteratorReturnResultImpl(undefined);
            }

            traverse(yld: Yield<R>) {
                /* Do nothing. Since there are no elements, thus there is nothing to do. */
            }
        })();
    }

    abstract traverse(yld: Yield<T>): void;
    abstract next(): IteratorResult<T>;
}
