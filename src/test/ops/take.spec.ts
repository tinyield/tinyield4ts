import {of, Query} from '../../lib/query';
import {Beverage, getDinnerBeverages} from '../model/beverage';
import {getResultFromIteration, getResultFromTraversal} from '../utils/traversal-utils';
import {assertSameArray} from '../utils/testing-utils';
import {expect} from 'chai';

describe('Take', () => {
    let dinnerBeverages: Beverage[];
    let dinnerBeveragesQuery: Query<Beverage>;

    beforeEach(() => {
        dinnerBeverages = getDinnerBeverages();
        dinnerBeveragesQuery = of(dinnerBeverages);
    });

    describe('when "take" is called', () => {
        let taken: Query<Beverage>;
        let expectation: Beverage[];

        beforeEach(() => {
            expectation = [dinnerBeverages[0], dinnerBeverages[1]];
            taken = dinnerBeveragesQuery.take(2).take(3);
        });

        it('should return a new sequence', () => {
            expect(taken).not.to.equal(dinnerBeveragesQuery);
        });

        describe('when the sequence is iterated', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = getResultFromIteration(taken);
            });

            it('should have taken the requested number of elements', () => {
                assertSameArray(actual, expectation);
            });

            describe('after the sequence is iterated, when tryAdvance is called', () => {
                it('should return false', () => {
                    expect(taken.tryAdvance(() => {})).to.be.false;
                });
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

            describe('after the sequence is traversed, when traverse is called', () => {
                let actual: Error;

                beforeEach(() => {
                    try {
                        const query = Query.of([1, 2, 3, 4]).take(2);
                        query.traverse(() => {});
                        query.traverse(() => {});
                    } catch (e) {
                        actual = e;
                    }
                });

                it('should throw an error', () => {
                    expect(actual).to.not.be.undefined;
                });
            });
        });
    });
});
