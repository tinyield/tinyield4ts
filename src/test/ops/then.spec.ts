import {SHORT_CIRCUITING_ERROR} from '../../lib/error/short-circuiting-error';
import {Traverser} from '../../lib/traverser';
import {Query} from '../../lib/query';
import {getResultFromIteration, getResultFromTraversal} from '../utils/traversal-utils';
import {assertSameArray} from '../utils/testing-utils';
import {expect} from 'chai';
import {Advancer} from '../../lib/advancer';

describe('Then', () => {
    const arrange = [7, 7, 8, 9, 9, 11, 11, 7];

    function collapseTrv<T>(src: Query<T>): Traverser<T> {
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

    function collapseAdv<T>(src: Query<T>): Advancer<T> {
        let prev: T;
        return yld => {
            let curr: T;
            while (src.tryAdvance(item => (curr = item))) {
                if (prev === undefined || prev !== curr) {
                    prev = curr;
                    yld(curr);
                    return true;
                }
            }
            return false;
        };
    }

    describe('when "then" is called', () => {
        let custom: Query<number>;
        let customWOAdvancer: Query<number>;
        let expectation: number[];

        beforeEach(() => {
            expectation = [7, 9, 11, 7];
            customWOAdvancer = Query.of(arrange)
                .then(n => collapseTrv(n))
                .filter(n => n % 2 !== 0);
            custom = Query.of(arrange)
                .then(
                    n => collapseTrv(n),
                    n => collapseAdv(n)
                )
                .filter(n => n % 2 !== 0);
        });

        it('should return a sequence', () => {
            expect(custom).to.not.be.undefined;
        });

        describe('when the sequence is iterated', () => {
            let actual: number[];

            beforeEach(() => {
                actual = getResultFromIteration(custom);
            });

            it('should report elements', () => {
                assertSameArray(actual, expectation);
            });
            describe('when the sequence has no Advancer', () => {
                it('should throw an error', () => {
                    let actual: Error;
                    try {
                        getResultFromIteration(customWOAdvancer);
                    } catch (e) {
                        actual = e;
                    }
                    expect(actual).to.not.be.undefined;
                });

                describe('when allMatch is called', () => {
                    let actual: boolean;

                    beforeEach(() => {
                        actual = customWOAdvancer.allMatch(i => i > 0);
                    });

                    it('should report true', () => {
                        expect(actual).to.be.true;
                    });
                });

                describe('when anyMatch is called', () => {
                    let actual: boolean;

                    beforeEach(() => {
                        actual = customWOAdvancer.anyMatch(i => i > 0);
                    });

                    it('should report true', () => {
                        expect(actual).to.be.true;
                    });
                });
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
                expect(actual).to.equal(firstExpectation);
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
                expect(taken).not.to.equal(custom);
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
        let customWOAdvancer: Query<number>;

        beforeEach(() => {
            let index = 0;
            custom = Query.iterate(arrange[index], () => {
                index++;
                return arrange[index % arrange.length];
            })
                .then(
                    n => collapseTrv(n),
                    n => collapseAdv(n)
                )
                .filter(n => n % 2 !== 0);
            customWOAdvancer = Query.iterate(arrange[index], () => {
                index++;
                return arrange[index % arrange.length];
            })
                .then(n => collapseTrv(n))
                .filter(n => n % 2 !== 0);
        });

        it('should return a sequence', () => {
            expect(custom).to.not.be.undefined;
            expect(customWOAdvancer).to.not.be.undefined;
        });

        describe('when the sequence has no Advancer', () => {
            it('should throw an error', () => {
                let actual: Error;
                try {
                    getResultFromIteration(customWOAdvancer);
                } catch (e) {
                    actual = e;
                }
                expect(actual).to.not.be.undefined;
            });

            describe('when anyMatch is called', () => {
                let actual: boolean;

                beforeEach(() => {
                    actual = customWOAdvancer.anyMatch(i => i > 10);
                });

                it('should report true', () => {
                    expect(actual).to.be.true;
                });
            });
        });

        describe('when first is called', () => {
            let expectation: number;
            let actual: number;

            beforeEach(() => {
                expectation = 7;
                actual = custom.first();
            });

            it('should report the expected number', () => {
                expect(actual).to.equal(expectation);
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
                expect(taken).not.to.equal(custom);
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
        let customWOAdvancer: Query<number>;

        beforeEach(() => {
            let index = 0;
            custom = Query.generate(() => {
                const result = arrange[index % arrange.length];
                index++;
                return result;
            }).then(
                n => collapseTrv(n),
                n => collapseAdv(n)
            );
            customWOAdvancer = Query.generate(() => {
                const result = arrange[index % arrange.length];
                index++;
                return result;
            })
                .then(n => collapseTrv(n))
                .filter(n => n % 2 !== 0);
        });

        it('should return a sequence', () => {
            expect(custom).to.not.be.undefined;
            expect(customWOAdvancer).to.not.be.undefined;
        });

        describe('when the sequence has no Advancer', () => {
            it('should throw an error', () => {
                let actual: Error;
                try {
                    getResultFromIteration(customWOAdvancer);
                } catch (e) {
                    actual = e;
                }
                expect(actual).to.not.be.undefined;
            });

            describe('when anyMatch is called', () => {
                let actual: boolean;

                beforeEach(() => {
                    actual = customWOAdvancer.anyMatch(i => i > 10);
                });

                it('should report true', () => {
                    expect(actual).to.be.true;
                });
            });
        });

        describe('when first is called', () => {
            let expectation: number;
            let actual: number;

            beforeEach(() => {
                expectation = 7;
                actual = custom.first();
            });

            it('should report the expected number', () => {
                expect(actual).to.equal(expectation);
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
                expect(taken).not.to.equal(custom);
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
                expect(taken).not.to.equal(custom);
            });

            describe('when the sequence is iterated', () => {
                let actual: number[];
                let error: unknown;

                beforeEach(() => {
                    try {
                        actual = getResultFromIteration(taken);
                    } catch (e) {
                        error = e;
                    }
                });

                it('should re-throw the error', () => {
                    expect(error).to.not.be.undefined;
                    expect(error).not.to.equal(SHORT_CIRCUITING_ERROR);
                    expect(actual).to.be.undefined;
                });
            });

            describe('when the sequence is traversed', () => {
                let actual: number[];
                let error: unknown;

                beforeEach(() => {
                    try {
                        actual = getResultFromTraversal(taken);
                    } catch (e) {
                        error = e;
                    }
                });

                it('should re-throw the error', () => {
                    expect(error).to.not.be.undefined;
                    expect(error).not.to.equal(SHORT_CIRCUITING_ERROR);
                    expect(actual).to.be.undefined;
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
                expect(actualMatch).to.be.true;
            });

            it('should return false when no matches are found', () => {
                expect(actualNoMatch).to.be.false;
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
                expect(actualMatch).to.be.true;
            });

            it('should return false when no matches are found', () => {
                expect(actualNoMatch).to.be.false;
            });
        });
    });
});
