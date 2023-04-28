export default class Images {
    constructor(src) {
        this.data = {}
        for (let src_item of src) {
            this.data[src_item.name] = src_item
            this.data[src_item.name]['filename'] = `assets/imgs/${src_item['name']}.png`;
        }
    }
    preload (p) {
        for (let key of Object.keys(this.data)) {
            this.data[key]['entity'] = p.loadImage(this.data[key]['filename']);
            console.log(this.data)
        }
    }
    get (key) {
        return this.data[key];
    }
    get_entity (key) {
        return this.get(key)['entity'];
    }
}
