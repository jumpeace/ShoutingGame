// 画像の一覧を管理
export default class Images {
    constructor(src) {
        // 画像の情報の一覧を格納
        // ※各要素はオブジェクトで, name属性(画像名)とsize属性(画像サイズ)でできている
        this.data = {}
        for (let src_item of src) {
            this.data[src_item.name] = src_item
            // 画像のファイルパスを格納
            this.data[src_item.name]['filename'] = `assets/imgs/${src_item['name']}.png`;
        }
    }
    // 画像を読み込む
    preload (p) {
        for (let key of Object.keys(this.data)) {
            // 画像のデータを格納する
            this.data[key]['entity'] = p.loadImage(this.data[key]['filename']);
            console.log(this.data)
        }
    }
    // 画像の情報を取得
    get (key) {
        return this.data[key];
    }
    // 画像データを取得
    get_entity (key) {
        return this.get(key)['entity'];
    }
}
