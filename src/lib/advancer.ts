import {Yield} from './yield';

export interface Advanceable<T> {
    tryAdvance(yld: Yield<T>): boolean;
}

export type Advancer<T> = (yld: Yield<T>) => boolean;

export abstract class AbstractAdvancer<T> implements Advanceable<T> {
    /**
     * An {@link Advanceable} object without elements.
     */
    static empty<R>(): Advanceable<R> {
        return {
            tryAdvance: () => false,
        };
    }

    /**
     * Creates an {@link Advanceable} from the {@link Advancer} function
     * @param advancer the resulting {@link Advanceable}
     */
    static of<R>(advancer: Advancer<R>): Advanceable<R> {
        return {
            tryAdvance: advancer,
        };
    }
    /**
     * If a remaining element exists, yields that element through
     * the given action.
     */
    abstract tryAdvance(yld: Yield<T>): boolean;
}
export const UNDEFINED_ADVANCER_ERROR = new Error(
    'Missing tryAdvance() implementation! Use the overloaded then() providing both Advancer and Traverser!'
);
export const UNDEFINED_ADVANCER = AbstractAdvancer.of<never>(() => {
    throw UNDEFINED_ADVANCER_ERROR;
});
