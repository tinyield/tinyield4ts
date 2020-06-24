import {Yield} from './yield';
import {Advancer} from './advancer';
import {AdvancerIterable} from './adv/advancer-iterable';
import {AdvancerFilter} from './adv/advancer-filter';

export class Tinyield<T> extends Advancer<T> {
    protected readonly adv: Advancer<T>;

    public constructor(source: Advancer<T>) {
        super();
        this.adv = source;
    }

    public static of<T>(source: T[]): Tinyield<T> {
        return new Tinyield<T>(new AdvancerIterable(source));
    }

    /**
     * Returns an {@link IteratorResult} that reports either the
     * next element in this {@code Tinyield} or that there it has
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
     * Returns an array containing the elements of this Tinyield.
     */
    toArray(): T[] {
        const result: T[] = [];
        this.adv.traverse(element => result.push(element));
        return result;
    }

    /**
     * Returns a {@code Tinyield} consisting of the elements of this {@code Tinyield},
     * sorted according to the provided Comparator.
     *
     * This is a stateful intermediate operation.
     */
    sorted(comparator: (a: T, b: T) => number): Tinyield<T> {
        return new Tinyield<T>(new AdvancerIterable(this.toArray().sort(comparator)));
    }

    /**
     * Returns a query consisting of the elements of this Tinyield that match
     * the given predicate.
     */
    filter(predicate: (elem: T) => boolean): Tinyield<T> {
        return new Tinyield<T>(new AdvancerFilter(this.adv, predicate));
    }
}

export function of<T>(source: T[]): Tinyield<T> {
    return Tinyield.of(source);
}
