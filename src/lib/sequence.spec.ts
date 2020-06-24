import {of, Sequence} from './sequence';

class Beverage {
    constructor(public readonly name: string, public readonly cost: number) {}
}

describe('Tinyield', () => {
    let beverages: Beverage[];
    let packOfBeer: Beverage[];
    const beer = new Beverage('beer', 1);

    beforeEach(() => {
        const coffee = new Beverage('coffee', 1);
        const cola = new Beverage('cola', 1);
        const wine = new Beverage('wine', 3);

        beverages = [coffee, cola, wine];
        packOfBeer = [beer, beer, beer, beer];
    });

    describe('when "of" is called', () => {
        let sequence: Sequence<Beverage>;

        beforeEach(() => {
            sequence = of(beverages);
        });

        it('should return a sequence', () => {
            expect(sequence).toBeDefined('sequence is undefined');
            expect(packOfBeer).toBeDefined('packOfBeer is undefined');
        });

        describe('when "filter" is called', () => {
            let filtered: Sequence<Beverage>;

            beforeEach(() => {
                filtered = sequence.filter(element => element.cost > 1);
            });

            it('should return a new sequence', () => {
                expect(filtered).not.toEqual(sequence);
            });

            describe('when the sequence is iterated', () => {
                let expectation: Beverage[];
                let actual: Beverage[];

                beforeEach(() => {
                    expectation = [beverages[beverages.length - 1]];
                    actual = [];
                    let current: IteratorResult<Beverage, any>;
                    while (!(current = filtered.next()).done) {
                        actual.push(current.value as Beverage);
                    }
                });

                it('should only have the filtered elements', () => {
                    expect(actual.length).toEqual(expectation.length);
                    for (let i = 0; i < actual.length; i++) {
                        expect(actual[i]).toEqual(expectation[i]);
                    }
                });
            });

            describe('when the sequence is traversed', () => {
                let expectation: Beverage[];
                let actual: Beverage[];

                beforeEach(() => {
                    expectation = [beverages[beverages.length - 1]];
                    actual = [];
                    filtered.forEach(element => actual.push(element));
                });

                it('should only have the filtered elements', () => {
                    expect(actual.length).toEqual(expectation.length);
                    for (let i = 0; i < actual.length; i++) {
                        expect(actual[i]).toEqual(expectation[i]);
                    }
                });
            });
        });

        describe('when "map" is called', () => {
            let mapped: Sequence<string>;

            beforeEach(() => {
                mapped = sequence.map(element => element.name);
            });

            it('should return a new sequence', () => {
                expect(mapped).not.toEqual(sequence as any);
            });

            describe('when the sequence is iterated', () => {
                let expectation: string[];
                let actual: string[];

                beforeEach(() => {
                    expectation = beverages.map(element => element.name);
                    actual = [];
                    let current: IteratorResult<string, any>;
                    while (!(current = mapped.next()).done) {
                        actual.push(current.value as string);
                    }
                });

                it('should report the mapped elements', () => {
                    expect(actual.length).toEqual(expectation.length);
                    for (let i = 0; i < actual.length; i++) {
                        expect(actual[i]).toEqual(expectation[i]);
                    }
                });
            });

            describe('when the sequence is traversed', () => {
                let expectation: string[];
                let actual: string[];

                beforeEach(() => {
                    expectation = beverages.map(element => element.name);
                    actual = [];
                    mapped.forEach(element => actual.push(element));
                });

                it('should report the mapped elements', () => {
                    expect(actual.length).toEqual(expectation.length);
                    for (let i = 0; i < actual.length; i++) {
                        expect(actual[i]).toEqual(expectation[i]);
                    }
                });
            });
        });

        describe('when "skip" is called', () => {
            let skipped: Sequence<Beverage>;

            beforeEach(() => {
                skipped = sequence.skip(beverages.length - 1);
            });

            it('should return a new sequence', () => {
                expect(skipped).not.toEqual(sequence);
            });

            describe('when the sequence is iterated', () => {
                let expectation: Beverage[];
                let actual: Beverage[];

                beforeEach(() => {
                    expectation = [beverages[beverages.length - 1]];
                    actual = [];
                    let current: IteratorResult<Beverage, any>;
                    while (!(current = skipped.next()).done) {
                        actual.push(current.value as Beverage);
                    }
                });

                it('should have skipped the requested elements', () => {
                    expect(actual.length).toEqual(expectation.length);
                    for (let i = 0; i < actual.length; i++) {
                        expect(actual[i]).toEqual(expectation[i]);
                    }
                });
            });

            describe('when the sequence is traversed', () => {
                let expectation: Beverage[];
                let actual: Beverage[];

                beforeEach(() => {
                    expectation = [beverages[beverages.length - 1]];
                    actual = [];
                    skipped.forEach(element => actual.push(element));
                });

                it('should have skipped the requested elements', () => {
                    expect(actual.length).toEqual(expectation.length);
                    for (let i = 0; i < actual.length; i++) {
                        expect(actual[i]).toEqual(expectation[i]);
                    }
                });
            });
        });

        describe('when "sorted" is called', () => {
            let actual: Beverage[];
            let expected: Beverage[];

            beforeEach(() => {
                const comparator = (a: Beverage, b: Beverage) => a.cost - b.cost;
                expected = beverages.sort(comparator);
                actual = [];
                sequence.sorted(comparator).forEach(element => actual.push(element));
            });

            it('should traverse the sequence', () => {
                expect(actual.length).toEqual(beverages.length);
                for (let i = 0; i < actual.length; i++) {
                    expect(actual[i]).toEqual(expected[i]);
                }
            });
        });

        describe('when "forEach" is called', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = [];
                sequence.forEach(element => actual.push(element));
            });

            it('should traverse the sequence', () => {
                expect(actual.length).toEqual(beverages.length);
                for (let i = 0; i < actual.length; i++) {
                    expect(actual[i]).toEqual(beverages[i]);
                }
            });
        });

        describe('when "shortCircuit" is called', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = [];
                sequence.shortCircuit(element => actual.push(element));
            });

            it('should traverse the sequence', () => {
                expect(actual.length).toEqual(beverages.length);
                for (let i = 0; i < actual.length; i++) {
                    expect(actual[i]).toEqual(beverages[i]);
                }
            });

            describe('when a non ShortCircuitingError error is used to short circuit', () => {
                let error: Error;

                beforeEach(() => {
                    try {
                        of(beverages).shortCircuit(() => {
                            throw new Error('this is expected');
                        });
                    } catch (e) {
                        error = e;
                    }
                });

                it('should throw the error', () => {
                    expect(error).toBeDefined('no error was thrown');
                    expect(error instanceof ShortCircuitingError).toBeFalsy();
                });
            });
        });
    });
});
