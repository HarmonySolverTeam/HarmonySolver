.import "./Consts.js" as Consts
.import "./Exercise.js" as Exercise
.import "./HarmonicFunction.js" as HarmonicFunction
.import "./Utils.js" as Utils

var DEBUG = false;

function check_figured_bass_symbols(symbols){
    var figured_bass_symbols = /\s*(((([#bh])?\d+)|([#bh]))\s*)+/;
    return figured_bass_symbols.test(symbols);
}

function validate_chord_component(chordComponent){
    var chordComponentTest = /(>|<|>>|<<)?\d+/;
    return chordComponentTest.test(chordComponent)
}

//TODO informacja o błędzie
function validateDelays(harmonicFunction){
    var mainComponents = ["1","3","5"];
    var pitchCounter = mainComponents.length;
    var pitches = [];
    if(harmonicFunction.delay.length > 3) return false; //triple delay is maximal
    for(var i=0; i<harmonicFunction.delay.length; i++){
        if(harmonicFunction.delay[i].length !== 2) return false; //wrong size of delay
        pitches.push(harmonicFunction.delay[i][1]);
        var first = harmonicFunction.delay[i][0];
        var second = harmonicFunction.delay[i][1];
        if(Utils.contains(mainComponents, second)) pitchCounter--;
        if(!validate_chord_component(first) || !validate_chord_component(second)) return false; //wrong format of component
        while(first.startsWith(">") || first.startsWith("<")) first = first.slice(1);
        first = parseInt(first);
        while(second.startsWith(">") || second.startsWith("<")) second = second.slice(1);
        second = parseInt(second);
        if(Utils.abs(first-second)!==1) return false; //too large difference in delay
    }
    if(harmonicFunction.position > 0 && !Utils.contains(pitches, harmonicFunction.position+"") &&
        !Utils.contains(mainComponents, harmonicFunction.position+"")) pitches.push(harmonicFunction.position)
    if(!Utils.contains(pitches, harmonicFunction.revolution) &&
        !Utils.contains(mainComponents, harmonicFunction.revolution)) pitches.push(harmonicFunction.revolution)
    harmonicFunction.extra.forEach((x)=>{
        if(!Utils.contains(pitches, x)) pitches.push(x)
    });
    var errorInOmits = false;
    harmonicFunction.omit.forEach((x)=>{
        if(Utils.contains(pitches, x)) errorInOmits = true; //cannot omit component used in delay, position, resolution, extra
        pitchCounter--;
    });
    return !errorInOmits && pitchCounter+pitches.length <= 4; //we have only 4 voices
}


function get_valid_degree(arguments_json, chord_type) {
    if (arguments_json["degree"] !== undefined){
        return arguments_json["degree"]
    }

    switch (chord_type){
        case "T":
            return 1
        case "S":
            return 4
        case "D":
            return 5

    }
}

function addExtraNotesIfNecessary(extra){

    if (Utils.contains(extra, "9") && !Utils.contains(extra, "7")){
        extra.push("7")
    }

}

function parseChord(string) {
    var i = 0
    while (i < string.length && string[i] !== '{') {
        i++
    }
    var chord_type = string.substring(0, i)
    var arguments = string.substring(i, string.length)

    var ret = new HarmonicFunction.HarmonicFunction()
    ret.functionName = chord_type

    if (arguments === null || arguments.length < 2) {
        return ret
    }

    var arguments_json = JSON.parse(arguments)
    // for (var variable in ret){
    //     if (variable !== "functionName" && variable !== "equals" && variable !== "getSymbol"){
    //         ret[variable] = arguments_json[variable]
    //     }
    // }m

    ret.degree = get_valid_degree(arguments_json, chord_type)
    ret.position = arguments_json["position"] === undefined ? -1 : arguments_json["position"]
    ret.revolution = arguments_json["revolution"] === undefined ? "1" : arguments_json["revolution"]
    //ret.delay = delay
    ret.delay = arguments_json["delay"] === undefined ? [] : arguments_json["delay"]
    ret.extra = arguments_json["extra"] === undefined ? [] : arguments_json["extra"]
    addExtraNotesIfNecessary(ret.extra)
    ret.omit = arguments_json["omit"] === undefined ? [] : arguments_json["omit"]
    ret.down = arguments_json["down"] === undefined ? false : arguments_json["down"]
    ret.system = arguments_json["system"]
    ret.mode = arguments_json["mode"]

    return ret
}

//todo obsluga i wyswietlanie bledow co i gdzie jest nie tak dokladnie w pliku

function parse(input) {
    //       try {
    var lines = input.split("\n")

    var key = lines[0]

    var mode = null

    if (Utils.contains(Consts.possible_keys_major, key)){
        mode = "major"
    } else if (Utils.contains(Consts.possible_keys_minor, key)){
        mode = "minor"
    } else {
        throw new Error("Unrecognized key: " + key)
    }

    var metre = lines[1]

    if (metre === 'C') {
        metre = [4,4]
    } else {
        metre = [parseInt(metre.split('/')[0]), parseInt(metre.split('/')[1])]
    }

    var measures = []

    for (var i = 2; i < lines.length; i++) {
        if(!lines[i]) continue
        var chords = lines[i].split(";")
        var chords_parsed = []
        for (var j = 0; j < chords.length; j++) {
            chords_parsed.push(parseChord(chords[j]))
        }measures.push(chords_parsed)
    }
    if(DEBUG) console.log(measures)

    var ret = new Exercise.Exercise(key, metre, mode, measures)

    return ret

//        } catch (error) {
//            console.log("Error during parsing file!")
//            console.log(error)
//            return null
//        }
}
