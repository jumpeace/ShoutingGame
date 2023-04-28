import Object from "./object.mjs";

// プレイヤーの管理クラス
export default class Creature extends Object {
    // プレイヤーを生成
    // p: p5.js のクラス
    // imageInfo: 画像の情報
    // getPos: プレイヤーの位置を取得する関数（引数はプレイヤー）
    // shots: 弾丸ラインの情報
    // option: オプション値
    constructor(p, imageInfo, getPos, shots, option) {
        super(p, imageInfo, getPos);
        this.shots = shots;
        this.shots.setFromCreature(this, option)
    }
    // 弾を追加する
    addShot() {
        this.shots.addObject(this);
    }
    // プレイヤーとプレイヤーが打った弾を描画する
    draw() {
        super.draw();
        this.shots.draw();
    }
}