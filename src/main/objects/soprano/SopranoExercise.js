function SopranoExercise(mode, key, meter, notes, durations, measures, possibleFunctionsList){
    this.mode = mode; // minor or major
    this.key = key; // for example C
    this.meter = meter; // [x,y]
    this.notes = notes; // list of notes
    this.durations = durations; // list of durations corresponding to notes
    this.measures = measures;
    this.possibleFunctionsList = possibleFunctionsList;

    this.toString = function(){
        return "Mode: " + this.mode+" Key: "+this.key+" Meter: "+this.meter+" Notes: "+this.notes+" Durations: "+this.durations;
    }
}
