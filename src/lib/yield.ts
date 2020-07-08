import {SHORT_CIRCUITING_ERROR} from './error/short-circuiting-error';

export type Yield<T> = (element: T) => void;

/**
 * Auxiliary function for traversal short circuit.
 */
export function bye() {
    throw SHORT_CIRCUITING_ERROR;
}
