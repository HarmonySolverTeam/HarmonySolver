.import "./Consts.js" as Consts
.import "./Exercise.js" as Exercise
.import "./HarmonicFunction.js" as HarmonicFunction
.import "./Utils.js" as Utils

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
    for (var variable in ret){
        if (variable !== "functionName" && variable !== "equals" && variable !== "getSymbol"){
            ret[variable] = arguments_json[variable]
        }
    }
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

    var ret = new Exercise.Exercise(key, metre, mode, measures)

    return ret

//        } catch (error) {
//            console.log("Error during parsing file!")
//            console.log(error)
//            return null
//        }
}