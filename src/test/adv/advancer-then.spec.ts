import {SHORT_CIRCUITING_ERROR} from '../../lib/error/short-circuiting-error';
import {Traverser} from '../../lib/traverser';
import {Query} from '../../lib/query';
import {getResultFromIteration, getResultFromTraversal} from '../utils/traversal-utils';
import {assertSameArray} from '../utils/testing-utils';

describe('AdvancerThen', () => {
    const arrange = [7, 7, 8, 9, 9, 11, 11, 7];

    function collapse<T>(src: Query<T>): Traverser<T> {
        return yld => {
            let prev: T;
            src.forEach(item => {
                if (prev === undefined || prev !== item) {
                    prev = item;
                    yld(item);
                }
            });
        };
    }

    describe('when "then" is called', () => {
        let custom: Query<number>;
        let expectation: number[];

        beforeEach(() => {
            expectation = [7, 9, 11, 7];
            custom = Query.of(arrange)
                .then(n => collapse(n))
                .filter(n => n % 2 !== 0);
        });

        it('should return a sequence', () => {
            expect(custom).toBeDefined();
        });

        describe('when the sequence is iterated', () => {
            let actual: number[];

            beforeEach(() => {
                actual = getResultFromIteration(custom);
            });

            it('should report elements', () => {
                assertSameArray(actual, expectation);
            });
        });

        describe('when the sequence is traversed', () => {
            let actual: number[];

            beforeEach(() => {
                actual = getResultFromTraversal(custom);
            });

            it('should report elements', () => {
                assertSameArray(actual, expectation);
            });
        });

        describe('when first is called', () => {
            let firstExpectation: number;
            let actual: number;

            beforeEach(() => {
                firstExpectation = 7;
                actual = custom.first();
            });

            it('should report the expected number', () => {
                expect(actual).toEqual(firstExpectation);
            });
        });

        describe('when "take" is called', () => {
            let taken: Query<number>;
            let takeExpectation: number[];

            beforeEach(() => {
                takeExpectation = [7, 9];
                taken = custom.take(2);
            });

            it('should return a new sequence', () => {
                expect(taken).not.toEqual(custom);
            });

            describe('when the sequence is iterated', () => {
                let actual: number[];

                beforeEach(() => {
                    actual = getResultFromIteration(taken);
                });

                it('should have taken the requested number of elements', () => {
                    assertSameArray(actual, takeExpectation);
                });
            });

            describe('when the sequence is traversed', () => {
                let actual: number[];

                beforeEach(() => {
                    actual = getResultFromTraversal(taken);
                });

                it('should have taken the requested number of elements', () => {
                    assertSameArray(actual, takeExpectation);
                });
            });
        });
    });

    describe('when "then" is called in an "iterate" query', () => {
        let custom: Query<number>;

        beforeEach(() => {
            let index = 0;
            custom = Query.iterate(arrange[index], elem => {
                index++;
                return arrange[index % arrange.length];
            })
                .then(n => collapse(n))
                .filter(n => n % 2 !== 0);
        });

        it('should return a sequence', () => {
            expect(custom).toBeDefined();
        });

        describe('when first is called', () => {
            let expectation: number;
            let actual: number;

            beforeEach(() => {
                expectation = 7;
                actual = custom.first();
            });

            it('should report the expected number', () => {
                expect(actual).toEqual(expectation);
            });
        });

        describe('when "take" is called', () => {
            let taken: Query<number>;
            let expectation: number[];

            beforeEach(() => {
                expectation = [7, 9];
                taken = custom.take(2);
            });

            it('should return a new sequence', () => {
                expect(taken).not.toEqual(custom);
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
    });

    describe('when "then" is called in an "generate" query', () => {
        let custom: Query<number>;

        beforeEach(() => {
            let index = 0;
            custom = Query.generate(() => {
                const result = arrange[index % arrange.length];
                index++;
                return result;
            }).then(n => collapse(n));
        });

        it('should return a sequence', () => {
            expect(custom).toBeDefined();
        });

        describe('when first is called', () => {
            let expectation: number;
            let actual: number;

            beforeEach(() => {
                expectation = 7;
                actual = custom.first();
            });

            it('should report the expected number', () => {
                expect(actual).toEqual(expectation);
            });
        });

        describe('when "takeWhile" is called', () => {
            let taken: Query<number>;
            let expectation: number[];

            beforeEach(() => {
                expectation = [7, 8, 9, 11, 7, 8, 9, 11, 7, 8, 9, 11];
                let index = -1;
                taken = custom.takeWhile(() => {
                    index++;
                    return index < 12;
                });
            });

            it('should return a new sequence', () => {
                expect(taken).not.toEqual(custom);
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

        describe('when an error is thrown', () => {
            let taken: Query<number>;

            beforeEach(() => {
                taken = custom
                    .takeWhile(() => {
                        throw new Error('expected error');
                    })
                    .then(source => yld => source.traverse(yld));
            });

            it('should return a new sequence', () => {
                expect(taken).not.toEqual(custom);
            });

            describe('when the sequence is iterated', () => {
                let actual: number[];
                let error: any;

                beforeEach(() => {
                    try {
                        actual = getResultFromIteration(taken);
                    } catch (e) {
                        error = e;
                    }
                });

                it('should re-throw the error', () => {
                    expect(error).toBeDefined();
                    expect(error).not.toEqual(SHORT_CIRCUITING_ERROR);
                    expect(actual).toBeUndefined();
                });
            });

            describe('when the sequence is traversed', () => {
                let actual: number[];
                let error: any;

                beforeEach(() => {
                    try {
                        actual = getResultFromTraversal(taken);
                    } catch (e) {
                        error = e;
                    }
                });

                it('should re-throw the error', () => {
                    expect(error).toBeDefined();
                    expect(error).not.toEqual(SHORT_CIRCUITING_ERROR);
                    expect(actual).toBeUndefined();
                });
            });
        });

        describe('when "anyMatch" is called', () => {
            let actualMatch: boolean;
            let actualNoMatch: boolean;

            beforeEach(() => {
                actualMatch = custom.take(2).anyMatch(elem => elem === 7);
                actualNoMatch = custom.take(2).anyMatch(elem => elem === 11);
            });

            it('should return true when matched', () => {
                expect(actualMatch).toBeTruthy();
            });

            it('should return false when no matches are found', () => {
                expect(actualNoMatch).toBeFalsy();
            });
        });

        describe('when "allMatch" is called', () => {
            let actualMatch: boolean;
            let actualNoMatch: boolean;

            beforeEach(() => {
                actualMatch = custom.take(2).allMatch(elem => elem < 20);
                actualNoMatch = custom.take(2).allMatch(elem => elem === 11);
            });

            it('should return true when matched', () => {
                expect(actualMatch).toBeTruthy();
            });

            it('should return false when no matches are found', () => {
                expect(actualNoMatch).toBeFalsy();
            });
        });
    });
});
