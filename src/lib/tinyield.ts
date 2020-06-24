import {TinyieldShortCircuitingError} from './error/tinyield-short-circuiting-error';

export type Yield<T> = (element: T) => void;
export type Traverser<T> = (yld: Yield<T>) => void;

export class Tinyield<T> {
    public constructor(protected readonly source: Traverser<T>) {}

    public static of<T>(source: T[]): Tinyield<T> {
        const ofOperation = (yld: Yield<T>) => {
            for (let i = 0; i < source.length; i++) {
                yld(source[i]);
            }
        };
        return new Tinyield<T>(ofOperation);
    }

    shortCircuiting(yld: Yield<T>): void {
        try {
            this.source(yld);
        } catch (error) {
            if (!(error instanceof TinyieldShortCircuitingError)) {
                throw error;
            }
        }
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

    take(n: number): Tinyield<T> {
        const take = (yld: Yield<T>) => {
            let count = 0;
            this.shortCircuiting((element: T) => {
                if (count >= n) {
                    throw new TinyieldShortCircuitingError(`limit of ${n} reached`);
                } else {
                    yld(element);
                    count++;
                }
            });
        };
        return new Tinyield<T>(take);
    }

    any(predicate: (element: T) => boolean): boolean {
        let anyMatched = false;
        this.shortCircuiting((element: T) => {
            if (predicate(element)) {
                anyMatched = true;
                throw new TinyieldShortCircuitingError(`element ${element} matched`);
            }
        });
        return anyMatched;
    }

    all(predicate: (element: T) => boolean): boolean {
        let anyMatched = true;
        this.shortCircuiting((element: T) => {
            if (!predicate(element)) {
                anyMatched = false;
                throw new TinyieldShortCircuitingError(`element ${element} did not match`);
            }
        });
        return anyMatched;
    }

    shuffle(): Tinyield<T> {
        const swap = (arr: T[], i: number, j: number) => {
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        };
        const shuffle: Traverser<T> = yld => {
            const shuffled = this.toArray();
            for (let i = shuffled.length - 1; i > 0; i--) {
                swap(shuffled, i, Math.floor(Math.random() * (i + 1)));
                yld(shuffled[i]);
            }
        };
        return new Tinyield<T>(shuffle);
    }

    zip(...other: Array<Tinyield<T>>): Tinyield<T[]> {
        throw new Error('Unimplemented method error');
    }

    without(...elements: T[]): Tinyield<T> {
        const set = new Set(elements);
        return this.filter(element => !set.has(element));
    }

    flatMap<U>(mapper: (element: T) => Tinyield<U>): Tinyield<U> {
        const flatMap = (yld: Yield<U>) => this.source((sequence: T) => mapper(sequence).forEach(element => yld(element)));
        return new Tinyield<U>(flatMap);
    }

    distinct(): Tinyield<T> {
        const distinct = (yld: Yield<T>) => {
            const set = new Set<T>();
            this.source((element: T) => {
                if (!set.has(element)) {
                    set.add(element);
                    yld(element);
                }
            });
        };
        return new Tinyield<T>(distinct);
    }

    union(...other: Array<Tinyield<T>>): Tinyield<T> {
        const union = (yld: Yield<T>) => {
            const set = new Set<T>();
            const unionYield = (element: T) => {
                if (!set.has(element)) {
                    set.add(element);
                    yld(element);
                }
            };
            this.source(unionYield);
            other.forEach(sequence => sequence.source(unionYield));
        };
        return new Tinyield<T>(union);
    }

    intersection(...other: Array<Tinyield<T>>): Tinyield<T> {
        const intersection = (yld: Yield<T>) => {
            const sets: Array<Set<T>> = [];
            let count = Number.MAX_VALUE;
            let index = 0;
            const addSet = (sequence: Tinyield<T>, idx: number) => {
                const set = new Set<T>();
                let internalCount = 0;
                sequence.source(element => {
                    if (sets.every(current => current.has(element))) {
                        set.add(element);
                        internalCount++;
                    }
                });
                sets.push(set);

                if (internalCount < count) {
                    count = internalCount;
                    index = idx;
                }
            };

            other.forEach(addSet);
            addSet(this, other.length);

            sets[index].forEach(value => {
                if (sets.every(set => set.has(value))) {
                    yld(value);
                }
            });
        };
        return new Tinyield<T>(intersection);
    }

    then<U>(next: (source: Tinyield<T>) => Traverser<U>): Tinyield<U> {
        return new Tinyield<U>(next(this));
    }

    forEach(consumer: (element: T) => void): void {
        this.source(consumer);
    }

    toArray(): T[] {
        const result: T[] = [];
        this.source(element => result.push(element));
        return result;
    }
}

export function of<T>(source: T[]): Tinyield<T> {
    return Tinyield.of(source);
}
