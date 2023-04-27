// ゲームの値設定ファイル

// プレイヤーの弾の設定
const playerShots = {
    // 速度
    speed: 10,
    // 回復時間
    shotResolveFrameNum: 60,
    // 弾数上限
    shotMax: 6,
}

// 岩の設定
const rock = {
    // 落下速度の下限
    speedYRangeMin: 1,
    // 落下速度の上限
    speedYRangeMax: 2,
    // 角度の上限
    slopeMax: 1,
    // 発生時間の下限
    intervalMin: 10,
    // 発生時間の下限
    intervalMax: 20,
}

// ロケットの設定
const rocket = {
    // 落下速度の下限
    speedYRangeMin: 3,
    // 落下速度の上限
    speedYRangeMax: 6,
    // 角度の上限
    slopeMax: 0,
    // 発生時間の下限
    intervalMin: 20,
    // 発生時間の下限
    intervalMax: 40,
}

const centerRatio = 1.0;

export default {
    playerShots: playerShots,
    rock: rock,
    rocket: rocket,
    centerRatio: centerRatio,
}