.import "./FiguredBass.js" as FiguredBass
.import "./Utils.js" as Utils
.import "./HarmonicFunction.js" as HarmonicFunction
.import "./Exercise.js" as Exercise
.import "./Consts.js" as Consts
.import "./Errors.js" as Errors

var DEBUG = false;

function ChordElement(notesNumbers, omit, bassElement) {
    this.notesNumbers = notesNumbers
    this.omit = omit
    this.bassElement = bassElement
    this.primeNote = undefined

    this.toString = function () {
        return "NotesNumbers: " + this.notesNumbers + " Omit: " + this.omit + " BassElement: " + this.bassElement + " PrimeNote: " + this.primeNote
    }
}


function BassTranslator() {

    this.makeChoiceAndSplit = function (functions) {

        var ret = []

        for (var i = 0; i < functions.length; i++) {
            if (functions[i].length === 1) {
                ret.push(functions[i][0])
            } else {
                if (i === 0 || i === functions.length - 1) {
                    if (functions[i][0].functionName === "T") {
                        ret.push(functions[i][0])
                    } else {
                        ret.push(functions[i][1])
                    }
                } else if (ret[ret.length - 1].functionName === "D") {
                    if (functions[i][0].functionName === "S") {
                        ret.push(functions[i][1])
                    } else {
                        ret.push(functions[i][0])
                    }
                } else if (i < functions.length - 1 && functions[i + 1].length === 1 && functions[i + 1][0].functionName === "S") {
                    if (functions[i][0].functionName === "D") {
                        ret.push(functions[i][1])
                    } else {
                        ret.push(functions[i][0])
                    }
                } else {
                    ret.push(functions[i][0])
                }
            }
        }
        return [ret]
    }


    this.completeFiguredBassNumbers = function (bassNumbers) {

        //empty -> 3,5
        if (bassNumbers.length === 0) {
            return [3, 5]
        }

        if (bassNumbers.length === 1) {
            // 5 -> 3,5
            if (Utils.contains(bassNumbers, 5)) {
                return [3, 5]
            }

            // 3 -> 3,5 (only alteration symbol)
            if (Utils.contains(bassNumbers, 3)) {
                return [3, 5]
            }

            // 6 -> 3,6
            if (Utils.contains(bassNumbers, 6)) {
                return [3, 6]
            }

            // 7 -> 3,5,7
            if (Utils.contains(bassNumbers, 7)) {
                return [3, 5, 7]
            }

            //2 -> 2,4,6
            if (Utils.contains(bassNumbers, 2)) {
                return [2, 4, 6]
            }
        }

        if (bassNumbers.length === 2) {
            if (Utils.contains(bassNumbers, 3)) {
                //3,4 -> 3,4,6
                if (Utils.contains(bassNumbers, 4)) {
                    return [3, 4, 6]
                } else if (Utils.contains(bassNumbers, 5)) {
                    // 3,5 -> 3,5
                    return [3, 5]
                } else if (Utils.contains(bassNumbers, 6)) {
                    // 3,6 -> 3,6
                    return [3, 6]
                }

            }

            if (Utils.contains(bassNumbers, 4)) {
                //2,4 -> 2,4,6
                if (Utils.contains(bassNumbers, 2)) {
                    return [2, 4, 6]
                } else {
                    //4,6 -> 4,6
                    return [4, 6]
                }
            }

            if (Utils.contains(bassNumbers, 5)) {
                //5,7 -> 3,5,7
                if (Utils.contains(bassNumbers, 7)) {
                    return [3, 5, 7]
                } else if (Utils.contains(bassNumbers, 6)) {
                    //5,6 -> 3,5,6
                    return [3, 5, 6]
                }
            }

            //2,10 -> 2,4,10
            if (Utils.contains(bassNumbers, 2)) {
                return [2, 4, 10]
            }

        }

        if (bassNumbers.length === 3) {

            //6,5,7 -> 6,5,7 (but we save 5,6,7)

            if (Utils.contains(bassNumbers, 6) && Utils.contains(bassNumbers, 5)
                && Utils.contains(bassNumbers, 7)) {
                return [5, 6, 7]
            }

            bassNumbers.sort(function (a, b) {
                (a > b) ? 1 : -1
            })

            //3,5,7 -> 3,5,7
            //3,5,6 -> 3,5,6
            //3,4,6 -> 3,4,6
            //2,4,6 -> 2,4,6
            //2,4,10 -> 2,4,10
            //nothing to add
            return bassNumbers
        }

        throw new Errors.FiguredBassInputError("Invalid bass symbols:", bassNumbers)
    }

    this.completeFiguredBassSymbol = function (element) {

        if (DEBUG) {
            Utils.log("element.symbols.length: " + element.symbols.length)
            Utils.log("element.symbols before: " + element.symbols)
        }

        var bassNumbers = []
        for (var i = 0; i < element.symbols.length; i++){
            if (element.symbols[i].component !== undefined) {
                bassNumbers.push(element.symbols[i].component)
            }
        }
        if (DEBUG) {
            Utils.log("BassNumbers:", bassNumbers)
        }

        var completedBassNumbers = this.completeFiguredBassNumbers(bassNumbers)

        if (DEBUG) Utils.log("completedBassNumbers:", completedBassNumbers)

        if (bassNumbers.length !== completedBassNumbers.length) {
            for (var i = 0; i < completedBassNumbers.length; i++) {
                if (!Utils.contains(bassNumbers, completedBassNumbers[i])) {
                    element.symbols.push(new FiguredBass.BassSymbol(completedBassNumbers[i]))
                }
            }
        }

        element.symbols.sort(function (a, b) {
            (a.component > b.component) ? 1 : -1
        })

    }


    this.buildChordElement = function (bassElement) {

        var chordElement = new ChordElement([bassElement.bassNote.baseNote], [], bassElement)

        for (var i = 0; i < bassElement.symbols.length; i++) {
            chordElement.notesNumbers.push(bassElement.bassNote.baseNote
                + bassElement.symbols[i].component - 1)
        }

        return chordElement
    }

    this.hasTwoNextThirds = function (chordElement) {
        if (chordElement.notesNumbers.length < 3) {
            return false
        }

        for (var i = 0; i < chordElement.notesNumbers.length; i++) {

            var n1 = Utils.mod(chordElement.notesNumbers[i], 7)
            var n2 = Utils.mod(chordElement.notesNumbers[Utils.mod(i + 1, chordElement.notesNumbers.length)], 7)
            var n3 = Utils.mod(chordElement.notesNumbers[Utils.mod(i + 2, chordElement.notesNumbers.length)], 7)

            if ((Utils.abs(n2 - n1) === 2 || Utils.abs(n2 - n1) === 5)
                && (Utils.abs(n3 - n2) === 2 || Utils.abs(n3 - n2) === 5)) {
                return true
            }
        }
        return false
    }

    this.addNextNote = function (chordElement) {
        for (var i = 0; i < chordElement.notesNumbers.length - 1; i++) {
            if (chordElement.notesNumbers[i + 1] - chordElement.notesNumbers[i] >= 4) {
                var temp = []

                for (var j = 0; j < chordElement.notesNumbers.length; j++) {
                    temp.push(chordElement.notesNumbers[j])
                    if (j === i) {
                        temp.push(chordElement.notesNumbers[j] + 2)
                    }
                }
                chordElement.notesNumbers = temp
                if (chordElement.notesNumbers.length >= 5) {
                    chordElement.omit.push(Utils.mod((chordElement.notesNumbers[chordElement.notesNumbers.length - 1]), 7) + 1)
                }
                return
            }
        }
        chordElement.notesNumbers.push(chordElement.notesNumbers[chordElement.notesNumbers.length - 1] + 2)
        if (chordElement.notesNumbers.length >= 5) {
            chordElement.omit.push(Utils.mod((chordElement.notesNumbers[chordElement.notesNumbers.length - 1]), 7) + 1)
        }
    }

    this.completeUntillTwoNextThirds = function (chordElement) {

        while (!this.hasTwoNextThirds(chordElement)) {
            this.addNextNote(chordElement)
        }
    }

    this.findPrime = function (chordElement) {

        var scaleNotes = []
        var primeNote = undefined //from 0 to 6

        for (var i = 0; i < chordElement.notesNumbers.length; i++) {
            scaleNotes.push(Utils.mod(chordElement.notesNumbers[i], 7))
        }

        if (DEBUG) Utils.log( "Scale Notes: ", scaleNotes.toString())

        for (var i = 0; i < scaleNotes.length; i++) {
            var note = scaleNotes[i]
            //console.log(note)

            while (Utils.contains(scaleNotes, Utils.mod((note - 2), 7))) {
                note = Utils.mod((note - 2), 7)
            }
            //console.log(note)

            if (Utils.contains(scaleNotes, Utils.mod((note + 2), 7)) && Utils.contains(scaleNotes, Utils.mod((note + 4), 7))) {
                primeNote = note
                break
            }
        }

        if (primeNote !== undefined) {
            chordElement.primeNote = primeNote
        } else {
            chordElement.primeNote = scaleNotes[0]
        }
        if (DEBUG) Utils.log("Prime note: " + chordElement.primeNote)
    }

    this.getValidFunctions = function (chordElement, key) {
        var primeNote = chordElement.primeNote
        if (DEBUG) Utils.log("Chordelement:",chordElement)
        if (DEBUG) Utils.log("key: " + key)

        primeNote -= Consts.keyStrBase[key]
        if (DEBUG) Utils.log("primeNote: " + primeNote)
        if (DEBUG) Utils.log("Consts.keyStrBase[key]: " + Consts.keyStrBase[key])

        primeNote = Utils.mod(primeNote, 7)
        switch (primeNote) {
            case 0:
                return ["T"]
            case 1:
                return ["S"]
            case 2:
                return ["T", "D"]
            case 3:
                return ["S"]
            case 4:
                return ["D"]
            case 5:
                return ["T", "S"]
            case 6:
                return ["D"]
        }
    }

    this.getSortedSymbolsFromChordElement = function (chordElement) {
        var symbols = []

        for (var i = 0; i < chordElement.bassElement.symbols.length; i++) {
            symbols.push(chordElement.bassElement.symbols[i].component)
        }

        symbols.sort(function (a, b) {
            (a > b) ? 1 : -1
        })

        return symbols
    }


    this.getValidPosition = function (chordElement) {

        var symbols = this.getSortedSymbolsFromChordElement(chordElement)

        if (symbols.equals([5, 6, 7]) ||
            symbols.equals([2, 4, 10])) {
            return 9
        } else {
            return undefined
        }

    }

    this.getValidPositionAndRevolution = function (chordElement, mode, functionName) {

        var revolution = 1

        var prime = chordElement.primeNote

        var bass = chordElement.bassElement.bassNote.baseNote

        while (bass !== prime) {
            bass = Utils.mod((bass - 1), 7)
            revolution++
        }

        var position = this.getValidPosition(chordElement)

        return [position, revolution]
    }

    this.addExtraAndOmit = function (extra, omit, chordElement) {
        var symbols = this.getSortedSymbolsFromChordElement(chordElement)

        if (symbols.equals([3, 5, 7]) || symbols.equals([2, 4, 6]) ||
            symbols.equals([3, 4, 6]) || symbols.equals([3, 5, 6]) ||
            symbols.equals([2, 4, 10]) || symbols.equals([5, 6, 7])) {

            if (!Utils.contains(extra, "7") &&
                !Utils.contains(extra, "7>") &&
                !Utils.contains(extra, "7<")) {
                extra.push("7")
            }
        }

        if (symbols.equals([2, 4, 10]) || symbols.equals([5, 6, 7])) {
            if (!Utils.contains(extra, "9") &&
                !Utils.contains(extra, "9>") &&
                !Utils.contains(extra, "9<")) {
                extra.push("9")
            }

            if (!Utils.contains(omit, "5") &&
                !Utils.contains(omit, "5>") &&
                !Utils.contains(omit, "5<")) {
                omit.push("5")
            }
        }

    }


    this.createHarmonicFunctionOrFunctions = function (chordElement, mode, key, delays) {
        var ret = []

        var functions = this.getValidFunctions(chordElement, key)

        for (var i = 0; i < functions.length; i++) {

            var functionName = functions[i]

            var degree = chordElement.primeNote - Consts.keyStrBase[key] + 1

            var posAndRev = this.getValidPositionAndRevolution(chordElement, mode, functionName)

            var position = posAndRev[0]
            var revolution = posAndRev[1].toString()
            var omit = chordElement.omit
            var down = false
            var system = undefined
            var extra = []

            this.addExtraAndOmit(extra, omit, chordElement)

            var mode1 = undefined

            if (functions[i] === Consts.FUNCTION_NAMES.DOMINANT) {
                mode1 = Consts.MODE.MAJOR
            } else {
                mode1 = mode
            }
            var toAdd = new HarmonicFunction.HarmonicFunction(functionName, degree, position, revolution, delays, extra, omit, down, system, mode1)

            ret.push(toAdd)
        }

        return ret
    }

    this.convertToFunctions = function (figuredBassExercise) {

        var harmonicFunctions = []
        var chordElements = []

        var bassElements = figuredBassExercise.elements

        for (var i = 0; i < bassElements.length; i++) {

            if (DEBUG) Utils.log("Bass elements before complete:", bassElements[i])
            this.completeFiguredBassSymbol(bassElements[i])
            if (DEBUG) Utils.log("Bass elements after complete ", bassElements[i])
            if (DEBUG) Utils.log("element.symbols after: " + bassElements[i].symbols)


            var chordElement = this.buildChordElement(bassElements[i])
            if (DEBUG) Utils.log("Chord element ", chordElement)

            this.completeUntillTwoNextThirds(chordElement)

            this.findPrime(chordElement)
            if (DEBUG) Utils.log("Chord element:",chordElement)

            var harmFunction = this.createHarmonicFunctionOrFunctions(chordElement,
                figuredBassExercise.mode,
                figuredBassExercise.key,
                bassElements[i].delays)

            bassElements[i].bassNote.chordComponent = parseInt(harmFunction[0].revolution)

            if (DEBUG) Utils.log("Harmonic function:",harmFunction)

            harmonicFunctions.push(harmFunction)
            chordElements.push(chordElement)
        }

        return [chordElements, harmonicFunctions]
    }

    this.convertBassToHarmonicFunctions = function (figuredBassExercise) {
        var chordElementsAndHarmonicFunctions = this.convertToFunctions(figuredBassExercise)

        var functions = chordElementsAndHarmonicFunctions[1]
        var elements = chordElementsAndHarmonicFunctions[0]

        if (DEBUG) Utils.log("Harmonic functions before split:",functions)
        return [elements, this.makeChoiceAndSplit(functions)]
    }


    this.handleAlterations = function (harmonicFunctions, chordElements, mode, meter, durations) {

        if (DEBUG) Utils.log("Handle Alterations")
        if (DEBUG) Utils.log("harmonicFunctions:", JSON.stringify(harmonicFunctions))
        if (DEBUG) Utils.log("chordElements:", JSON.stringify(chordElements))
        if (DEBUG) Utils.log("mode:", JSON.stringify(mode))
        if (DEBUG) Utils.log("meter:", JSON.stringify(meter))
        if (DEBUG) Utils.log("durations:", JSON.stringify(durations))

        for (var i = 0; i < harmonicFunctions[0].length; i++) {

            var toOmit = []
            var toExtra = []

            for (var j = 0; j < chordElements[i].bassElement.symbols.length; j++) {

                if (chordElements[i].bassElement.symbols[j].alteration !== undefined) {

                    var number = chordElements[i].bassElement.symbols[j].component !== undefined ? chordElements[i].bassElement.symbols[j].component : 3;
                    var alteration = undefined

                    var baseNoteToAlter = Utils.mod(number + chordElements[i].bassElement.bassNote.baseNote - 1, 7)
                    if (DEBUG) Utils.log("baseNoteToAlter: " + baseNoteToAlter)

                    if (chordElements[i].bassElement.symbols[j].alteration === Consts.ALTERATIONS.NATURAL) {
                        //nothing?
                    } else if (chordElements[i].bassElement.symbols[j].alteration === Consts.ALTERATIONS.SHARP) {
                        alteration = "<"
                    } else {
                        alteration = ">"
                    }
                    if (DEBUG) Utils.log("Alteration: " + alteration)

                    var componentToAlter = Utils.mod(baseNoteToAlter - chordElements[i].primeNote, 7) + 1
                    if (DEBUG) Utils.log("componentToAlter: " + componentToAlter)

                    if (alteration !== undefined) {
                        toOmit.push(componentToAlter)
                        toExtra.push(componentToAlter + alteration)
                    } else {
                        for (var a = 0; a < toOmit.length; a++) {
                            if (toOmit[a] === componentToAlter) {
                                toOmit.splice(a, 1)
                                toExtra.splice(a, 1)
                                break
                            }
                        }
                    }
                }
            }

            //Utils.log("toOmit", JSON.stringify(toOmit))
            //Utils.log("toExtra", JSON.stringify(toExtra))

            if (toOmit.length === 1 && Utils.contains(toOmit, 3)) {
                if (mode === Consts.MODE.MINOR && toExtra[0] === "3<") {
                    if (DEBUG) Utils.log("Changing chord mode to major")
                    harmonicFunctions[0][i].mode = Consts.MODE.MAJOR;
                }
                if (mode === Consts.MODE.MAJOR && toExtra[0] === "3>") {
                    if (DEBUG) Utils.log("Changing chord mode to minor")
                    harmonicFunctions[0][i].mode = Consts.MODE.MINOR;
                }
            } else {
                for (var a = 0; a < toOmit.length; a++) {

                    if (harmonicFunctions[0][i].omit === undefined) {
                        harmonicFunctions[0][i].omit = []
                    }
                    if (harmonicFunctions[0][i].extra === undefined) {
                        harmonicFunctions[0][i].extra = []
                    }

                    harmonicFunctions[0][i].omit.push(toOmit[a])
                    harmonicFunctions[0][i].extra.push(toExtra[a])
                }
            }

        }
    }

    this.isD7 = function(harmonicFunction) {
        return harmonicFunction.functionName === Consts.FUNCTION_NAMES.DOMINANT &&
            (Utils.contains(harmonicFunction.extra, "7") || Utils.contains(harmonicFunction.extra, ">7") ||
                Utils.contains(harmonicFunction.extra, "<7"));
    }

    this.isT = function(harmonicFunction) {
        return harmonicFunction.functionName === Consts.FUNCTION_NAMES.TONIC;
    }

    this.hasOmit5 = function(harmonicFunction) {
        return (Utils.contains(harmonicFunction.omit, "5") || Utils.contains(harmonicFunction.omit, ">5") ||
            Utils.contains(harmonicFunction.omit, "<5"))
    }

    this.handleD7_TConnection = function(harmonicFunctions){
        for (var i = 0; i < harmonicFunctions[0].length - 1; i++) {
            if (this.isD7(harmonicFunctions[0][i]) && this.isT(harmonicFunctions[0][i + 1])) {
                if (!this.hasOmit5(harmonicFunctions[0][i + 1])) {
                    harmonicFunctions[0][i + 1].omit.push("5")
                }
            }
        }
    }


    this.createExerciseFromFiguredBass = function (figuredBassExercise) {
        var chordElementsAndHarmonicFunctions = this.convertBassToHarmonicFunctions(figuredBassExercise)

        var harmonicFunctions = chordElementsAndHarmonicFunctions[1]
        var chordElements = chordElementsAndHarmonicFunctions[0]

        if (DEBUG) Utils.log("Harmonic functions after split",harmonicFunctions)

        var key = figuredBassExercise.mode === Consts.MODE.MAJOR ? figuredBassExercise.key : figuredBassExercise.key.toLowerCase()

        this.handleD7_TConnection(harmonicFunctions)

        this.handleAlterations(harmonicFunctions, chordElements, figuredBassExercise.mode, figuredBassExercise.meter, figuredBassExercise.durations)

        return new Exercise.Exercise(key, figuredBassExercise.meter,
            figuredBassExercise.mode, harmonicFunctions)
    }


}