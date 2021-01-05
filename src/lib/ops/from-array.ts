import {Yield} from '../yield';
import {Operation} from '../operation';

export class FromArray<T> implements Operation<T> {
    readonly source: T[];
    private current: number;

    constructor(source: T[]) {
        this.source = source;
        this.current = 0;
    }

    tryAdvance(yld: Yield<T>): boolean {
        if (this.current >= this.source.length) {
            return false;
        }
        yld(this.source[this.current]);
        ++this.current;
        return true;
    }

    traverse(yld: Yield<T>): void {
        for (; this.current < this.source.length; this.current++) {
            yld(this.source[this.current]);
        }
    }
}
