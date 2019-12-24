export type Yield<T> = (element: T) => void;
export type Traverser<T> = (yld: Yield<T>) => void;

export class Tinyield<T> {
    public constructor(protected readonly source: Traverser<T>) {}

    public static of<T>(source: T[]): Tinyield<T> {
        const of = (yld: Yield<T>) => {
            for (let i = 0; i < source.length; i++) {
                yld(source[i]);
            }
        };
        return new Tinyield<T>(of);
    }

    filter(predicate: (element: T) => boolean): Tinyield<T> {
        const filter = (yld: Yield<T>) => {
            this.source((element: T) => {
                if (predicate(element)) {
                    yld(element);
                }
            });
        };
        return new Tinyield<T>(filter);
    }

    map<U>(mapper: (element: T) => U): Tinyield<U> {
        const map = (yld: Yield<U>) => {
            this.source((element: T) => yld(mapper(element)));
        };
        return new Tinyield<U>(map);
    }

    skip(n: number): Tinyield<T> {
        const skip = (yld: Yield<T>) => {
            let count = 0;
            this.source((element: T) => {
                if (count >= n) {
                    yld(element);
                } else {
                    count++;
                }
            });
        };
        return new Tinyield<T>(skip);
    }

    then<U>(next: (source: Tinyield<T>) => Traverser<U>): Tinyield<U> {
        return new Tinyield<U>(next(this));
    }

    forEach(consumer: (element: T) => void): void {
        this.source(consumer);
    }
}

export function of<T>(source: T[]): Tinyield<T> {
    return Tinyield.of(source);
}
