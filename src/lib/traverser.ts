import {Yield} from './yield';

export interface Traversable<T> {
    traverse(yld: Yield<T>): void;
}

export type Traverser<T> = (yld: Yield<T>) => void;

export abstract class AbstractTraverser<T> implements Traversable<T> {
    static empty<R>(): AbstractTraverser<R> {
        return {
            traverse: () => {
                /* Do Nothing */
            },
        };
    }
    static of<R>(traverser: Traverser<R>): Traversable<R> {
        return {
            traverse: traverser,
        };
    }

    abstract traverse(yld: Yield<T>): void;
}
