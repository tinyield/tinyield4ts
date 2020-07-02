import {Query} from '../query';
import {Advancer} from '../advancer';
import {AdvancerIterable} from '../adv/advancer-iterable';
import {AdvancerIterator} from '../adv/advancer-iterator';
import {AdvancerGenerate} from '../adv/advancer-generate';

export class NumberQuery extends Query<number> {
    constructor(source: Advancer<number>) {
        super(source);
    }

    /**
     * Returns a sequential ordered Query whose elements
     * are the specified values in source parameter.
     */
    public static ofNumber(source: number[]): NumberQuery {
        return new NumberQuery(new AdvancerIterable(source));
    }

    /**
     * Returns an infinite sequential ordered {@code Query} produced by iterative
     * application of a function {@code operation} to an initial element {@code seed},
     * producing a {@code NumberQuery} consisting of {@code seed}, {@code operation(seed)},
     * {@code operation(operation(seed))}, etc.
     *
     */
    public static iterateNumber(seed: number, operation: (elem: number) => number): NumberQuery {
        return new NumberQuery(new AdvancerIterator(seed, operation));
    }

    /**
     * Returns an infinite sequential unordered {@code NumberQuery}
     * where each element is generated by the provided Supplier.
     */
    static generateNumber(supplier: () => number): NumberQuery {
        return new NumberQuery(new AdvancerGenerate(supplier));
    }

    /**
     * Returns an number describing the arithmetic mean of elements of this {@code NumberQuery},
     * or undefined if this {@code NumberQuery} is empty. This is a special case of a reduction.
     * <p>
     * This is a terminal operation.
     */
    average(): number {
        const data = super.toArray();
        const count = data.length;
        if (count === 0) {
            return undefined;
        }

        return NumberQuery.ofNumber(data).sum() / count;
    }

    /**
     * Returns the highest number of this {@code NumberQuery}
     */
    max(): number {
        return super.max((a, b) => a - b);
    }

    /**
     * Returns the lowest number of this {@code NumberQuery}
     */
    min(): number {
        return super.max((a, b) => b - a);
    }

    /**
     * Returns the sum of elements in this {@code NumberQuery} .
     * <p>
     * This is a special case of a reduction.
     */
    sum(): number {
        return this.reduce((acc, curr) => acc + curr, 0);
    }
}