import {Advanceable} from './advancer';
import {Traversable} from './traverser';

export interface Operation<T> extends Advanceable<T>, Traversable<T> {}
