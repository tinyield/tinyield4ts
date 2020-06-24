import {of, Tinyield} from './tinyield';
import {TinyieldShortCircuitingError} from '../public-api';

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
        let sequence: Tinyield<Beverage>;
        let beerSequence: Tinyield<Beverage>;

        beforeEach(() => {
            sequence = of(beverages);
            beerSequence = of(packOfBeer);
        });

        it('should return a sequence', () => {
            expect(sequence).toBeDefined('sequence is undefined');
            expect(packOfBeer).toBeDefined('packOfBeer is undefined');
        });

        describe('when "filter" is called', () => {
            let filtered: Tinyield<Beverage>;

            beforeEach(() => {
                filtered = sequence.filter(element => element.cost > 1);
            });

            it('should return a new sequence', () => {
                expect(filtered).not.toEqual(sequence);
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
            let mapped: Tinyield<string>;

            beforeEach(() => {
                mapped = sequence.map(element => element.name);
            });

            it('should return a new sequence', () => {
                expect(mapped).not.toEqual(sequence as any);
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
            let skipped: Tinyield<Beverage>;

            beforeEach(() => {
                skipped = sequence.skip(beverages.length - 1);
            });

            it('should return a new sequence', () => {
                expect(skipped).not.toEqual(sequence);
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

        describe('when "take" is called', () => {
            let taken: Tinyield<Beverage>;

            beforeEach(() => {
                taken = sequence.take(2);
            });

            it('should return a new sequence', () => {
                expect(taken).not.toEqual(sequence);
            });

            describe('when the sequence is traversed', () => {
                let expectation: Beverage[];
                let actual: Beverage[];

                beforeEach(() => {
                    expectation = [beverages[0], beverages[1]];
                    actual = [];
                    taken.forEach(element => actual.push(element));
                });

                it('should have taken the requested number of elements', () => {
                    expect(actual.length).toEqual(expectation.length);
                    for (let i = 0; i < actual.length; i++) {
                        expect(actual[i]).toEqual(expectation[i]);
                    }
                });
            });
        });

        describe('when "distinct" is called', () => {
            let distinct: Tinyield<Beverage>;
            let distinctBeer: Tinyield<Beverage>;

            beforeEach(() => {
                distinct = sequence.distinct();
                distinctBeer = beerSequence.distinct();
            });

            it('should return a new sequences', () => {
                expect(distinct).not.toEqual(sequence);
                expect(distinctBeer).not.toEqual(beerSequence);
            });

            describe('when the sequences are traversed', () => {
                let expectation: Beverage[];
                let beerPackExpectation: Beverage[];
                let actual: Beverage[];
                let beerPackActual: Beverage[];

                beforeEach(() => {
                    expectation = beverages;
                    beerPackExpectation = [beer];
                    actual = [];
                    beerPackActual = [];
                    distinct.forEach(element => actual.push(element));
                    distinctBeer.forEach(element => beerPackActual.push(element));
                });

                it('should report the distinct elements', () => {
                    expect(actual.length).toEqual(expectation.length);
                    for (let i = 0; i < actual.length; i++) {
                        expect(actual[i]).toEqual(expectation[i]);
                    }

                    expect(beerPackActual.length).toEqual(beerPackExpectation.length);
                    for (let i = 0; i < beerPackActual.length; i++) {
                        expect(beerPackActual[i]).toEqual(beerPackExpectation[i]);
                    }
                });
            });
        });

        describe('when "union" is called', () => {
            let union: Tinyield<Beverage>;
            const hotChocolate = new Beverage('hot chocolate', 2);

            beforeEach(() => {
                union = sequence.union(beerSequence, of([hotChocolate]));
            });

            it('should return a new sequences', () => {
                expect(union).not.toEqual(sequence);
                expect(union).not.toEqual(beerSequence);
            });

            describe('when the sequences are traversed', () => {
                let expectation: Beverage[];
                let actual: Beverage[];

                beforeEach(() => {
                    expectation = [...beverages, beer, hotChocolate];
                    actual = [];
                    union.forEach(element => actual.push(element));
                });

                it('should report the union of both sequences', () => {
                    expect(actual.length).toEqual(expectation.length);
                    for (let i = 0; i < actual.length; i++) {
                        expect(actual[i]).toEqual(expectation[i]);
                    }
                });
            });
        });

        describe('when "then" is called', () => {
            let custom: Tinyield<Beverage>;
            beforeEach(() => {
                custom = sequence.then(previous => yld => {
                    let odd = false;
                    previous.forEach(element => {
                        if (odd) {
                            yld(element);
                        }
                        odd = !odd;
                    });
                });
            });

            it('should return a new sequence', () => {
                expect(custom).not.toEqual(sequence);
            });

            describe('when the sequence is traversed', () => {
                let expectation: Beverage[];
                let actual: Beverage[];

                beforeEach(() => {
                    expectation = [];
                    beverages.forEach((value, index) => {
                        if (index % 2 !== 0) {
                            expectation.push(value);
                        }
                    });
                    actual = [];
                    custom.forEach(element => actual.push(element));
                });

                it('should report elements', () => {
                    expect(actual.length).toEqual(expectation.length);
                    for (let i = 0; i < actual.length; i++) {
                        expect(actual[i]).toEqual(expectation[i]);
                    }
                });
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

        describe('when "shortCircuiting" is called', () => {
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

            describe('when a non TinyieldShortCircuitingError error is used to short circuit', () => {
                it('should throw the error', () => {
                    let error;
                    try {
                        sequence.shortCircuiting(element => {
                            throw new Error('this is expected');
                        });
                    } catch (e) {
                        error = e;
                    }
                    expect(error).toBeDefined('no error was thrown');
                    expect(error instanceof TinyieldShortCircuitingError).toBeFalsy();
                });
            });
        });
    });

    describe('when a sequence of sequences is created', () => {
        let sequence: Tinyield<Tinyield<Beverage>>;

        beforeEach(() => {
            const sequences: Array<Tinyield<Beverage>> = beverages.map(element => new Tinyield(yld1 => yld1(element)));
            sequence = new Tinyield<Tinyield<Beverage>>(yld => sequences.forEach(seq => yld(seq)));
        });

        it('should be defined', () => {
            expect(sequence).toBeDefined('sequence is undefined');
        });

        describe('when "flatMap" is called', () => {
            let flatMapped: Tinyield<string>;

            beforeEach(() => {
                flatMapped = sequence.flatMap(el1 => el1.map(element => element.name));
            });

            it('should return a new sequence', () => {
                expect(flatMapped).not.toEqual(sequence as any);
            });

            describe('when the sequence is traversed', () => {
                let expectation: string[];
                let actual: string[];

                beforeEach(() => {
                    expectation = beverages.map(element => element.name);
                    actual = [];
                    flatMapped.forEach(element => actual.push(element));
                });

                it('should report the mapped elements', () => {
                    expect(actual.length).toEqual(expectation.length);
                    for (let i = 0; i < actual.length; i++) {
                        expect(actual[i]).toEqual(expectation[i]);
                    }
                });
            });
        });
    });
});
