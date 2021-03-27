
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

//rng
function randInt(min, max) {
    return min + Math.floor(Math.random() * Math.floor(max - min));
}

function randFrom(array) {
    return array[randInt(0, array.length - 1)];
}


module.exports = {
    shuffle,
    randInt,
    randFrom,

}