

export function shuffle<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

//rng
export function randInt(min: number, max: number) {
    return min + Math.floor(Math.random() * Math.floor(max - min));
}

export function randFrom<T>(array: T[]) {
    return array[randInt(0, array.length - 1)];
}

