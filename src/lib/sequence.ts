import {Advanceable} from './advancer';
import {Traversable} from './traverser';
import {Yield} from './yield';

export interface Sequence<T> {
    adv: Advanceable<T>;
    trv: Traversable<T>;
    shortCircuit(yld: Yield<T>): void;
}
