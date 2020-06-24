import {Yield} from './yield';

export type Traverser<T> = (yld: Yield<T>) => void;

export interface Traverseable<T> {
    traverse(yld: Yield<T>): void;
}
