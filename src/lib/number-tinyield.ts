import {Tinyield, Yield} from './tinyield';

export class NumberTinyield extends Tinyield<number> {
    public static from(source: Tinyield<number>) {
        return new NumberTinyield(yld => source.forEach(yld));
    }

    constructor(source: (yld: Yield<number>) => void) {
        super(source);
    }

    max(): number {
        let result = Number.MIN_VALUE;
        this.source(element => {
            if (element > result) {
                result = element;
            }
        });
        return result;
    }
}

export function from(source: Tinyield<number>): NumberTinyield {
    return NumberTinyield.from(source);
}
