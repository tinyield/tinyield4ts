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
import {AdvancerFlatmap} from './adv/advancer-flatmap';
import {AdvancerPeek} from './adv/advancer-peek';
import {AdvancerTakeWhile} from './adv/advancer-take-while';

export class Query<T> extends Advancer<T> {
    protected readonly adv: Advancer<T>;

    public constructor(source: Advancer<T>) {
        super();
        this.adv = source;
    }

    /**
     * Returns a sequential ordered Query whose elements
     * are the specified values in source parameter.
     */
    public static of<T>(source: T[]): Query<T> {
        return new Query<T>(new AdvancerIterable(source));
    }

    /**
     * Returns an infinite sequential ordered {@code Query} produced by iterative
     * application of a function {@code operation} to an initial element {@code seed},
     * producing a {@code Query} consisting of {@code seed}, {@code operation(seed)},
     * {@code operation(operation(seed))}, etc.
     *
     */
    public static iterate<T>(seed: T, operation: (elem: T) => T): Query<T> {
        return new Query<T>(new AdvancerIterator(seed, operation));
    }

    /**
     * Returns an {@link IteratorResult} that reports either the
     * next element in this {@code Query} or that there it has
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
     * Returns an array containing the elements of this Query.
     */
    toArray(): T[] {
        const result: T[] = [];
        this.adv.traverse(element => result.push(element));
        return result;
    }

    /**
     * Returns a {@code Query} consisting of the elements of this {@code Query},
     * sorted according to the provided Comparator.
     *
     * This is a stateful intermediate operation.
     */
    sorted(comparator: (a: T, b: T) => number): Query<T> {
        return new Query<T>(new AdvancerIterable(this.toArray().sort(comparator)));
    }

    /**
     * Returns a query consisting of the elements of this Query that match
     * the given predicate.
     */
    filter(predicate: (elem: T) => boolean): Query<T> {
        return new Query<T>(new AdvancerFilter(this.adv, predicate));
    }

    /**
     * Returns a Query consisting of the results of applying the given
     * function to the elements of this Query.
     */
    map<R>(mapper: (elem: T) => R): Query<R> {
        return new Query(new AdvancerMap(this.adv, mapper));
    }

    /**
     * Returns a Query consisting of the remaining elements of this Query
     * after discarding the first {@code n} elements of the Query.
     */
    skip(n: number): Query<T> {
        return new Query<T>(new AdvancerSkip(this.adv, n));
    }

    /**
     * Returns a Query consisting of the elements of this Query, truncated
     * to be no longer than {@code n} in length.
     */
    take(n: number): Query<T> {
        return new Query<T>(new AdvancerTake(this, n));
    }

    /**
     * Returns a Query consisting of the elements of this Query, truncated
     * to be no longer than {@code n} in length.
     */
    takeWhile(predicate: (elem: T) => boolean): Query<T> {
        return new Query<T>(new AdvancerTakeWhile(this, predicate));
    }

    /**
     * Returns the first element of this Query or undefined if the
     * Query is empty.
     */
    first(): T {
        const first = this.next();
        if (!first.done) {
            return first.value;
        }
        return undefined;
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
     * Returns a query consisting of the distinct elements of this Query.
     */
    distinct(): Query<T> {
        return this.distinctBy(elem => elem);
    }

    /**
     * Returns a query consisting of the distinct elements of this Query
     * by the specified key.
     */
    distinctByKey(key: keyof T): Query<T> {
        return this.distinctBy(elem => elem[key]);
    }

    /**
     * Returns a query consisting of the distinct elements of this Query
     * by the specified selector.
     */
    distinctBy(selector: (elem: T) => any): Query<T> {
        return new Query<T>(new AdvancerDistinct(this.adv, selector));
    }

    /**
     * The {@code then} operator lets you encapsulate a piece of an operator
     * chain into a function.
     * That function {@code next} is applied to this query to produce a new
     * {@code Traverser} object that is encapsulated in the resulting Query.
     */
    then<U>(next: (source: Query<T>) => Traverser<U>): Query<U> {
        return new Query<U>(new AdvancerThen(this, next));
    }

    /**
     * Applies a specified function to the corresponding elements of two
     * sequences, producing a sequence of the results.
     */
    zip<U, R>(other: Query<U>, zipper: (elem1: T, elem2: U) => R): Query<R> {
        return new Query<R>(new AdvancerZip(this.adv, other.adv, zipper));
    }

    /**
     * Returns a Query consisting of the results of replacing each element of
     * this Query with the contents of a mapped query produced by applying
     * the provided mapping function to each element.
     */
    flatMap<R>(mapper: (elem: T) => Query<R>): Query<R> {
        return new Query<R>(new AdvancerFlatmap(this, mapper));
    }

    /**
     * Returns a Query consisting of the elements of this Query, additionally
     * performing the provided action on each element as elements are consumed
     * from the resulting Query.
     */
    peek(action: (elem: T) => void): Query<T> {
        return new Query<T>(new AdvancerPeek(this.adv, action));
    }

    /**
     * Returns a {@link Set} containing the elements of this query.
     */
    toSet(): Set<T> {
        const data = new Set<T>();
        this.traverse(elem => data.add(elem));
        return data;
    }

    /**
     * Performs a mutable reduction operation on the elements of this {@code Query}.
     * A mutable reduction is one in which the reduced value is a mutable result container, such as an Array,
     * and elements are incorporated by updating the state of the result rather than by replacing the result.
     */
    collect<R>(supplier: () => R, accumulator: (container: R, element: T) => void): R {
        const result = supplier();
        this.traverse(elem => accumulator(result, elem));
        return result;
    }
}

/**
 * Returns a sequential ordered Query whose elements
 * are the specified values in source parameter.
 */
export function of<T>(source: T[]): Query<T> {
    return Query.of(source);
}

/**
 * Returns an infinite sequential ordered {@code Query} produced by iterative
 * application of a function {@code operation} to an initial element {@code seed},
 * producing a {@code Query} consisting of {@code seed}, {@code operation(seed)},
 * {@code operation(operation(seed))}, etc.
 *
 */
export function iterate<T>(seed: T, operation: (elem: T) => T): Query<T> {
    return Query.iterate(seed, operation);
}
