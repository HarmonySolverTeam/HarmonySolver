function SopranoExercise(mode, key, meter, notes, durations){
    this.mode = mode; // minor or major
    this.key = key; // for example C
    this.meter = meter; // [x,y]
    this.notes = notes; // list of notes
    this.durations = durations; // list of durations corresponding to notes

    this.toString = function(){
        return this.mode+" "+this.key+" "+this.meter+" "+this.notes+" "+this.durations;
    }
}

function SopranoHarmonizationExercise(sopranoExercise, harmonicFunctions, functionsMap){
    this.sopranoExercise = sopranoExercise;
    this.harmonicFunctions = harmonicFunctions;
    this.functionsMap = functionsMap;
}