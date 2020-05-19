.import "./Consts.js" as Consts
.import "./Exercise.js" as Exercise
.import "./HarmonicFunction.js" as HarmonicFunction
.import "./Utils.js" as Utils


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

    if (contains(extra, "9") && !contains(extra, "7")){
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
    // }

    ret.degree = get_valid_degree(arguments_json, chord_type)
    ret.position = arguments_json["position"] === undefined ? -1 : arguments_json["position"]
    ret.revolution = arguments_json["revolution"] === undefined ? "1" : arguments_json["revolution"]
    //ret.delay = delay
    ret.extra = arguments_json["extra"] === undefined ? [] : arguments_json["extra"]
    addExtraNotesIfNecessary(ret.extra)
    ret.omit = arguments_json["omit"] === undefined ? [] : arguments_json["omit"]
    ret.down = arguments_json["down"] === undefined ? false : arguments_json["down"]
    ret.system = arguments_json["extra"]

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
    console.log(measures)

    var ret = new Exercise.Exercise(key, metre, mode, measures)

    return ret

//        } catch (error) {
//            console.log("Error during parsing file!")
//            console.log(error)
//            return null
//        }
}



extra = ["9"]
addExtraNotesIfNecessary(extra)
console.log(extra)
