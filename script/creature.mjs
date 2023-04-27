import Object from "./object.mjs";

export default class Creature extends Object {
    constructor(p, imageInfo, getPos, shots, option) {
        super(p, imageInfo, getPos);
        this.shots = shots;
        this.shots.setFromCreature(this, option)
    }
    addShot() {
        this.shots.addObject(this);
    }
    draw() {
        super.draw();
        this.shots.draw();
    }
}