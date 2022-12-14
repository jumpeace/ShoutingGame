import { Xy } from "./utils.mjs";

export default class ShotLine {
    constructor(objectSrc, option) {
        this.speed = option.speed;
        this.shotResolveFrameNum = option.shotResolveFrameNum;
        this.shotMax = option.shotMax;
        
        this.objectSrc = objectSrc;
        this.objects = [];
        this.shotResolveFrameCount = 0;
        this.shotCount = Math.floor(this.shotMax / 2);
    }
    setFromCreature(creature, option) {
        this.startY = option.getStartY(creature);
        this.objectSrc.setPos(0, creature.pos.y);
    }
    getNewObject(xy) {
        const newShot = this.objectSrc.getClone();
        newShot.setPos(xy);
        return newShot;
    }
    addObject(creature) {
        if (this.shotCount > 0) {
            this.objects.push(this.getNewObject(new Xy(creature.pos.x, this.startY)));
            this.shotCount--;
        }
    }
    delete(shot) {
        const deleteIndex = this.objects.indexOf(shot);
        this.objects.splice(deleteIndex, 1);
    }
    update() {
        // 描画の更新
        const objectsTmp = []
        for (let object of this.objects) {
            // 外に外れた場合
            if (!object.setPos(new Xy(object.pos.x, object.pos.y - this.speed))) {
                continue;
            }
            objectsTmp.push(object);
        }
        this.objects = objectsTmp

        if (this.shotResolveFrameCount === 0) {
            if (this.shotCount < this.shotMax) {
                this.shotCount++;
            }
        }
        this.shotResolveFrameCount = (this.shotResolveFrameCount + 1) % this.shotResolveFrameNum;
    }
    draw(creature) {
        this.update(creature);
        for (let object of this.objects) {
            object.draw();
        }
    }
}