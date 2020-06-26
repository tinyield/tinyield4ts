import {iterate, of, Query} from '../lib/query';
import {ShortCircuitingError} from '../lib/error/short-circuiting-error';
import {BEER, Beverage, getDinnerBeverages, getPackOfBeer} from './model/beverage';
import {getResultFromIteration, getResultFromTraversal} from './utils/traversal-utils';
import {assertSameArray} from './utils/testing-utils';

describe('Query', () => {
    let dinnerBeverages: Beverage[];
    let packOfBeer: Beverage[];

    beforeEach(() => {
        dinnerBeverages = getDinnerBeverages();
        packOfBeer = getPackOfBeer();
    });

    describe('when "of" is called', () => {
        let dinnerBeveragesQuery: Query<Beverage>;
        let beerPackQuery: Query<Beverage>;

        beforeEach(() => {
            dinnerBeveragesQuery = of(dinnerBeverages);
            beerPackQuery = of(packOfBeer);
        });

        it('should return a sequence', () => {
            expect(dinnerBeveragesQuery).toBeDefined('dinnerBeveragesQuery is undefined');
            expect(beerPackQuery).toBeDefined('beerPackQuery is undefined');
        });

        describe('when "sorted" is called', () => {
            const comparator = (a: Beverage, b: Beverage) => a.cost - b.cost;
            let actual: Beverage[];
            let expected: Beverage[];

            beforeEach(() => {
                expected = dinnerBeverages.sort(comparator);
                actual = getResultFromTraversal(dinnerBeveragesQuery.sorted(comparator));
            });

            it('should traverse the sequence', () => {
                assertSameArray(actual, expected);
            });
        });

        describe('when "forEach" is called', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = [];
                dinnerBeveragesQuery.forEach(element => actual.push(element));
            });

            it('should traverse the sequence', () => {
                assertSameArray(actual, dinnerBeverages);
            });
        });

        describe('when "shortCircuit" is called', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = [];
                dinnerBeveragesQuery.shortCircuit(element => actual.push(element));
            });

            it('should traverse the sequence', () => {
                assertSameArray(actual, dinnerBeverages);
            });

            describe('when a non ShortCircuitingError error is used to short circuit', () => {
                let error: Error;

                beforeEach(() => {
                    try {
                        of(dinnerBeverages).shortCircuit(() => {
                            throw new Error('this is expected');
                        });
                    } catch (e) {
                        error = e as any;
                    }
                });

                it('should throw the error', () => {
                    expect(error).toBeDefined('no error was thrown');
                    expect(error instanceof ShortCircuitingError).toBeFalsy();
                });
            });
        });
    });

    describe('when "iterate" is called', () => {
        let sequence: Query<Beverage>;

        beforeEach(() => {
            sequence = iterate(BEER, beverage => new Beverage(beverage.name, beverage.cost + 1));
        });

        it('should return a sequence', () => {
            expect(sequence).toBeDefined('sequence is undefined');
        });

        describe('when "take" is called', () => {
            let taken: Query<Beverage>;
            let expectation: Beverage[];

            beforeEach(() => {
                taken = sequence.take(2);
                expectation = [BEER, new Beverage(BEER.name, BEER.cost + 1)];
            });

            it('should return a new sequence', () => {
                expect(taken).not.toEqual(sequence);
            });

            describe('when the sequence is iterated', () => {
                let actual: Beverage[];

                beforeEach(() => {
                    actual = getResultFromIteration(taken);
                });

                it('should have taken the requested number of elements', () => {
                    assertSameArray(actual, expectation);
                });
            });

            describe('when the sequence is traversed', () => {
                let actual: Beverage[];

                beforeEach(() => {
                    actual = getResultFromTraversal(taken);
                });

                it('should have taken the requested number of elements', () => {
                    assertSameArray(actual, expectation);
                });
            });
        });
    });
});