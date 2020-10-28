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

    this.getHarmonicFunctionList = function() {
        var harmonicFunctions = []
        for(var i=0; i<this.measures.length; i++){
            for(var j =0; j<this.measures[i].length; j++){
                harmonicFunctions.push(this.measures[i][j]);
            }
        }
        return harmonicFunctions;
    }
}