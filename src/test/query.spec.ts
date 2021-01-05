import {generate, iterate, of, Query} from '../lib/query';
import {SHORT_CIRCUITING_ERROR} from '..';
import {BEER, Beverage, COLA, getDinnerBeverages, getPackOfBeer, WINE} from './model/beverage';
import {getResultFromIteration, getResultFromTraversal} from './utils/traversal-utils';
import {assertSameArray} from './utils/testing-utils';
import {expect} from 'chai';

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
            expect(dinnerBeveragesQuery).to.not.be.undefined;
            expect(beerPackQuery).to.not.be.undefined;
        });

        describe('when "sorted" is called', () => {
            const comparator = (a: Beverage, b: Beverage) => a.cost - b.cost;
            let actual: Beverage[];
            let expected: Beverage[];

            beforeEach(() => {
                expected = [...dinnerBeverages].sort(comparator);
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

        describe('when "toSet" is called', () => {
            let actual: Set<Beverage>;
            let expected: Set<Beverage>;

            beforeEach(() => {
                expected = new Set(dinnerBeverages);
                actual = dinnerBeveragesQuery.toSet();
            });

            it('should traverse the sequence', () => {
                expect(actual.size).to.equal(expected.size);
                const actualIterator = actual.values();
                const expectedIterator = expected.values();
                for (let i = 0; i < actual.size; i++) {
                    expect(actualIterator.next().value).to.equal(expectedIterator.next().value);
                }
                expect(actualIterator.next().done).to.be.true;
                expect(expectedIterator.next().done).to.be.true;
            });
        });

        describe('when "collect" is called', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = dinnerBeveragesQuery.collect(
                    () => [],
                    (container, element) => container.push(element)
                );
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
                let error: unknown;

                beforeEach(() => {
                    try {
                        of(dinnerBeverages).shortCircuit(() => {
                            throw new Error('this is expected');
                        });
                    } catch (e) {
                        error = e;
                    }
                });

                it('should throw the error', () => {
                    expect(error).to.not.be.undefined;
                    expect(error).not.to.equal(SHORT_CIRCUITING_ERROR);
                });
            });
        });

        describe('when "max" is called', () => {
            let actual: Beverage;

            beforeEach(() => {
                actual = dinnerBeveragesQuery.max((a, b) => a.cost - b.cost);
            });

            it('should traverse the sequence', () => {
                expect(actual).to.not.be.undefined;
                expect(actual).to.equal(WINE);
            });
        });

        describe('when "min" is called', () => {
            let actual: Beverage;

            beforeEach(() => {
                actual = dinnerBeveragesQuery.min((a, b) => a.cost - b.cost);
            });

            it('should traverse the sequence', () => {
                expect(actual).to.not.be.undefined;
                expect(actual).to.equal(COLA);
            });
        });

        describe('when "sum" is called', () => {
            let actual: number;

            beforeEach(() => {
                actual = dinnerBeveragesQuery.sum(b => b.cost);
            });

            it('should return the sum', () => {
                expect(actual).to.not.be.undefined;
                expect(actual).to.equal(dinnerBeverages.reduce((p, c) => p + c.cost, 0));
            });
        });

        describe('when "average" is called', () => {
            let actual: number;
            let actualOnEmpty: number;

            beforeEach(() => {
                actual = dinnerBeveragesQuery.average(b => b.cost);
                actualOnEmpty = Query.of<Beverage>([]).average(undefined);
            });

            it('should return the average', () => {
                expect(actual).to.not.be.undefined;
                expect(actualOnEmpty).to.be.undefined;
                expect(actual).to.equal(dinnerBeverages.reduce((p, c) => p + c.cost, 0) / dinnerBeverages.length);
            });
        });

        describe('when "anyMatch" is called', () => {
            let positive: boolean;
            let negative: boolean;

            beforeEach(() => {
                positive = of(getDinnerBeverages()).anyMatch(beverage => beverage.cost === 2);
                negative = of(getDinnerBeverages()).anyMatch(beverage => beverage.cost === 4);
            });

            describe('when a match is made', () => {
                it('should return true', () => expect(positive).to.be.true);
            });

            describe("when a match isn't made", () => {
                it('should return false', () => expect(negative).to.be.false);
            });
        });

        describe('when "allMatch" is called', () => {
            let positive: boolean;
            let negative: boolean;

            beforeEach(() => {
                positive = of(getDinnerBeverages()).allMatch(beverage => beverage.cost < 4);
                negative = of(getDinnerBeverages()).allMatch(beverage => beverage.cost < 2);
            });

            describe('when all match', () => {
                it('should return true', () => expect(positive).to.be.true);
            });

            describe('when not all match', () => {
                it('should return false', () => expect(negative).to.be.false);
            });
        });

        describe('when "noneMatch" is called', () => {
            let positive: boolean;
            let negative: boolean;

            beforeEach(() => {
                positive = of(getDinnerBeverages()).noneMatch(beverage => beverage.cost >= 4);
                negative = of(getDinnerBeverages()).noneMatch(beverage => beverage.cost < 4);
            });

            describe('when none match', () => {
                it('should return true', () => expect(positive).to.be.true);
            });

            describe('when any match', () => {
                it('should return false', () => expect(negative).to.be.false);
            });
        });

        describe('when "count" is called', () => {
            let actual: number;
            let expectation: number;

            beforeEach(() => {
                actual = dinnerBeveragesQuery.count();
                expectation = 3;
            });

            it('should return the element count for the Query', () => {
                expect(actual).to.not.be.undefined;
                expect(actual).to.equal(expectation);
            });
        });

        describe('when "reduce" is called', () => {
            let actual: number;
            let actualWIdentity: number;
            let expectation: number;

            beforeEach(() => {
                actual = of(getDinnerBeverages())
                    .map(beverage => beverage.cost)
                    .reduce((acc, curr) => acc + curr);
                actualWIdentity = of(getDinnerBeverages())
                    .map(beverage => beverage.cost)
                    .reduce((acc, curr) => acc + curr, 0);
                expectation = 6;
            });

            it("should return the result of the Query's reduction", () => {
                expect(actual).to.not.be.undefined;
                expect(actualWIdentity).to.not.be.undefined;
                expect(actual).to.equal(actualWIdentity);
                expect(actual).to.equal(expectation);
            });
        });

        describe('when "join" is called', () => {
            let actual: string;
            let expectation: string;

            beforeEach(() => {
                actual = of(getDinnerBeverages()).join();
                expectation = getDinnerBeverages()
                    .map(elem => JSON.stringify(elem))
                    .reduce((p, c) => p + c);
            });

            it("should return the Query's elements joined", () => {
                expect(actual).to.not.be.undefined;
                expect(actual).to.equal(expectation);
            });
        });
    });

    describe('when "iterate" is called', () => {
        let sequence: Query<Beverage>;

        beforeEach(() => {
            sequence = iterate(BEER, beverage => new Beverage(beverage.name, beverage.cost + 1)).take(10);
        });

        it('should return a sequence', () => {
            expect(sequence).to.not.be.undefined;
        });

        describe('when "take" is called', () => {
            let taken: Query<Beverage>;
            let expectation: Beverage[];

            beforeEach(() => {
                taken = sequence.take(2);
                expectation = [BEER, new Beverage(BEER.name, BEER.cost + 1)];
            });

            it('should return a new sequence', () => {
                expect(taken).not.to.equal(sequence);
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

        describe('when "first" is called', () => {
            let actual: Beverage;
            let expectation: Beverage;

            beforeEach(() => {
                actual = sequence.first();
                expectation = BEER;
            });

            it('should return the first element of the Query', () => {
                expect(actual).to.not.be.undefined;
                expect(actual).to.deep.equal(expectation);
            });
        });

        describe('when "count" is called', () => {
            let actual: number;
            let expectation: number;

            beforeEach(() => {
                actual = sequence.count();
                expectation = 10;
            });

            it('should return the size of the Query', () => {
                expect(actual).to.not.be.undefined;
                expect(actual).to.deep.equal(expectation);
            });
        });
    });

    describe('when "generate" is called', () => {
        let sequence: Query<Beverage>;

        beforeEach(() => {
            sequence = generate(() => new Beverage(BEER.name, BEER.cost + 1));
        });

        it('should return a sequence', () => {
            expect(sequence).to.not.be.undefined;
        });

        describe('when "take" is called', () => {
            let taken: Query<Beverage>;
            let expectation: Beverage[];

            beforeEach(() => {
                taken = sequence.take(2);
                expectation = [new Beverage(BEER.name, BEER.cost + 1), new Beverage(BEER.name, BEER.cost + 1)];
            });

            it('should return a new sequence', () => {
                expect(taken).not.to.equal(sequence);
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

        describe('when "first" is called', () => {
            let actual: Beverage;
            let expectation: Beverage;

            beforeEach(() => {
                actual = sequence.first();
                expectation = new Beverage(BEER.name, BEER.cost + 1);
            });

            it('should return the first element of the Query', () => {
                expect(actual).to.not.be.undefined;
                expect(actual).to.deep.equal(expectation);
            });
        });
    });

    describe('when "first" is called on an empty Query', () => {
        let actual: Beverage;

        beforeEach(() => {
            actual = Query.of([]).first();
        });

        it('should return undefined', () => {
            expect(actual).to.be.undefined;
        });
    });
});
