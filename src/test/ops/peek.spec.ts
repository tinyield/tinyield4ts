import {of, Query} from '../../lib/query';
import {Beverage, getDinnerBeverages} from '../model/beverage';
import {getResultFromIteration, getResultFromTraversal} from '../utils/traversal-utils';
import {assertSameArray} from '../utils/testing-utils';
import {expect} from 'chai';

describe('Peek', () => {
    let dinnerBeverages: Beverage[];
    let dinnerBeveragesQuery: Query<Beverage>;

    beforeEach(() => {
        dinnerBeverages = getDinnerBeverages();
        dinnerBeveragesQuery = of(dinnerBeverages);
    });

    describe('when "peek" is called', () => {
        let peeked: Query<Beverage>;
        let peekedActual: string[];
        let peekedExpectation: string[];
        let expectation: Beverage[];

        beforeEach(() => {
            expectation = dinnerBeverages;
            peekedExpectation = expectation.map(elem => elem.name);
            peekedActual = [];
            peeked = dinnerBeveragesQuery.peek(element => peekedActual.push(element.name));
        });

        it('should return a new sequence', () => {
            expect(peeked).not.to.equal(dinnerBeveragesQuery as unknown);
        });

        describe('when the sequence is iterated', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = getResultFromIteration(peeked);
            });

            it('should report the mapped elements', () => {
                assertSameArray(actual, expectation);
                assertSameArray(peekedActual, peekedExpectation);
            });
        });

        describe('when the sequence is traversed', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = getResultFromTraversal(peeked);
            });

            it('should report the mapped elements', () => {
                assertSameArray(actual, expectation);
                assertSameArray(peekedActual, peekedExpectation);
            });
        });
    });
});
