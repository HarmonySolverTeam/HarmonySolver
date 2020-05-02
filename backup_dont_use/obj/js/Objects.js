function Exercise(key, meter, mode, measures)
{
    this.mode = mode
    this.key = key
    this.meter = meter
    this.measures = measures
}

function ExerciseSolution(exercise, rating, chords){
    this.exercise = exercise;
    this.rating = rating;
    this.chords = chords;

    this.setDurations = function(){
        function default_divide(number, result){
            //default_divide(3, [1/2])
            if(result.length === number) return result
            var all_equal = true
            for(var i = 0; i < result.length-1; i++){
                if(result[i] > result[i+1]){
                    result[i] /= 2
                    result.splice(i, 0, result[i])
                    all_equal = false
                    break
                }
            }
            if(all_equal){
                result[result.length-1] /= 2
                result.push(result[result.length-1])
            }
            return default_divide(number, result)
        }

        function find_division_point(list){
            var front = 0
            var back = list.length - 1
            var front_sum = list[0][front], back_sum = list[0][back]
            var last = -1
            while(front !== back){
                if(front_sum >= back_sum){
                    back--
                    back_sum += list[0][back]
                    last = 0
                }else{
                    front++
                    front_sum += list[front]
                    last = 1
                }
            }
            return last===0?back+1:front-1
        }

        function divide_fun_changed(measure){
            var funList = []
            var changes_counter = 0
            if(measure.length === 1) return [[1, 0]]
            for(var i = 0; i < measure.length-1; i++){
                var one_fun_counter = 0
                while(i < measure.length-1 && measure[i].equals(measure[i+1])){
                    one_fun_counter++
                    i++
                }
                funList.push([one_fun_counter+1, changes_counter])
                changes_counter++
            }
            return funList
        }

        var measures = this.exercise.measures
        var offset = 0
        for(var measure_id = 0; measure_id < measures.length; measure_id++){
            var current_measure = measures[measure_id]
            var funList = divide_fun_changed(current_measure)
            function add_time_to_fun(list, value){
                if(list.length === 1) {
                    funList[list[0][1]].push(value)
                    return
                }
                var index = find_division_point(list)
                var list1 = list.slice(0, index)
                var list2 = list.slice(index, list.length)
                add_time_to_fun(list1, value/2)
                add_time_to_fun(list2, value/2)
            }
            add_time_to_fun(funList, 1)
            var counter_measure = 0
            var counter_fun = 0
            while(counter_measure < current_measure.length){
                for(var i = 0; i < funList.length; i++){
                    var len_list = default_divide(funList[i][0], [funList[i][2]])
                    for(var j = 0; j < len_list.length; j++) {
                        console.log("Duration added : "+this.chords[counter_measure+offset].toString())
                        this.chords[counter_measure+offset].duration = [1,1/len_list[j]]
                        counter_measure++
                    }
                }
                counter_fun++
            }
            offset += current_measure.length
        }
    }
}

var VOICES = {
    SOPRANO: 0,
    ALTO: 1,
    TENOR: 2,
    BASS: 3
}

var FUNCTION_NAMES = {
    TONIC: "T",
    SUBDOMINANT: "S",
    DOMINANT: "D"
}

var BASE_NOTES = {
    C: 0,
    D: 1,
    E: 2,
    F: 3,
    G: 4,
    A: 5,
    B: 6
}

var possible_keys_major = ['C', 'C#', 'Db',
    'D', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'Ab', 'A',
    'Bb', 'B', 'Cb']

var possible_keys_minor = ['c', 'c#', 'db',
    'd', 'eb', 'e', 'f', 'f#', 'gb', 'g', 'ab', 'a',
    'bb', 'b', 'cb']

var possible_systems = ['close', 'open']

function contains(list, obj){

    for (var i = 0; i< list.length; i++){
        if (list[i] === obj){
            return true
        }
    }
    return false
}

function HarmonicFunction(functionName, degree, position, revolution, delay, extra, omit, down, system) {
    this.functionName = functionName
    this.degree = degree
    this.position = position
    this.revolution = revolution
    this.delay = delay //delayed components list
    this.extra = extra  //extra components list
    this.omit = omit //omitted components list
    this.down = down //true or false
    this.system = system //open, close

    this.getSymbol = function(){
        return this.down?(this.functionName+"down"+this.extra):(this.functionName+this.extra)
    }
    this.equals = function(other){
        return this.functionName === other.functionName && this.degree === other.degree && this.down === other.down
    }
}

function Chord(sopranoNote, altoNote, tenorNote, bassNote, harmonicFunction) {
    this.sopranoNote = sopranoNote
    this.altoNote = altoNote
    this.tenorNote = tenorNote
    this.bassNote = bassNote
    this.harmonicFunction = harmonicFunction
    this.notes = [bassNote, tenorNote, altoNote, sopranoNote]
    this.duration = undefined

    this.toString = function(){
        var chordStr = "CHORD: \n";
        chordStr += this.sopranoNote.toString() + "\n";
        chordStr += this.altoNote.toString() + "\n";
        chordStr += this.tenorNote.toString() + "\n";
        chordStr += this.bassNote.toString() + "\n";
        return chordStr;
    }
}

function Note(pitch, baseNote, chordComponent) {
    this.pitch = pitch
    this.baseNote = baseNote
    this.chordComponent = chordComponent

    this.toString = function(){
        return this.pitch + " " + this.baseNote + " " + this.chordComponent;
    }

}

function Scale(baseNote) {
    this.baseNote = baseNote
}

function MajorScale(baseNote, tonicPitch) {
    Scale.call(this.baseNote)
    this.tonicPitch = tonicPitch
    this.pitches = [0, 2, 4, 5, 7, 9, 11]
}

function MajorScale(key){
    Scale.call(this, keyStrBase[key])
    this.tonicPitch = keyStrPitch[key]
    this.pitches = [0, 2, 4, 5, 7, 9, 11]
}

function Solver(exercise){
    this.exercise = exercise
    this.harmonicFunctions = exercise.measures[0];
    for(var i=1; i<exercise.measures.length; i++){
        this.harmonicFunctions = this.harmonicFunctions.concat(exercise.measures[i]);
    }
    this.chordGenerator = new ChordGenerator(this.exercise.key);

    this.solve = function(){
        var sol_chords =  this.findSolution(0, undefined, undefined);
        return new ExerciseSolution(this.exercise, -12321, sol_chords);
    }

    this.findSolution = function(curr_index, prev_prev_chord, prev_chord){
        var chords = this.chordGenerator.generate(this.harmonicFunctions[curr_index])
        var good_chords = []

        for (var j = 0; j < chords.length; j++){
            console.log(chords[j].toString())
            var score = checker.checkAllRules(prev_prev_chord, prev_chord, chords[j])

            if (score !== -1 ) good_chords.push([score,chords[j]]);
        }

        if (good_chords.length === 0){
            return [];
        }

        good_chords.sort(function(a,b){(a[0] > b[0]) ? 1 : -1})

        if (curr_index+1 === this.harmonicFunctions.length){
            //console.log(good_chords[0][1])
            return [good_chords[0][1]];
        }

        for (var i = 0; i< good_chords.length; i++){

            var next_chords = this.findSolution( curr_index + 1, prev_chord, good_chords[i][1])

            if (next_chords.length !== 0){
                next_chords.unshift(good_chords[i][1])
                return next_chords
            }

        }

        return []
    }
}


/////////////////////////////////////////////
//             CONSTS.js

var keyStrPitch = {
    'C'  : 60,
    'C#' : 61,
    'Db' : 61,
    'D'  : 62, 
    'Eb' : 63,
    'E'  : 64,
    'F'  : 65, 
    'F#' : 66, 
    'Gb' : 66, 
    'G'  : 67, 
    'Ab' : 68, 
    'A'  : 69,
    'Bb' : 70,
    'B'  : 71, 
    'Cb' : 71
}

var keyStrBase = { 
    'C'  : BASE_NOTES.C,
    'C#' : BASE_NOTES.C,
    'Db' : BASE_NOTES.D,
    'D'  : BASE_NOTES.D,
    'Eb' : BASE_NOTES.E,
    'E'  : BASE_NOTES.E,
    'F'  : BASE_NOTES.F, 
    'F#' : BASE_NOTES.F, 
    'Gb' : BASE_NOTES.G, 
    'G'  : BASE_NOTES.G,
    'Ab' : BASE_NOTES.A, 
    'A'  : BASE_NOTES.A,
    'Bb' : BASE_NOTES.B,
    'B'  : BASE_NOTES.B,
    'Cb' : BASE_NOTES.C
}

function VoicesBoundary(){
    this.sopranoMax = 81;
    this.sopranoMin = 60;
    this.altoMax = 74;
    this.altoMin = 53;
    this.tenorMax = 69;
    this.tenorMin = 48;
    this.bassMax = 62;
    this.bassMin = 41;
}

////////////////////////////////////////////
//           ChordGenerator.js

var basicDurChord = [0,4,7];
var basicDur6Chord = [0, 4, 7, 9];
var basicDur7Chord = [0, 4, 7, 10];


function ChordGenerator(key){
    this.key = key;

    function getPossiblePitchValuesFromInterval(note, minPitch, maxPitch){

        while(note - minPitch >= 12 ){
                note = note - 12;
        }
    
        while(note - minPitch < 0){
                note = note + 12;
        }
    
        var possiblePitch = [];
        while(maxPitch - note >= 0){
                possiblePitch.push(note);
                note = note + 12;
        }
    
        return possiblePitch;
    }

    this.generate = function(harmonicFunction){
        var scale = new MajorScale(this.key);
        var basicNote = scale.tonicPitch;

        switch(harmonicFunction.functionName){
            case 'T':
                basicNote += scale.pitches[0];
                break;
            case 'S':
                basicNote += scale.pitches[3];
                break;
            case 'D':
                basicNote += scale.pitches[4];
                break;
        };

        var chordScheme = basicDurChord;
        var schemas = [ [1, 1, 3, 5], [1, 1, 5, 3], [1, 3, 1, 5], [1, 3, 5, 1], [1, 5, 1, 3], [1, 5, 3, 1], [1,3,5,5], [1,5,3,5], [1,5,5,3] ];

        if(harmonicFunction.extra) {
            switch (harmonicFunction.extra[0]) {
                case 6:
                    console.log("ADDED 6");
                    chordScheme = basicDur6Chord;
                    schemas = [[1, 3, 5, 6], [1, 3, 6, 5], [1, 5, 3, 6], [1, 5, 6, 3], [1, 6, 3, 5], [1, 6, 5, 3]];
                    break;
                case 7:
                    console.log("ADDED 7");
                    chordScheme = basicDur7Chord;
                    schemas = [[1, 3, 5, 7], [1, 3, 7, 5], [1, 5, 3, 7], [1, 5, 7, 3], [1, 7, 3, 5], [1, 7, 5, 3]];
                    break;
            }
        }

        var pryma = basicNote + chordScheme[0];
        var tercja = basicNote + chordScheme[1];
        var kwinta = basicNote + chordScheme[2];
        var added = basicNote + chordScheme[3];

        var chords = [];

        for(var i=0; i< schemas.length; i++){
            var schema_mapped = schemas[i].map(
                function(x){
                    if(x == 1)
                            return pryma;
                    if(x == 3)
                            return tercja;
                    if(x == 5)
                            return kwinta;
                    if(x == 6)
                            return added;
                    if(x == 7)
                            return added;
                }
            );
            
            var vb = new VoicesBoundary()
            var bass = getPossiblePitchValuesFromInterval(schema_mapped[0], vb.bassMin, vb.bassMax);
            var tenor = getPossiblePitchValuesFromInterval(schema_mapped[1], vb.tenorMin, vb.tenorMax);
            var alto = getPossiblePitchValuesFromInterval(schema_mapped[2], vb.altoMin, vb.altoMax);
            var soprano = getPossiblePitchValuesFromInterval(schema_mapped[3], vb.sopranoMin, vb.sopranoMax);
        
            for(var n =0; n< bass.length; n++){
                for(var j=0; j< tenor.length; j++){
                        if(tenor[j] >= bass[n]){
                            for(var k =0; k< alto.length; k++){
                                    if(alto[k] >= tenor[j] && alto[k] - tenor[j] < 12){
                                        for(var m=0; m<soprano.length; m++){
                                                if(soprano[m] >= alto[k] && soprano[m] - alto[k] < 12){

                                                    var d1 = {"T": 0, "S": 3, "D" : 4 };
                                                    var position = harmonicFunction.position
                                                    if(position === -1 || schemas[i][3] === position) {
                                                        var bassNote = new Note(bass[n], (scale.baseNote + d1[harmonicFunction.functionName] + schemas[i][0] - 1) % 7, schemas[i][0]);
                                                        var tenorNote = new Note(tenor[j], (scale.baseNote + d1[harmonicFunction.functionName] + schemas[i][1] - 1) % 7, schemas[i][1]);
                                                        var altoNote = new Note(alto[k], (scale.baseNote + d1[harmonicFunction.functionName] + schemas[i][2] - 1) % 7, schemas[i][2]);
                                                        var sopranoNote = new Note(soprano[m], (scale.baseNote + d1[harmonicFunction.functionName] + schemas[i][3] - 1) % 7, schemas[i][3]);
                                                        chords.push(new Chord(sopranoNote, altoNote, tenorNote, bassNote, harmonicFunction));
                                                    }
                                                }
                                        }
                                    }
                            }
                        }
                }
            }
        }
    
        return chords;

    }
}
