import { isGameOver } from "./status.mjs";
import { Xy } from "./utils.mjs";

class Object {
    constructor(p, imageInfo, getPos) {
        this.p = p;
        this.imageInfo = imageInfo;
        this.image = imageInfo.entity;
        this.size = imageInfo.size;
        this.min = new Xy(
            -imageInfo.size.x / 2, 
            -imageInfo.size.y / 2
        );
        this.max = new Xy(
            this.p.windowWidth + imageInfo.size.x / 2, 
            this.p.windowHeight + imageInfo.size.y / 2 - 50
        );
        this.setPos(getPos(this));
    }
    getClone() {
        const cloneObject = new Object(
            this.p, 
            this.imageInfo,
            object => this.pos
        );
        return cloneObject;
    }
    setPos(newXy) {
        if (isGameOver.get()) {
            return false;
        }
        if (newXy.x < this.min.x || newXy.x > this.max.x) {
            return false;
        }
        if (newXy.y < this.min.y || newXy.y > this.max.y) {
            return false;
        }
        this.pos = newXy;
        return true;
    }
    isAboutIn(object, aboutSize) {
        let isXIn = object.pos.x + object.size.x / 2 >= this.pos.x - this.size.x / 2 - aboutSize && 
                        object.pos.x - object.size.x / 2 <= this.pos.x + this.size.x / 2 + aboutSize;
        let isYIn = object.pos.y + object.size.y / 2 >= this.pos.y - this.size.y / 2 - aboutSize&& 
                        object.pos.y - object.size.y / 2 <= this.pos.y + this.size.y / 2 + aboutSize;
        return isXIn && isYIn;
    }
    draw() {
        this.p.image(
            this.image, 
            this.pos.x - this.size.x / 2, 
            this.pos.y - this.size.y / 2,
        );
    }
}
export default Object;