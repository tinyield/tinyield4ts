import {Query} from '../../lib/query';

export function getResultFromIteration<T>(query: Query<T>): T[] {
    const result: T[] = [];
    let current: T;
    while (query.tryAdvance(elem => (current = elem))) {
        result.push(current);
    }
    return result;
}

export function getResultFromTraversal<T>(query: Query<T>): T[] {
    const result: T[] = [];
    query.traverse(elem => result.push(elem));
    return result;
}
