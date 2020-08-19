function Exercise(key, meter, mode, measures) {
    this.mode = mode
    this.key = key
    this.meter = meter
    this.measures = measures

    this.toString = function () {
        return "Mode: " + this.mode + " " +
          "Key: " + this.key + " " +
          "Meter: " + this.meter + " " +
           "Measures: " + this.measures
    }
}
