import {of, Query} from '../../lib/query';
import {Beverage, getDinnerBeverages} from '../model/beverage';
import {getResultFromIteration, getResultFromTraversal} from '../utils/traversal-utils';
import {assertSameArray} from '../utils/testing-utils';

describe('AdvancerSkip', () => {
    let dinnerBeverages: Beverage[];
    let dinnerBeveragesQuery: Query<Beverage>;

    beforeEach(() => {
        dinnerBeverages = getDinnerBeverages();
        dinnerBeveragesQuery = of(dinnerBeverages);
    });

    describe('when "skip" is called', () => {
        let skipped: Query<Beverage>;
        let expectation: Beverage[];

        beforeEach(() => {
            expectation = [dinnerBeverages[dinnerBeverages.length - 1]];
            skipped = dinnerBeveragesQuery.skip(dinnerBeverages.length - 1);
        });

        it('should return a new sequence', () => {
            expect(skipped).not.toEqual(dinnerBeveragesQuery);
        });

        describe('when the sequence is iterated', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = getResultFromIteration(skipped);
            });

            it('should have skipped the requested elements', () => {
                assertSameArray(actual, expectation);
            });
        });

        describe('when the sequence is traversed', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = getResultFromTraversal(skipped);
            });

            it('should have skipped the requested elements', () => {
                assertSameArray(actual, expectation);
            });
        });
    });
});
