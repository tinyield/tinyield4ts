export function assertSameArray<T>(actual: T[], expected: T[]): void {
    expect(actual.length).toEqual(expected.length);
    for (let i = 0; i < actual.length; i++) {
        expect(actual[i]).toEqual(expected[i]);
    }
}
