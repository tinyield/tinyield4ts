import {Yield} from './yield';
import {Advancer} from './advancer';
import {AdvancerIterable} from './adv/advancer-iterable';
import {AdvancerFilter} from './adv/advancer-filter';
import {AdvancerMap} from './adv/advancer-map';
import {AdvancerSkip} from './adv/advancer-skip';
import {ShortCircuitingError, Traverser} from '../public-api';
import {AdvancerTake} from './adv/advancer-take';
import {AdvancerDistinct} from './adv/advancer-distinct';
import {AdvancerThen} from './adv/advancer-then';
import {AdvancerIterator} from './adv/advancer-iterator';
import {AdvancerZip} from './adv/advancer-zip';

export class Sequence<T> extends Advancer<T> {
    protected readonly adv: Advancer<T>;

    public constructor(source: Advancer<T>) {
        super();
        this.adv = source;
    }

    /**
     * Returns a sequential ordered Sequence whose elements
     * are the specified values in source parameter.
     */
    public static of<T>(source: T[]): Sequence<T> {
        return new Sequence<T>(new AdvancerIterable(source));
    }

    /**
     * Returns an infinite sequential ordered {@code Sequence} produced by iterative
     * application of a function {@code operation} to an initial element {@code seed},
     * producing a {@code Sequence} consisting of {@code seed}, {@code operation(seed)},
     * {@code operation(operation(seed))}, etc.
     *
     */
    public static iterate<T>(seed: T, operation: (elem: T) => T): Sequence<T> {
        return new Sequence<T>(new AdvancerIterator(seed, operation));
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

    /**
     * Returns a query consisting of the distinct elements of this Sequence.
     */
    distinct(): Sequence<T> {
        return this.distinctBy(elem => elem);
    }

    /**
     * Returns a query consisting of the distinct elements of this Sequence
     * by the specified key.
     */
    distinctByKey(key: keyof T): Sequence<T> {
        return this.distinctBy(elem => elem[key]);
    }

    /**
     * Returns a query consisting of the distinct elements of this Sequence
     * by the specified selector.
     */
    distinctBy(selector: (elem: T) => any): Sequence<T> {
        return new Sequence<T>(new AdvancerDistinct(this.adv, selector));
    }

    /**
     * The {@code then} operator lets you encapsulate a piece of an operator
     * chain into a function.
     * That function {@code next} is applied to this query to produce a new
     * {@code Traverser} object that is encapsulated in the resulting Sequence.
     */
    then<U>(next: (source: Sequence<T>) => Traverser<U>): Sequence<U> {
        return new Sequence<U>(new AdvancerThen(this, next));
    }

    /**
     * Applies a specified function to the corresponding elements of two
     * sequences, producing a sequence of the results.
     */
    zip<U, R>(other: Sequence<U>, zipper: (elem1: T, elem2: U) => R): Sequence<R> {
        return new Sequence<R>(new AdvancerZip(this.adv, other.adv, zipper));
    }
}

/**
 * Returns a sequential ordered Sequence whose elements
 * are the specified values in source parameter.
 */
export function of<T>(source: T[]): Sequence<T> {
    return Sequence.of(source);
}

/**
 * Returns an infinite sequential ordered {@code Sequence} produced by iterative
 * application of a function {@code operation} to an initial element {@code seed},
 * producing a {@code Sequence} consisting of {@code seed}, {@code operation(seed)},
 * {@code operation(operation(seed))}, etc.
 *
 */
export function iterate<T>(seed: T, operation: (elem: T) => T): Sequence<T> {
    return Sequence.iterate(seed, operation);
}
