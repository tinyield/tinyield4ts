import {Traverseable} from './traverser';
import {DONE} from './utils/iterator-return-result';
import {Yield} from './yield';
import {Characteristics, DEFAULT_CHARACTERISTICS} from './characteristics';

export abstract class Advancer<T> implements Iterator<T>, Traverseable<T> {
    public readonly characteristics: Characteristics;
    constructor(characteristics: Characteristics = DEFAULT_CHARACTERISTICS) {
        this.characteristics = characteristics;
    }
    static empty<R>(): Advancer<R> {
        // tslint:disable-next-line
        return new (class extends Advancer<R> {
            next(): IteratorResult<R> {
                return DONE;
            }

            traverse(yld: Yield<R>) {
                /* Do nothing. Since there are no elements, thus there is nothing to do. */
            }
        })();
    }

    abstract traverse(yld: Yield<T>): void;
    abstract next(): IteratorResult<T>;
}
