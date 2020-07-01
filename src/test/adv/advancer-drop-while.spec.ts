import {of, Query} from '../..';
import {Beverage, COFFEE, getDinnerBeverages, WINE} from '../model/beverage';
import {getResultFromIteration, getResultFromTraversal} from '../utils/traversal-utils';
import {assertSameArray} from '../utils/testing-utils';

describe('AdvancerDropWhile', () => {
    let dinnerBeverages: Beverage[];
    let dinnerBeveragesQuery: Query<Beverage>;

    beforeEach(() => {
        dinnerBeverages = getDinnerBeverages();
        dinnerBeveragesQuery = of(dinnerBeverages);
    });

    describe('when "dropWhile" is called', () => {
        let dropWhile: Query<Beverage>;
        let emptyDropWhile: Query<Beverage>;
        let expectation: Beverage[];

        beforeEach(() => {
            expectation = [WINE, COFFEE];
            dropWhile = dinnerBeveragesQuery.dropWhile(elem => elem.cost < 3);
            emptyDropWhile = of<Beverage>([]).dropWhile(elem => elem.cost < 3);
        });

        it('should return a new sequence', () => {
            expect(dropWhile).not.toEqual(dinnerBeveragesQuery);
        });

        describe('when the sequence is iterated', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = getResultFromIteration(dropWhile);
            });

            it('should have dropped the first elements that matched the predicate', () => {
                assertSameArray(actual, expectation);
            });
        });

        describe('when the sequence is traversed', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = getResultFromTraversal(dropWhile);
            });

            it('should have dropped the first elements that matched the predicate', () => {
                assertSameArray(actual, expectation);
            });
        });

        describe('when the sequence is empty', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = getResultFromIteration(emptyDropWhile);
            });

            it('should be empty', () => {
                assertSameArray(actual, []);
            });
        });
    });
});
