import {Query} from '../../lib/query';
import {BEER, Beverage, COFFEE, COLA, WINE} from '../model/beverage';
import {getResultFromIteration, getResultFromTraversal} from '../utils/traversal-utils';
import {assertSameArray} from '../utils/testing-utils';
import {expect} from 'chai';

describe('AdvancerFlatmap', () => {
    describe('when "flatMap" is called', () => {
        let flatMapped: Query<Beverage>;
        let sequenceOfSequences: Query<Query<Beverage>>;
        const expectation: Beverage[] = [BEER, COFFEE, COLA, WINE];
        beforeEach(() => {
            sequenceOfSequences = Query.of(expectation).map(beverage => Query.of([beverage]));
            flatMapped = sequenceOfSequences.flatMap(t => t);
        });

        it('should return a new sequence', () => {
            expect(flatMapped).not.to.equal(sequenceOfSequences as unknown);
        });

        describe('when the sequence is iterated', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = getResultFromIteration(flatMapped);
            });

            it('should report elements', () => {
                assertSameArray(actual, expectation);
            });
        });

        describe('when the sequence is traversed', () => {
            let actual: Beverage[];

            beforeEach(() => {
                actual = getResultFromTraversal(flatMapped);
            });

            it('should report elements', () => {
                assertSameArray(actual, expectation);
            });
        });
    });
});
