function Exercise(key, meter, mode, measures) {
    this.mode = mode
    this.key = key
    this.meter = meter
    this.measures = measures

    this.toString = function () {
        return this.mode + " " +
            this.key + " " +
            this.meter + " " +
            this.measures
    }
}
