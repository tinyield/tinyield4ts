import {of, Query} from '../../lib/query';
import {Beverage, getDinnerBeverages} from '../model/beverage';
import {getResultFromIteration, getResultFromTraversal} from '../utils/traversal-utils';
import {assertSameArray} from '../utils/testing-utils';

describe('AdvancerFilter', () => {
    let dinnerBeverages: Beverage[];
    let dinnerBeveragesQuery: Query<Beverage>;

    beforeEach(() => {
        dinnerBeverages = getDinnerBeverages();
        dinnerBeveragesQuery = of(dinnerBeverages);
    });

    describe('when "filter" is called', () => {
        let filtered: Query<Beverage>;
        let expectation: Beverage[];

        beforeEach(() => {
            expectation = dinnerBeverages.filter(element => element.cost > 1);
            filtered = dinnerBeveragesQuery.filter(element => element.cost > 1);
        });

        it('should return a new sequence', () => {
            expect(filtered).not.toEqual(dinnerBeveragesQuery);
        });

        describe('when the sequence is iterated', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = getResultFromIteration(filtered);
            });

            it('should only have the filtered elements', () => {
                assertSameArray(actual, expectation);
            });
        });

        describe('when the sequence is traversed', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = getResultFromTraversal(filtered);
            });

            it('should only have the filtered elements', () => {
                assertSameArray(actual, expectation);
            });
        });
    });
});
