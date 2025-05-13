export function getRandomNumberInRange(max: number, count: number) {
    const min = 0;
    const unique = new Set<number>();

    while (unique.size < count) {
        let n = Math.floor(Math.random() * (max - min + 1)) + min;
        unique.add(n);
    }
    return Array.from(unique);
}

export function tryToGetRandomNumberInRange(size: number, counts: number, skipAxisIndex: number) {
    const location = getRandomNumberInRange(size * size - 1, counts);
    if (location.includes(skipAxisIndex)) {
        return tryToGetRandomNumberInRange(size, counts, skipAxisIndex);
    }
    return location;
}
