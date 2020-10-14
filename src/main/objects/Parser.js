.import "./Consts.js" as Consts
.import "./Exercise.js" as Exercise
.import "./HarmonicFunction.js" as HarmonicFunction
.import "./Utils.js" as Utils
.import "./Errors.js" as Errors
.import "./Scale.js" as Scale
.import "./IntervalUtils.js" as IntervalUtils

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

function calculateKey(key, deflectionTargetChord) {

    var keyToUse = key
    if (deflectionTargetChord.key !== undefined) {
        keyToUse = deflectionTargetChord.key
    }

    var pitchesToUse = Utils.contains(Consts.possible_keys_major, keyToUse) ?
        new Scale.MajorScale("C").pitches : new Scale.MinorScale("c").pitches

    var keyPitch = Consts.keyStrPitch[keyToUse] + pitchesToUse[deflectionTargetChord.degree - 1]
    keyPitch = keyPitch >= 72 ? keyPitch - 12 : keyPitch

    var keyBaseNote = Utils.mod(Consts.keyStrBase[keyToUse] + deflectionTargetChord.degree - 1, 7)
    if(deflectionTargetChord.down) {
        keyPitch--
        if(keyPitch < 60)
            keyPitch += 12
    }
    var modeToUse = IntervalUtils.getThirdMode(key, deflectionTargetChord.degree - 1)

    if(deflectionTargetChord.down)
        modeToUse = Consts.MODE.MAJOR

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

function applyKeyAndModeToSpecificChord(measures, key, mode, i, isRelatedBackwards) {
    var currentChordNumber = 0
    for (var a = 0; a < measures.length; a++) {
        for (var b = 0; b < measures[a].length; b++) {
            if (currentChordNumber === i) {
                measures[a][b].key = key
                if (DEBUG) Utils.log("mode")
                measures[a][b].mode = measures[a][b].functionName === Consts.FUNCTION_NAMES.DOMINANT ? Consts.MODE.MAJOR : measures[a][b].mode
                if (DEBUG) Utils.log("mode", measures[a][b].mode)
                measures[a][b].isRelatedBackwards = isRelatedBackwards
                if (DEBUG) Utils.log("isRelatedBackwards", measures[a][b].isRelatedBackwards)
                return
            } else {
                currentChordNumber++
            }
        }
    }
}

function applyKeyToChords(measures, beginning, end, key, deflectionType) {
    var modeToApply = Utils.getModeFromKey(key)

    for (var i = beginning; i <= end; i++) {
        if (DEBUG) Utils.log(i)
        applyKeyAndModeToSpecificChord(measures, key, modeToApply, i, deflectionType === Consts.DEFLECTION_TYPE.BACKWARDS)
    }
}



function handleDeflections(measures, key, deflections){

    if (DEBUG) Utils.log("Handling deflections")
    if (DEBUG) Utils.log(JSON.stringify(deflections))

    var nextChordAfterDeflection = undefined
    var prevChordBeforeDeflection = undefined
    var elipseChord = undefined
    var keyForDeflection = undefined

    for (var i = 0; i < deflections.length; ++i) {
        if (DEBUG) Utils.log(JSON.stringify(deflections[i]))
        if(deflections[i][2] === Consts.DEFLECTION_TYPE.BACKWARDS){
            prevChordBeforeDeflection = getSpecificChord(measures, deflections[i][0] - 1)
            if (DEBUG) Utils.log("prevChordBeforeDeflection", prevChordBeforeDeflection)
            if (prevChordBeforeDeflection === undefined) {
                throw new Errors.HarmonicFunctionsParserError("Backward deflection cannot be the first chord")
            }
            keyForDeflection = calculateKey(key, prevChordBeforeDeflection)
            if (DEBUG) Utils.log("keyForDeflection", keyForDeflection)
            applyKeyToChords(measures, deflections[i][0], deflections[i][1], keyForDeflection, Consts.DEFLECTION_TYPE.BACKWARDS)
        }
        if(deflections[i][2] === Consts.DEFLECTION_TYPE.ELIPSE){
            if (DEBUG) Utils.log(JSON.stringify(deflections[i]))
            elipseChord = getSpecificChord(measures, deflections[i][1])
            if (elipseChord === undefined) {
                throw new Errors.HarmonicFunctionsParserError("Elipse cannot be empty.")
            }
            if (DEBUG) Utils.log("elipseChord", elipseChord)
            keyForDeflection = calculateKey(key, elipseChord)
            elipseChord.functionName = Consts.FUNCTION_NAMES.TONIC
            elipseChord.degree = 6
            if (DEBUG) Utils.log("keyForDeflection", keyForDeflection)
            applyKeyToChords(measures, deflections[i][0], deflections[i][1], keyForDeflection, Consts.DEFLECTION_TYPE.ELIPSE)
        }
    }

    for (var i = deflections.length - 1; i >= 0; --i) {
        if (DEBUG) Utils.log(JSON.stringify(deflections[i]))
        if(deflections[i][2] === Consts.DEFLECTION_TYPE.CLASSIC){
            nextChordAfterDeflection = getSpecificChord(measures, deflections[i][1] + 1)
            if (DEBUG) Utils.log("nextChordAfterDeflection", nextChordAfterDeflection)
            if (nextChordAfterDeflection === undefined) {
                throw new Errors.HarmonicFunctionsParserError("Deflection cannot be the last chord")
            }
            if(nextChordAfterDeflection.isRelatedBackwards){
                throw new Errors.HarmonicFunctionsParserError("Backward deflection could not be after forward deflection.", JSON.stringify(nextChordAfterDeflection))
            }
            keyForDeflection = calculateKey(key, nextChordAfterDeflection)
            if (DEBUG) Utils.log("keyForDeflection", keyForDeflection)
            applyKeyToChords(measures, deflections[i][0], deflections[i][1], keyForDeflection, Consts.DEFLECTION_TYPE.CLASSIC)
        }
    }
}

function parse(input) {
    input = input.replace(/\r/g,"")

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

    var insideDeflection = false
    var deflections = []
    var deflectionBeginning = undefined
    var deflectionType = undefined
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
            if (DEBUG) Utils.log("Current chord: ", JSON.stringify(chords[j]))

            if(chords[j][0] === '['){
                if(insideDeflection){
                    throw new Errors.HarmonicFunctionsParserError("Elipse cannot be inside deflection.", chords[j])
                } else if(j === 0){
                    if(!chords[j].endsWith(']')){
                        throw new Errors.HarmonicFunctionsParserError("There could be only one chord in elipse.", chords[j]);
                    }
                    var parsedElipse = parseChord(chords[j], true, true);
                    chords_parsed.push(parsedElipse);
                    deflectionType = Consts.DEFLECTION_TYPE.ELIPSE;
                    if(deflections[deflections.length - 1][1] !== chordNumber - 1){
                        throw new Errors.HarmonicFunctionsParserError("Elipse must be preceded by deflection", chords[j])
                    }
                    deflections[deflections.length - 1][1] = chordNumber
                    deflections[deflections.length - 1][2] = deflectionType
                    chordNumber ++
                    continue;
                } else {
                    throw new Errors.HarmonicFunctionsParserError("Elipse must be preceded by deflection", chords[j])
                }
            }

            if (chords[j][0] === '(') {
                if(chords[j][1] === '['){
                    throw new Errors.HarmonicFunctionsParserError("Elipse cannot be inside deflection.", chords[j])
                }
                if (insideDeflection) {
                    throw new Errors.HarmonicFunctionsParserError("Deflection cannot be inside another deflection.", chords[j])
                }
                if (DEBUG) Utils.log("Inside deflection")
                deflectionBeginning = chordNumber
                insideDeflection = true
                dropFirstChar = true
            }

            if (chords[j][chords[j].length - 1] === ')') {
                if (!insideDeflection) {
                    throw new Errors.HarmonicFunctionsParserError("Unexpected end of deflection:", chords[j])
                }
                if (DEBUG) Utils.log("Exiting deflection")
                insideDeflection = false
                dropLastChar = true
            }

            var parsedChord = parseChord(chords[j], dropFirstChar, dropLastChar)
            chords_parsed.push(parsedChord)
            if(chords[j][0] === '('){
                if(parsedChord === undefined) {
                    throw new Errors.HarmonicFunctionsParserError("Deflection cannot be empty.", chords[j])
                }
                deflectionType = parsedChord.isRelatedBackwards ? Consts.DEFLECTION_TYPE.BACKWARDS :  Consts.DEFLECTION_TYPE.CLASSIC
            }
            if(chords[j][chords[j].length - 1] === ')'){
                if(j < chords.length-1 && chords[j+1].startsWith("[")){
                    j++;
                    if(!chords[j].endsWith(']')){
                        throw new Errors.HarmonicFunctionsParserError("There could be only one chord in elipse.", chords[j]);
                    }
                    var parsedElipse = parseChord(chords[j], true, true);
                    chords_parsed.push(parsedElipse);
                    deflectionType = Consts.DEFLECTION_TYPE.ELIPSE;
                    chordNumber++;
                }
                deflections.push([deflectionBeginning, chordNumber, deflectionType])
            }
            chordNumber++
        }
        measures.push(chords_parsed)
    }

    if (insideDeflection) {
        throw new Errors.HarmonicFunctionsParserError("There is unclosed deflection")
    }

    if (DEBUG) Utils.log("Parsed measures", JSON.stringify(measures))

    if (deflections.length !== 0){
        handleDeflections(measures, key, deflections)
        if (DEBUG) Utils.log("Parsed measures after handling deflections", JSON.stringify(measures))
    }

    return new Exercise.Exercise(key, metre, mode, measures)

}
