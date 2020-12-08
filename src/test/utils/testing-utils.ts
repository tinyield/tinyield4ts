import {expect} from 'chai';

export function assertSameArray<T>(actual: T[], expected: T[]): void {
    expect(actual.length).to.equal(expected.length);
    for (let i = 0; i < actual.length; i++) {
        expect(actual[i]).to.deep.equal(expected[i]);
    }
}
