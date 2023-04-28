import { isGameOver } from "./status.mjs";
import { Xy } from "./utils.mjs";

// ゲームオブジェクトを管理するクラス
class Object {
    // プレイヤーを生成
    // p: p5.js のクラス
    // imageInfo: 画像の情報
    // getPos: プレイヤーの位置を取得する関数（引数はプレイヤー）
    constructor(p, imageInfo, getPos) {
        this.p = p;
        this.imageInfo = imageInfo;
        this.image = imageInfo.entity;
        // ゲームオブジェクトのサイズ
        this.size = imageInfo.size;
        // ゲームオブジェクトの存在可能範囲を設定
        this.min = new Xy(
            -imageInfo.size.x / 2, 
            -imageInfo.size.y / 2
        );
        this.max = new Xy(
            this.p.windowWidth + imageInfo.size.x / 2, 
            this.p.windowHeight + imageInfo.size.y / 2 - 50
        );
        // ゲームオブジェクトの位置を設定
        this.setPos(getPos(this));
    }
    // ゲームオブジェクトのクローンを生成して返す
    getClone() {
        const cloneObject = new Object(
            this.p, 
            this.imageInfo,
            object => this.pos
        );
        return cloneObject;
    }
    // ゲームオブジェクトの位置を更新する
    setPos(newXy) {
        // ゲームオーバーの場合は更新できない
        if (isGameOver.get()) {
            return false;
        }
        // x方向に範囲外ならば更新できない
        if (newXy.x < this.min.x || newXy.x > this.max.x) {
            return false;
        }
        // y方向に範囲外ならば更新できない
        if (newXy.y < this.min.y || newXy.y > this.max.y) {
            return false;
        }
        this.pos = newXy;
        return true;
    }
    // ちょうどでなくだいたい接触しているかを判定
    // object: 接触判定をする対象
    // aboutSize: これ以上近づくと接触と判定する距離
    isAboutIn(object, aboutSize) {
        // x方向にだいたい接触しているかを判定
        let isXIn = object.pos.x + object.size.x / 2 >= this.pos.x - this.size.x / 2 - aboutSize && 
                        object.pos.x - object.size.x / 2 <= this.pos.x + this.size.x / 2 + aboutSize;
        // y方向にだいたい接触しているかを判定
        let isYIn = object.pos.y + object.size.y / 2 >= this.pos.y - this.size.y / 2 - aboutSize&& 
                        object.pos.y - object.size.y / 2 <= this.pos.y + this.size.y / 2 + aboutSize;
        return isXIn && isYIn;
    }
    // ゲームオブジェクトを描画
    draw() {
        this.p.image(
            this.image, 
            this.pos.x - this.size.x / 2, 
            this.pos.y - this.size.y / 2,
        );
    }
}
export default Object;