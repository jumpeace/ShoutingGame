import { isGameOver } from "./status.mjs";
import { randFloat, randInt, Xy } from "./utils.mjs";

// Objectsクラス作る
export default class Enemies {
    constructor(objectSrc, blastImage, option) {
        this.intervalMin = option.intervalMin;
        this.intervalMax = option.intervalMax;
        this.speedYRange = option.speedYRange;
        this.speedXpyMax = option.speedXpyMax;
        
        this.objectSrc = objectSrc;
        this.objectSrc.setPos(0, 0)
        this.objectSrc.min = new Xy(-objectSrc.size.x / 2, -objectSrc.size.y / 2);
        this.objectSrc.max = new Xy(
            objectSrc.p.windowWidth - objectSrc.size.x / 2, 
            objectSrc.p.windowHeight - objectSrc.size.y / 2
            );
        this.objects = [];
        this.speedYs = [];
        this.speedsXpy = [];
        this.blastImage = blastImage;
        this.intervalNum = randInt(this.intervalMin, this.intervalMax);
        this.intervalCount = parseInt(this.intervalNum / 2);
    }
    getNewObject(xy) {
        const newObject = this.objectSrc.getClone();
        newObject.setPos(xy);
        return newObject;
    }
    addObject(xy) {
        this.objects.push(this.getNewObject(xy));
        this.speedYs.push(randInt(this.speedYRange.min, this.speedYRange.max));
        this.speedsXpy.push(randFloat(-this.speedXpyMax, this.speedXpyMax));
    }
    update(player) {
        const objectsTmp = []
        for (let i = 0; i < this.objects.length; i++) {
            const object = this.objects[i];
            const speedY = this.speedYs[i];
            const speedXpy = this.speedsXpy[i];
            let existsObject = true;

            // 弾があたった場合
            for (let shot of player.shots.objects) {
                if (object.isAboutIn(shot, 20)) {
                    player.shots.delete(shot);
                    existsObject = false;
                    break;
                }
            }
            if (!existsObject) {
                this.objectSrc.p.image(
                    this.blastImage.entity, 
                    object.pos.x - this.blastImage.size.x / 2, 
                    object.pos.y - this.blastImage.size.y / 2,
                );
                continue;
            }
            // プレイヤーに接触された場合
            if (object.isAboutIn(player, 0)) {
                isGameOver.set(true);
            }
            // 外に外れた場合
            const speedX = Math.floor(speedY * speedXpy);
            if (!object.setPos(new Xy(object.pos.x + speedX, object.pos.y + speedY))) {
                continue;
            }
            
            objectsTmp.push(object);
        }
        this.objects = objectsTmp

        if (this.intervalCount === 0) {
            // 真ん中への偏り度合い(1が普通)
            const ratio = 0.8;
            let randX = randInt(0, this.objectSrc.p.windowWidth);
            const halfWindowWidth = this.objectSrc.p.windowWidth / 2
            if (randX < halfWindowWidth) {
               randX = halfWindowWidth - Math.pow(randX / halfWindowWidth, ratio) * halfWindowWidth;
            }
            else {
                randX = Math.pow((randX - halfWindowWidth) / halfWindowWidth, ratio) * halfWindowWidth + halfWindowWidth;
            }
            this.addObject(new Xy(
                randX,
                this.objectSrc.size.y / 2
            ));
            this.intervalNum = randInt(this.intervalMin, this.intervalMax);
        }

        this.intervalCount = (this.intervalCount + 1) % this.intervalNum;
    }
    draw(shots) {
        this.update(shots);
        for (let object of this.objects) {
            object.draw();
        }
    }
}