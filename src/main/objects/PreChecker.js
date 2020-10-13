.import "./Errors.js" as Errors
.import "./RulesChecker.js" as Checker
.import "./Consts.js" as Consts

function checkDSConnection(harmonicFunctions) {
    for (var i = 0; i < harmonicFunctions.length - 1; i++) {
        if (harmonicFunctions[i].functionName === Consts.FUNCTION_NAMES.DOMINANT
            && harmonicFunctions[i + 1].functionName === Consts.FUNCTION_NAMES.SUBDOMINANT
            && harmonicFunctions[i].mode === Consts.MODE.MAJOR) {
            throw new Errors.PreCheckerError("Forbidden connection: D->S", "Chords: " + (i + 1) + " " + (i + 2)
                , "Chord " + (i + 1) + "\n" + JSON.stringify(harmonicFunctions[i-1])
                + "\nChord " + (i + 2) + "\n" + JSON.stringify(harmonicFunctions[i]))
        }
    }
}

function checkForImpossibleConnections(harmonicFunctions, chordGenerator, bassLine) {
    var currentChords //TODO cos jest nie tak, bo solver przechodzi do 30 - ale się tam zatrzymuje, więc coś jest nie tak, a prechecker nie wywala, prechecker wywala na 5 6 7 chyba
    var prevChords = undefined
    var goodCurrentChords = []
    var goodPrevChords = []
    var usedPrevChords = []
    var foundConnection = false
    var usedCurrentChords = []
    var score
    var allConnections = 0
    var prevPrevChords = undefined
    var goodPrevPrevChords = []

    var chordsPossibleToUse = []

    var brokenRulesCounter = Checker.getInitializedBrokenRulesCounter()

    for (var i = 0; i < harmonicFunctions.length; i++) {
        allConnections = 0
        if (i !== 0) {
            console.log("goodCurrentChords length " + goodCurrentChords.length)
            prevChords = goodCurrentChords
        }
        if (i > 1) {
            console.log("goodPrevChords length " + goodPrevChords.length)
            prevPrevChords = goodPrevChords
        }
        goodCurrentChords = []
        usedCurrentChords = []
        goodPrevChords = []
        goodPrevPrevChords = []
        if (bassLine !== undefined) {
            currentChords = chordGenerator.generate(harmonicFunctions[i], [bassLine[i], undefined, undefined, undefined])
        } else {
            currentChords = chordGenerator.generate(harmonicFunctions[i])
        }

        if (currentChords.length === 0) {
            throw new Errors.PreCheckerError("Could not generate any chords for chord " + (i + 1))
        }

        for (var a = 0; a < currentChords.length; a++) {
            usedCurrentChords.push(false)
        }

        if (i > 0) {
            for (var a = 0; a < prevChords.length; a++) {
                usedPrevChords.push(false)
            }
        }
        brokenRulesCounter = Checker.getInitializedBrokenRulesCounter()

        if (i > 1) {
            for (var z = 0; z < prevPrevChords.length; z++) {
                foundConnection = false
                for (var a = 0; a < prevChords.length; a++) {
                    for (var b = 0; b < currentChords.length; b++) {
                        console.log(i, z, a,b)
                        allConnections++
                        score = Checker.checkAllRules(prevPrevChords[z], prevChords[a], currentChords[b], brokenRulesCounter)
                        if (score !== -1) {
                            foundConnection = true
                            if (!usedCurrentChords[b]) {
                                goodCurrentChords.push(currentChords[b])
                                usedCurrentChords[b] = true
                            }
                            if (!usedPrevChords[a]) {
                                goodPrevChords.push(prevChords[a])
                                usedPrevChords[a] = true
                            }
                        }
                    }
                }
                if (foundConnection) {
                    goodPrevPrevChords.push(prevPrevChords[z])
                }
            }
        } else if (i !== 0) {
            for (var a = 0; a < prevChords.length; a++) {
                foundConnection = false
                for (var b = 0; b < currentChords.length; b++) {
                    //console.log(i, a,b)
                    allConnections++
                    score = Checker.checkAllRules(undefined, prevChords[a], currentChords[b], brokenRulesCounter)
                    if (score !== -1) {
                        foundConnection = true
                        if (!usedCurrentChords[b]) {
                            goodCurrentChords.push(currentChords[b])
                            usedCurrentChords[b] = true
                        }
                    }
                }
                if (foundConnection) {
                    goodPrevChords.push(prevChords[a])
                }
            }
        } else {
            for (var b = 0; b < currentChords.length; b++) {
                score = Checker.checkAllRules(undefined, undefined, currentChords[b], brokenRulesCounter)
                if (score !== -1) {
                    goodCurrentChords.push(currentChords[b])
                }
            }
        }

        brokenRulesCounter.allConnections = allConnections

        if (goodCurrentChords.length === 0) {
            var brokenRulesStringInfo = brokenRulesCounter.getBrokenRulesStringInfo()
            console.log(brokenRulesStringInfo)
            console.log(JSON.stringify(brokenRulesCounter))
            if (i > 1) {
                throw new Errors.PreCheckerError("Could not find valid connection between chords " + (i - 1) + ", " + (i) + " and " + (i + 1),
                    "Chord " + (i - 1) + "\n" + JSON.stringify(harmonicFunctions[i-2])
                    + "\nChord " + i + "\n" + JSON.stringify(harmonicFunctions[i-1])
                    + "\nChord " + (i + 1) + "\n" + JSON.stringify(harmonicFunctions[i])
                    + "\n" + brokenRulesStringInfo
                )
            }
            else if (i !== 0) {
                throw new Errors.PreCheckerError("Could not find valid connection between chords " + (i) + " and " + (i + 1),
                    "Chord " + i + "\n" + JSON.stringify(harmonicFunctions[i-1])
                    + "\nChord " + (i + 1) + "\n" + JSON.stringify(harmonicFunctions[i])
                    + "\n" + brokenRulesStringInfo
                )
            } else {
                console.log("going to throw error...")
                throw new Errors.PreCheckerError("Could not generate any correct chord for first chord",
                    JSON.stringify(harmonicFunctions[0]) + "\n" + brokenRulesStringInfo)
            }
        } else {
            if (i > 1) {
                console.log(JSON.stringify(goodPrevPrevChords))
                chordsPossibleToUse.push(goodPrevPrevChords)
            }
        }
    }
    chordsPossibleToUse.push(goodPrevChords)
    chordsPossibleToUse.push(goodCurrentChords)

    console.log(JSON.stringify(chordsPossibleToUse))
}

function preCheck(harmonicFunctions, chordGenerator, bassLine, sopranoLine) {
    if (sopranoLine !== undefined) {
        //we do not precheck soprano exercises, since there are more than one possible exercises considered and
        //we create those harmonic function exercises by ourselves
        return
    }
    checkDSConnection(harmonicFunctions)
    checkForImpossibleConnections(harmonicFunctions, chordGenerator, bassLine)
    //console.log("precheck done")
}


