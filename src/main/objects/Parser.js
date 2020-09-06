.import "./Consts.js" as Consts
.import "./Exercise.js" as Exercise
.import "./HarmonicFunction.js" as HarmonicFunction
.import "./Utils.js" as Utils
.import "./Errors.js" as Errors

var DEBUG = false;

function check_figured_bass_symbols(symbols){
    var figured_bass_symbols = /\s*(((([#bh])?\d+)|([#bh]))\s*)+/;
    return figured_bass_symbols.test(symbols);
}

function parseChord(string) {
    var i = 0
    while (i < string.length && string[i] !== '{') {
        i++
    }
    var chord_type = string.substring(0, i)
    var arguments = string.substring(i, string.length)

    if (arguments === null || arguments.length < 2 || chord_type.length > 2) {
        return undefined
    }
    var mode = Consts.MODE.MAJOR;
    if(chord_type.length === 2 && chord_type[1] === "o") mode = Consts.MODE.MINOR;
    var arguments_json = JSON.parse(arguments);
    arguments_json["functionName"] = chord_type[0];
    arguments_json["mode"] = mode;
    var ret = new HarmonicFunction.HarmonicFunction2(arguments_json);

    return ret
}

//todo obsluga i wyswietlanie bledow co i gdzie jest nie tak dokladnie w pliku

function parse(input) {
    //       try {
    var lines = input.split("\n")

    var key = lines[0]

    var mode = null

    if (Utils.contains(Consts.possible_keys_major, key)){
        mode = Consts.MODE.MAJOR
    } else if (Utils.contains(Consts.possible_keys_minor, key)){
        mode = Consts.MODE.MINOR
    } else {
        throw new Errors.HarmonicFunctionsParserError("Unrecognized key", key)
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


    return new Exercise.Exercise(key, metre, mode, measures)

//        } catch (error) {
//            console.log("Error during parsing file!")
//            console.log(error)
//            return null
//        }
}
