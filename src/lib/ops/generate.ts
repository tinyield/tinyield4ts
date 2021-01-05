import {Yield} from '../yield';
import {Operation} from '../operation';

export class Generate<T> implements Operation<T> {
    private readonly supplier: () => T;

    constructor(supplier: () => T) {
        this.supplier = supplier;
    }

    public tryAdvance(yld: Yield<T>): boolean {
        yld(this.supplier());
        return true;
    }

    traverse(yld: Yield<T>): void {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            yld(this.supplier());
        }
    }
}
