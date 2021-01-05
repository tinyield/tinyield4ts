import {Yield} from '../yield';
import {Operation} from '../operation';

export class FromIterator<T> implements Operation<T> {
    private readonly operation: (elem: T) => T;
    private previous: T;

    constructor(seed: T, operation: (elem: T) => T) {
        this.operation = operation;
        this.previous = seed;
    }

    tryAdvance(yld: Yield<T>): boolean {
        yld(this.previous);
        this.previous = this.operation(this.previous);
        return true;
    }

    traverse(yld: Yield<T>): void {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            yld(this.previous);
            this.previous = this.operation(this.previous);
        }
    }
}
