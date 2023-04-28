// 任意のステータスを格納するクラス
class Status {
    constructor(init_value) {
        this.value = init_value;
    }
    // ステータスを設定
    set (value) {
        this.value = value;
    }
    // ステータスを取得
    get () {
        return this.value;
    }
}
export const isGameOver = new Status(false);