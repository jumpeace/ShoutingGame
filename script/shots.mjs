import { Xy } from "./utils.mjs";

// 弾丸の線のクラス
export default class ShotLine {
    constructor(objectSrc, option) {
        // 弾丸の速度
        this.speed = option.speed;
        // 弾丸数が1つ回復するのにかかるフレーム数
        this.shotResolveFrameNum = option.shotResolveFrameNum;
        // 保持できる弾丸数の最大数
        this.shotMax = option.shotMax;
        
        // 弾丸の生成元
        this.objectSrc = objectSrc;
        // 存在する弾丸を格納
        this.objects = [];
        // 弾丸数が1つ回復するのにかかるフレームのカウンタ
        this.shotResolveFrameCount = 0;
        // 保持している弾丸数
        this.shotCount = Math.floor(this.shotMax / 2);
    }
    // プレイヤーの情報から弾丸を生成する
    setFromCreature(creature, option) {
        this.startY = option.getStartY(creature);
        this.objectSrc.setPos(0, creature.pos.y);
    }
    // 新しい弾丸を生成して取得する
    getNewObject(xy) {
        const newShot = this.objectSrc.getClone();
        newShot.setPos(xy);
        return newShot;
    }
    // 弾丸を追加する
    addObject(creature) {
        // 保持している弾丸がある場合のみ追加する
        if (this.shotCount > 0) {
            this.objects.push(this.getNewObject(new Xy(creature.pos.x, this.startY)));
            this.shotCount--;
        }
    }
    // 任意の弾丸を削除する（敵に当たった場合などに呼ばれる）
    delete(shot) {
        const deleteIndex = this.objects.indexOf(shot);
        this.objects.splice(deleteIndex, 1);
    }
    // 存在する弾丸の位置を更新もしくは消去したり、敵を生成したりする
    update() {
        // 更新後も存在する弾丸の情報を格納する
        const objectsTmp = []
        for (let object of this.objects) {
            // 範囲外に外れた場合は弾丸を消去する
            if (!object.setPos(new Xy(object.pos.x, object.pos.y - this.speed))) {
                continue;
            }
            objectsTmp.push(object);
        }
        this.objects = objectsTmp
        
        // 保持する弾丸数を増やす場合は増やす
        // ※弾丸数が1つ回復するのにかかるフレームのカウンタが0の場合
        if (this.shotResolveFrameCount === 0) {
            if (this.shotCount < this.shotMax) {
                this.shotCount++;
            }
        }
        // 弾丸数が1つ回復するのにかかるフレームのカウンタを更新
        this.shotResolveFrameCount = (this.shotResolveFrameCount + 1) % this.shotResolveFrameNum;
    }
    // 弾丸の一覧を描画
    draw(creature) {
        this.update(creature);
        for (let object of this.objects) {
            object.draw();
        }
    }
}