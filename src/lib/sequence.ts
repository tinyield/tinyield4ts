import {Yield} from './yield';
import {Advancer} from './advancer';
import {AdvancerIterable} from './adv/advancer-iterable';
import {AdvancerFilter} from './adv/advancer-filter';
import {AdvancerMap} from './adv/advancer-map';
import {AdvancerSkip} from './adv/advancer-skip';
import {ShortCircuitingError} from '../public-api';
import {AdvancerTake} from './adv/advancer-take';

export class Sequence<T> extends Advancer<T> {
    protected readonly adv: Advancer<T>;

    public constructor(source: Advancer<T>) {
        super();
        this.adv = source;
    }

    public static of<T>(source: T[]): Sequence<T> {
        return new Sequence<T>(new AdvancerIterable(source));
    }

    /**
     * Returns an {@link IteratorResult} that reports either the
     * next element in this {@code Sequence} or that there it has
     * reached the end of the elements
     */
    next(): IteratorResult<T, any> {
        return this.adv.next();
    }

    /**
     * Yields elements sequentially in the current thread,
     * until all elements have been processed or an
     * exception is thrown.
     */
    forEach(yld: Yield<T>): void {
        this.traverse(yld);
    }

    /**
     * Yields elements sequentially in the current thread,
     * until all elements have been processed or an
     * exception is thrown.
     */
    traverse(yld: Yield<T>) {
        this.adv.traverse(yld);
    }

    /**
     * Returns an array containing the elements of this Sequence.
     */
    toArray(): T[] {
        const result: T[] = [];
        this.adv.traverse(element => result.push(element));
        return result;
    }

    /**
     * Returns a {@code Sequence} consisting of the elements of this {@code Sequence},
     * sorted according to the provided Comparator.
     *
     * This is a stateful intermediate operation.
     */
    sorted(comparator: (a: T, b: T) => number): Sequence<T> {
        return new Sequence<T>(new AdvancerIterable(this.toArray().sort(comparator)));
    }

    /**
     * Returns a query consisting of the elements of this Sequence that match
     * the given predicate.
     */
    filter(predicate: (elem: T) => boolean): Sequence<T> {
        return new Sequence<T>(new AdvancerFilter(this.adv, predicate));
    }

    /**
     * Returns a Sequence consisting of the results of applying the given
     * function to the elements of this Sequence.
     */
    map<R>(mapper: (elem: T) => R): Sequence<R> {
        return new Sequence(new AdvancerMap(this.adv, mapper));
    }

    /**
     * Returns a Sequence consisting of the remaining elements of this Sequence
     * after discarding the first {@code n} elements of the Sequence.
     */
    skip(n: number): Sequence<T> {
        return new Sequence<T>(new AdvancerSkip(this.adv, n));
    }

    /**
     * Returns a Sequence consisting of the elements of this Sequence, truncated
     * to be no longer than {@code n} in length.
     */
    take(n: number): Sequence<T> {
        return new Sequence<T>(new AdvancerTake(this, n));
    }

    /**
     * Yields elements sequentially in the current thread,
     * until all elements have been processed or the traversal
     * exited normally through the invocation of bye().
     */
    shortCircuit(yld: Yield<T>): void {
        try {
            this.adv.traverse(yld);
        } catch (error) {
            if (!(error instanceof ShortCircuitingError)) {
                throw error;
            }
        }
    }
}

export function of<T>(source: T[]): Sequence<T> {
    return Sequence.of(source);
}
