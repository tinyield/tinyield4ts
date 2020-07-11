import {of, Query} from '../../lib/query';
import {Beverage, COLA, getDinnerBeverages} from '../model/beverage';
import {getResultFromIteration, getResultFromTraversal} from '../utils/traversal-utils';
import {assertSameArray} from '../utils/testing-utils';

describe('AdvancerTakeWhile', () => {
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
            expect(taken).not.toEqual(dinnerBeveragesQuery);
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
