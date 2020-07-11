import {BEER, COLA, getDinnerBeverages, WINE} from '../model/beverage';
import {NumberQuery} from '../../lib/primitive/number-query';
import {Query} from '../../lib/query';
import {getResultFromIteration, getResultFromTraversal} from '../utils/traversal-utils';
import {assertSameArray} from '../utils/testing-utils';

describe('NumberQuery', () => {
    let dinnerBeverages: number[];

    beforeEach(() => {
        dinnerBeverages = getDinnerBeverages().map(beverage => beverage.cost);
    });

    describe('when "ofNumber" is called', () => {
        let dinnerBeveragesQuery: NumberQuery;

        beforeEach(() => {
            dinnerBeveragesQuery = NumberQuery.ofNumber(dinnerBeverages);
        });

        it('should return a sequence', () => {
            expect(dinnerBeveragesQuery).toBeDefined('dinnerBeveragesQuery is undefined');
        });

        describe('when "max" is called', () => {
            let actual: number;

            beforeEach(() => {
                actual = dinnerBeveragesQuery.max();
            });

            it('should find the max', () => {
                expect(actual).toBeDefined();
                expect(actual).toEqual(WINE.cost);
            });
        });

        describe('when "min" is called', () => {
            let actual: number;

            beforeEach(() => {
                actual = dinnerBeveragesQuery.min();
            });

            it('should find the min', () => {
                expect(actual).toBeDefined();
                expect(actual).toEqual(COLA.cost);
            });
        });

        describe('when "sum" is called', () => {
            let actual: number;

            beforeEach(() => {
                actual = dinnerBeveragesQuery.sum();
            });

            it('should return the sum', () => {
                expect(actual).toBeDefined();
                expect(actual).toEqual(dinnerBeverages.reduce((p, c) => p + c, 0));
            });
        });

        describe('when "average" is called', () => {
            let actual: number;
            let actualOnEmpty: number;

            beforeEach(() => {
                actual = dinnerBeveragesQuery.average();
                actualOnEmpty = NumberQuery.ofNumber([]).average();
            });

            it('should return the average', () => {
                expect(actual).toBeDefined();
                expect(actualOnEmpty).toBeUndefined();
                expect(actual).toEqual(dinnerBeverages.reduce((p, c) => p + c, 0) / dinnerBeverages.length);
            });
        });
    });

    describe('when "iterateNumber" is called', () => {
        let sequence: NumberQuery;

        beforeEach(() => {
            sequence = NumberQuery.iterateNumber(BEER.cost, cost => cost + 1);
        });

        it('should return a sequence', () => {
            expect(sequence).toBeDefined('sequence is undefined');
        });

        describe('when "take" is called', () => {
            let taken: Query<number>;
            let expectation: number[];

            beforeEach(() => {
                taken = sequence.take(2);
                expectation = [BEER.cost, BEER.cost + 1];
            });

            it('should return a new sequence', () => {
                expect(taken).not.toEqual(sequence);
            });

            describe('when the sequence is iterated', () => {
                let actual: number[];

                beforeEach(() => {
                    actual = getResultFromIteration(taken);
                });

                it('should have taken the requested number of elements', () => {
                    assertSameArray(actual, expectation);
                });
            });

            describe('when the sequence is traversed', () => {
                let actual: number[];

                beforeEach(() => {
                    actual = getResultFromTraversal(taken);
                });

                it('should have taken the requested number of elements', () => {
                    assertSameArray(actual, expectation);
                });
            });
        });

        describe('when "first" is called', () => {
            let actual: number;
            let expectation: number;

            beforeEach(() => {
                actual = sequence.first();
                expectation = BEER.cost;
            });

            it('should return the first element of the Query', () => {
                expect(actual).toBeDefined();
                expect(actual).toEqual(expectation);
            });
        });
    });

    describe('when "generateNumber" is called', () => {
        let sequence: NumberQuery;

        beforeEach(() => {
            sequence = NumberQuery.generateNumber(() => BEER.cost + 1);
        });

        it('should return a sequence', () => {
            expect(sequence).toBeDefined('sequence is undefined');
        });

        describe('when "take" is called', () => {
            let taken: Query<number>;
            let expectation: number[];

            beforeEach(() => {
                taken = sequence.take(2);
                expectation = [BEER.cost + 1, BEER.cost + 1];
            });

            it('should return a new sequence', () => {
                expect(taken).not.toEqual(sequence);
            });

            describe('when the sequence is iterated', () => {
                let actual: number[];

                beforeEach(() => {
                    actual = getResultFromIteration(taken);
                });

                it('should have taken the requested number of elements', () => {
                    assertSameArray(actual, expectation);
                });
            });

            describe('when the sequence is traversed', () => {
                let actual: number[];

                beforeEach(() => {
                    actual = getResultFromTraversal(taken);
                });

                it('should have taken the requested number of elements', () => {
                    assertSameArray(actual, expectation);
                });
            });
        });

        describe('when "first" is called', () => {
            let actual: number;
            let expectation: number;

            beforeEach(() => {
                actual = sequence.first();
                expectation = BEER.cost + 1;
            });

            it('should return the first element of the Query', () => {
                expect(actual).toBeDefined();
                expect(actual).toEqual(expectation);
            });
        });
    });

    describe('when "mapToNumber" is called', () => {
        let sequence: NumberQuery;

        beforeEach(() => {
            sequence = Query.generate(() => BEER).mapToNumber(beverage => beverage.cost + 1);
        });

        it('should return a sequence', () => {
            expect(sequence).toBeDefined('sequence is undefined');
        });

        describe('when "take" is called', () => {
            let taken: Query<number>;
            let expectation: number[];

            beforeEach(() => {
                taken = sequence.take(2);
                expectation = [BEER.cost + 1, BEER.cost + 1];
            });

            it('should return a new sequence', () => {
                expect(taken).not.toEqual(sequence);
            });

            describe('when the sequence is iterated', () => {
                let actual: number[];

                beforeEach(() => {
                    actual = getResultFromIteration(taken);
                });

                it('should have taken the requested number of elements', () => {
                    assertSameArray(actual, expectation);
                });
            });

            describe('when the sequence is traversed', () => {
                let actual: number[];

                beforeEach(() => {
                    actual = getResultFromTraversal(taken);
                });

                it('should have taken the requested number of elements', () => {
                    assertSameArray(actual, expectation);
                });
            });
        });

        describe('when "first" is called', () => {
            let actual: number;
            let expectation: number;

            beforeEach(() => {
                actual = sequence.first();
                expectation = BEER.cost + 1;
            });

            it('should return the first element of the Query', () => {
                expect(actual).toBeDefined();
                expect(actual).toEqual(expectation);
            });
        });
    });
});
