import {of, Query} from '../../lib/query';
import {Beverage, COLA, getDinnerBeverages} from '../model/beverage';
import {getResultFromIteration, getResultFromTraversal} from '../utils/traversal-utils';
import {assertSameArray} from '../utils/testing-utils';
import {expect} from 'chai';

describe('TakeWhile', () => {
    let dinnerBeverages: Beverage[];
    let dinnerBeveragesQuery: Query<Beverage>;

    beforeEach(() => {
        dinnerBeverages = getDinnerBeverages();
        dinnerBeveragesQuery = of(dinnerBeverages);
    });

    describe('when "takeWhile" is called', () => {
        let taken: Query<Beverage>;
        let expectation: Beverage[];

        beforeEach(() => {
            expectation = [COLA];
            taken = dinnerBeveragesQuery.takeWhile(elem => elem.cost < 2);
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
                let actual = false;

                beforeEach(() => {
                    taken.traverse(() => (actual = true));
                });

                it('should do nothing', () => {
                    expect(actual).to.be.false;
                });
            });
        });
    });
});
