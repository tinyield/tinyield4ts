import {ShortCircuitingError} from './error/short-circuiting-error';

export type Yield<T> = (element: T) => void;

/**
 * Auxiliary function for traversal short circuit.
 */
export function bye(message?: string) {
    throw new ShortCircuitingError(message);
}
