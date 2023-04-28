import { isGameOver } from "./status.mjs";
import { randFloat, randInt, Xy } from "./utils.mjs";

// 複数の敵を管理するクラス
export default class Enemies {
    constructor(objectSrc, blastImage, option) {
        // 発生間隔の下限
        this.intervalMin = option.intervalMin;
        // 発生間隔の上限
        this.intervalMax = option.intervalMax;
        // 落下速度の範囲
        this.speedYRange = option.speedYRange;
        // tan(X方向の速度/落下速度)の上限
        this.speedXpyMax = option.speedXpyMax;
        
        // 敵の生成元
        this.objectSrc = objectSrc;
        // 敵の位置をとりあえず(0, 0)にしておく
        this.objectSrc.setPos(0, 0)
        // 敵が動ける範囲を設定
        this.objectSrc.min = new Xy(-objectSrc.size.x / 2, -objectSrc.size.y / 2);
        this.objectSrc.max = new Xy(
            objectSrc.p.windowWidth - objectSrc.size.x / 2, 
            objectSrc.p.windowHeight - objectSrc.size.y / 2
            );
        // 存在する敵を格納
        this.objects = [];
        // それぞれの敵の落下速度を格納
        this.speedYs = [];
        // それぞれの敵の tan(X方向の速度/落下速度)を格納
        this.speedsXpy = [];
        // 爆発時の画像を格納
        this.blastImage = blastImage;
        // 発生間隔を設定
        this.intervalNum = randInt(this.intervalMin, this.intervalMax);
        // 発生のカウンタ(この値が0のときに発生する)
        this.intervalCount = parseInt(this.intervalNum / 2);
    }
    // 新しい敵を生成して取得する
    getNewObject(xy) {
        const newObject = this.objectSrc.getClone();
        newObject.setPos(xy);
        return newObject;
    }
    // 敵を追加する（落下速度とtan(X方向の速度/落下速度)はランダムに決定）
    addObject(xy) {
        this.objects.push(this.getNewObject(xy));
        this.speedYs.push(randInt(this.speedYRange.min, this.speedYRange.max));
        this.speedsXpy.push(randFloat(-this.speedXpyMax, this.speedXpyMax));
    }
    // 存在する敵の位置を更新もしくは消去したり、敵を生成したりする
    update(player) {
        // 更新後も存在する敵の情報を格納する
        const objectsTmp = []
        // 全ての敵に対して走査する
        for (let i = 0; i < this.objects.length; i++) {
            const object = this.objects[i];
            const speedY = this.speedYs[i];
            const speedXpy = this.speedsXpy[i];
            let existsObject = true;

            // 弾があたった場合は敵を消去する
            for (let shot of player.shots.objects) {
                if (object.isAboutIn(shot, 20)) {
                    player.shots.delete(shot);
                    existsObject = false;
                    break;
                }
            }
            // 敵を消去した場合は、爆破アニメーションを表示する
            if (!existsObject) {
                this.objectSrc.p.image(
                    this.blastImage.entity, 
                    object.pos.x - this.blastImage.size.x / 2, 
                    object.pos.y - this.blastImage.size.y / 2,
                );
                continue;
            }
            // プレイヤーと接触した場合はゲームオーバー
            if (object.isAboutIn(player, 0)) {
                isGameOver.set(true);
            }
            // 範囲外に外れた場合は敵を消去する
            const speedX = Math.floor(speedY * speedXpy);
            if (!object.setPos(new Xy(object.pos.x + speedX, object.pos.y + speedY))) {
                continue;
            }
            
            objectsTmp.push(object);
        }
        this.objects = objectsTmp

        // 敵を生成する場合（発生間隔カウンタが0の場合）は、生成処理を行う
        if (this.intervalCount === 0) {
            // 真ん中への偏り度合い（1が普通, 大きいほど真ん中に偏る）
            const ratio = 0.8;
            // 生成する敵のx座標を決定
            let randX = randInt(0, this.objectSrc.p.windowWidth);
            const halfWindowWidth = this.objectSrc.p.windowWidth / 2
            if (randX < halfWindowWidth) {
               randX = halfWindowWidth - Math.pow(randX / halfWindowWidth, ratio) * halfWindowWidth;
            }
            else {
                randX = Math.pow((randX - halfWindowWidth) / halfWindowWidth, ratio) * halfWindowWidth + halfWindowWidth;
            }
            // 敵を生成
            this.addObject(new Xy(
                randX,
                this.objectSrc.size.y / 2
            ));
            // 次の敵が発生する間隔をランダムに決定
            this.intervalNum = randInt(this.intervalMin, this.intervalMax);
        }

        // 敵の発生間隔カウンタを更新
        this.intervalCount = (this.intervalCount + 1) % this.intervalNum;
    }

    // 敵の一覧を描画
    draw(shots) {
        this.update(shots);
        for (let object of this.objects) {
            object.draw();
        }
    }
}