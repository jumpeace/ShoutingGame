class Status {
    constructor(init_value) {
        this.value = init_value;
    }
    set (value) {
        this.value = value;
    }
    get () {
        return this.value;
    }
}
export const isGameOver = new Status(false);