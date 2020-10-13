.import "./Errors.js" as Errors
.import "./RulesChecker.js" as Checker
.import "./Consts.js" as Consts

function checkDSConnection(harmonicFunctions) {
    for (var i = 0; i < harmonicFunctions.length - 1; i++) {
        if (harmonicFunctions[i].functionName === Consts.FUNCTION_NAMES.DOMINANT
            && harmonicFunctions[i + 1].functionName === Consts.FUNCTION_NAMES.SUBDOMINANT
            && harmonicFunctions[i].mode === Consts.MODE.MAJOR
            && harmonicFunctions[i].key === harmonicFunctions[i+1].key) {
            throw new Errors.PreCheckerError("Forbidden connection: D->S", "Chords: " + (i + 1) + " " + (i + 2)
                , "Chord " + (i + 1) + "\n" + JSON.stringify(harmonicFunctions[i-1])
                + "\nChord " + (i + 2) + "\n" + JSON.stringify(harmonicFunctions[i]))
        }
    }
}

function checkForImpossibleConnections(harmonicFunctions, chordGenerator, bassLine) {
    var currentChords
    var prevChords = undefined
    var goodCurrentChords = []
    var usedCurrentChords = []
    var score
    var chordsWithDelays = 0

    var isBassDefined = bassLine !== undefined

    for (var i = 0; i < harmonicFunctions.length; i++) {
        if(harmonicFunctions[i].delay.length > 0){
            chordsWithDelays += (harmonicFunctions[i].delay[0].length - 1)
        }
        if (i !== 0) {
            prevChords = goodCurrentChords
        }
        goodCurrentChords = []
        usedCurrentChords = []
        if (isBassDefined) {
            currentChords = chordGenerator.generate(harmonicFunctions[i], [bassLine[i], undefined, undefined, undefined])
        } else {
            currentChords = chordGenerator.generate(harmonicFunctions[i])
        }

        if (currentChords.length === 0) {
            console.log(harmonicFunctions[i])
            throw new Errors.PreCheckerError("Could not generate any chords for chord " + (i + 1  - chordsWithDelays))
        }

        for (var a = 0; a < currentChords.length; a++) {
            usedCurrentChords.push(false)
        }

        if (i !== 0) {
            for (var a = 0; a < prevChords.length; a++) {
                for (var b = 0; b < currentChords.length; b++) {
                    if (!usedCurrentChords[b]) {
                        score = Checker.checkAllRules(undefined, prevChords[a], currentChords[b], isBassDefined)
                        if (score !== -1) {
                            goodCurrentChords.push(currentChords[b])
                            usedCurrentChords[b] = true
                        }
                    }
                }
            }
        } else {
            for (var b = 0; b < currentChords.length; b++) {
                score = Checker.checkAllRules(undefined, undefined, currentChords[b], isBassDefined)
                if (score !== -1) {
                    goodCurrentChords.push(currentChords[b])
                }
            }
        }

        if (goodCurrentChords.length === 0) {
            if (i !== 0) {
                throw new Errors.PreCheckerError("Could not find valid connection between chords " + (i - chordsWithDelays) + " and " + (i + 1 - chordsWithDelays),
                    "Chord " + i + "\n" + JSON.stringify(harmonicFunctions[i-1])
                    + "\nChord " + (i + 1) + "\n" + JSON.stringify(harmonicFunctions[i]))
            } else {
                throw new Errors.PreCheckerError("Could not generate any correct chord for first chord", JSON.stringify(harmonicFunctions[0]))
            }
        }
    }
}

function preCheck(harmonicFunctions, chordGenerator, bassLine, sopranoLine) {
    if (sopranoLine !== undefined) {
        //we do not precheck soprano exercises, since there are more than one possible exercises considered and
        //we create those harmonic function exercises by ourselves
        return
    }
    checkDSConnection(harmonicFunctions)
    checkForImpossibleConnections(harmonicFunctions, chordGenerator, bassLine)
}


