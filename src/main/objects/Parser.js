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

function parseChord(string, withoutFirstChar, withoutLastChar) {
    if (withoutFirstChar) string = string.substring(1, string.length)
    if (withoutLastChar) string = string.substring(0, string.length - 1)

    var i = 0
    while (i < string.length && string[i] !== '{') {
        i++
    }
    var chord_type = string.substring(0, i)
    var arguments = string.substring(i, string.length)

    if (arguments === null || arguments.length < 2 || chord_type.length > 2) {
        return undefined
    }
    var mode;
    if(chord_type.length === 2 && chord_type[1] === "o") mode = Consts.MODE.MINOR;
    var arguments_json = JSON.parse(arguments);
    arguments_json["functionName"] = chord_type[0];
    arguments_json["mode"] = mode;
    return new HarmonicFunction.HarmonicFunction2(arguments_json)
}

function getKeyFromPitchBasenoteAndModeOrThrowError(pitch, basenote, mode) {
    var mapKey = pitch.toString() + "," + basenote.toString() + "," + mode
    var key = Consts.keyFromPitchBasenoteAndMode[mapKey]
    if (key === undefined) {
        throw new Errors.ProbablyUnexpectedError("Could not find key for given pitch, basenote and mode",
            "Pitch: " + pitch + " Basenote: " + basenote + " Mode: " + mode)
    } else {
        return key
    }
}

function calculateKey(key, nextChordAfterWtracenie) {

    var keyToUse = key
    if (nextChordAfterWtracenie.key !== undefined) {
        keyToUse = nextChordAfterWtracenie.key
    }

    var pitchesToUse = Utils.contains(Consts.possible_keys_major, keyToUse) ?
        [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10]

    var keyPitch = Costs.keyStrPitch[keyToUse] + pitchesToUse[nextChordAfterWtracenie.degree - 1]
    keyPitch = keyPitch >= 72 ? keyPitch - 12 : keyPitch

    var keyBaseNote = Utils.mod(Consts.keyStrBase[keyToUse] + nextChordAfterWtracenie.degree - 1, 7)

    var primePitch = pitchesToUse[nextChordAfterWtracenie.degree - 1]
    var threePitch = pitchesToUse[Utils.mod(nextChordAfterWtracenie.degree + 1, 7)]
    var difference = threePitch - primePitch

    var modeToUse = (difference === 4 || difference === 8) ? Consts.MODE.MAJOR : Consts.MODE.MINOR

    return getKeyFromPitchBasenoteAndModeOrThrowError(keyPitch, keyBaseNote, modeToUse)
}

function getSpecificChord(measures, i) {
    var currentChordNumber = 0
    for (var a = 0; a < measures.length; a++) {
        for (var b = 0; b < measures[a].length; b++) {
            if (currentChordNumber === i) {
                return measures[a][b]
            } else {
                currentChordNumber++
            }
        }
    }
    return undefined
}

function applyKeyToChords(measures, beginning, end, key) {
    var modeToApply;
    if (Utils.contains(Consts.possible_keys_major, key)) {
        modeToApply = Consts.MODE.MAJOR
    } else {
        modeToApply = Consts.MODE.MINOR
    }

    for (var i = beginning; i < end; i++){
        var chord = getSpecificChord(measures, i)
        chord.key = key
        chord.mode = chord.functionName === Consts.FUNCTION_NAMES.DOMINANT ? Consts.MODE.MAJOR : modeToApply
    }

}



function handleWtracenia(measures, key, wtracenia){

    var nextChordAfterWtracenie = undefined
    var keyForWtracenie = undefined

    for (var i = wtracenia.length - 1; i >= 0; --i) {
        nextChordAfterWtracenie = getSpecificChord(measures, wtracenia[i][1] + 1)
        if (nextChordAfterWtracenie === undefined) {
            throw new Errors.HarmonicFunctionsParserError("Wtracenie cannot be the last chord")
        }
        keyForWtracenie = calculateKey(key, nextChordAfterWtracenie)
        applyKeyToChords(measures, wtracenia[i][0], wtracenia[i][1], keyForWtracenie)
    }
}


function parse(input) {

    var lines = input.split("\n")

    var key = lines[0]

    var mode = null

    if (Utils.contains(Consts.possible_keys_major, key)) {
        mode = Consts.MODE.MAJOR
    } else if (Utils.contains(Consts.possible_keys_minor, key)) {
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

    var insideWtracenie = false
    var wtracenia = []
    var wtracenieBegining = undefined
    var chordNumber = 0

    var dropFirstChar = false
    var dropLastChar = false

    for (var i = 2; i < lines.length; i++) {
        if(!lines[i] || lines[i].startsWith("//")) continue
        var chords = lines[i].split(";")
        var chords_parsed = []
        for (var j = 0; j < chords.length; j++) {
            dropFirstChar = false
            dropLastChar = false

            if (chords[j][0] === '(') {
                if (insideWtracenie) {
                    throw new Errors.HarmonicFunctionsParserError("Wtracenie cannot be inside another wtracenie.", chords[j])
                }
                wtracenieBegining = chordNumber
                insideWtracenie = true
                dropFirstChar = true
            }

            if (chords[j][chords[j].length - 1] === ')') {
                if (!insideWtracenie) {
                    throw new Errors.HarmonicFunctionsParserError("Unexpected end of wtracenie:", chords[j])
                }
                insideWtracenie = false
                wtracenia.push([wtracenieBegining, chordNumber])
                dropLastChar = true
            }

            chords_parsed.push(parseChord(chords[j], dropFirstChar, dropLastChar))
            chordNumber++
        }
        measures.push(chords_parsed)
    }

    if(DEBUG) Utils.log("Parsed measures", JSON.stringify(measures))

    if (wtracenia.length !== 0){
        handleWtracenia(measures, key, wtracenia)
        if(DEBUG) Utils.log("Parsed measures after handling wtracenia", JSON.stringify(measures))
    }

    return new Exercise.Exercise(key, metre, mode, measures)

}
