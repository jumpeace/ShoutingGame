// XY座標のクラス
export class Xy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// 任意の範囲を表すクラス
export class Range {
    constructor(min, max) {
        this.min = min;
        this.max = max;
        this.size = max - min;
    }
}

// int型で範囲を指定して乱数を生成
export function randInt(min, max) {
    const size = max - min + 1;
    return Math.floor(Math.random() * size) + min;
}

// float型で範囲を指定して乱数を生成
export function randFloat(min, max) {
    if (min === max) {
        return min;
    }
    const size = max - min;
    return Math.random() * size + min;
}