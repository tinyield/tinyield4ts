import {Query} from '../..';

export function getResultFromIteration<T>(query: Query<T>): T[] {
    const result: T[] = [];
    let current: IteratorResult<T, any>;
    while (!(current = query.next()).done) {
        result.push(current.value as T);
    }
    return result;
}

export function getResultFromTraversal<T>(query: Query<T>): T[] {
    const result: T[] = [];
    query.traverse(elem => result.push(elem));
    return result;
}
