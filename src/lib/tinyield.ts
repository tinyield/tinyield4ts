import {Traverseable} from './traverser';
import {Yield} from './yield';
import {Advancer} from './advancer';
import {AdvancerIterable} from './adv/advancer-iterable';

export class Tinyield<T> implements Traverseable<T> {
    protected readonly source: Advancer<T>;

    public constructor(source: Advancer<T>) {
        this.source = source;
    }

    public static of<T>(source: T[]): Tinyield<T> {
        return new Tinyield<T>(new AdvancerIterable(source));
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
        this.source.traverse(yld);
    }

    /**
     * Returns an array containing the elements of this Tinyield.
     */
    toArray(): T[] {
        const result: T[] = [];
        this.source.traverse(element => result.push(element));
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
}

export function of<T>(source: T[]): Tinyield<T> {
    return Tinyield.of(source);
}
