.import "./FiguredBass.js" as FiguredBass
.import "./Utils.js" as Utils
.import "./HarmonicFunction.js" as HarmonicFunction
.import "./Exercise.js" as Exercise
.import "./Consts.js" as Consts
.import "./Errors.js" as Errors

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

        Utils.log("element.symbols.length: " + element.symbols.length)
        Utils.log("element.symbols before: " + element.symbols)

        var bassNumbers = []
        for (var i = 0; i < element.symbols.length; i++){
            if (element.symbols[i].component !== undefined) {
                bassNumbers.push(element.symbols[i].component)
            }
        }
        Utils.log("BassNumbers:", bassNumbers)

        var completedBassNumbers = this.completeFiguredBassNumbers(bassNumbers)

        Utils.log("completedBassNumbers:", completedBassNumbers)

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

    this.addNextNote = function addNextNote(chordElement) {
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

        Utils.log( "Scale Notes: ", scaleNotes.toString())

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
        Utils.log("Prime note: " + chordElement.primeNote)
    }

    this.getValidFunctions = function (chordElement, key) {
            var primeNote = chordElement.primeNote
        Utils.log("Chordelement:",chordElement)
        Utils.log("key: " + key)

            primeNote -= Consts.keyStrBase[key]
        Utils.log("primeNote: " + primeNote)
        Utils.log("Consts.keyStrBase[key]: " + Consts.keyStrBase[key])

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

    this.getValidPositionAndRevolution = function (harmonicFunction, chordElement) {

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

    this.addExtraAndOmit = function (harmonicFunction, chordElement) {
        var symbols = this.getSortedSymbolsFromChordElement(chordElement)

        if (symbols.equals([3, 5, 7]) || symbols.equals([2, 4, 6]) ||
            symbols.equals([3, 4, 6]) || symbols.equals([3, 5, 6]) ||
            symbols.equals([2, 4, 10]) || symbols.equals([5, 6, 7])) {

            if (!Utils.contains(harmonicFunction.extra, "7") &&
                !Utils.contains(harmonicFunction.extra, ">7") &&
                !Utils.contains(harmonicFunction.extra, "<7")) {
                    harmonicFunction.extra.push("7")
                }
        }

        if (symbols.equals([2, 4, 10]) || symbols.equals([5, 6, 7])) {
            if (!Utils.contains(harmonicFunction.extra, "9") &&
                !Utils.contains(harmonicFunction.extra, ">9") &&
                !Utils.contains(harmonicFunction.extra, "<9")) {
                harmonicFunction.extra.push("9")
            }

            if (!Utils.contains(harmonicFunction.omit, "5") &&
                !Utils.contains(harmonicFunction.omit, ">5") &&
                !Utils.contains(harmonicFunction.omit, "<5")) {
                harmonicFunction.omit.push("5")
            }
        }

    }


    this.createHarmonicFunctionOrFunctions = function (chordElement, mode, key, delays) {
        var ret = []

        var functions = this.getValidFunctions(chordElement, key)

        for (var i = 0; i < functions.length; i++) {

            var toAdd = new HarmonicFunction.HarmonicFunction()

            toAdd.functionName = functions[i]

            toAdd.degree = chordElement.primeNote + 1
            if (mode === "minor") {
                toAdd.degree += 2;
                toAdd.degree = Utils.mod(toAdd.degree, 7);
            }

            var posAndRev = this.getValidPositionAndRevolution(toAdd, chordElement)

            toAdd.position = posAndRev[0]
            toAdd.revolution = posAndRev[1].toString()
            toAdd.omit = chordElement.omit
            toAdd.down = false
            toAdd.system = undefined
            toAdd.delay = delays
            toAdd.extra = []

            this.addExtraAndOmit(toAdd, chordElement)

            if (functions[i] === "D") {
                toAdd.mode = "major"
            } else {
                toAdd.mode = mode
            }

            ret.push(toAdd)
        }

        return ret
    }


    this.convertToFunctions = function (figuredBassExercise) {

        var harmonicFunctions = []
        var chordElements = []


        var bassElements = figuredBassExercise.elements

        for (var i = 0; i < bassElements.length; i++) {

            Utils.log("Bass elements before complete:", bassElements[i])
            this.completeFiguredBassSymbol(bassElements[i])
            Utils.log("Bass elements after complete ", bassElements[i])
            Utils.log("element.symbols after: " + bassElements[i].symbols)


            var chordElement = this.buildChordElement(bassElements[i])
            Utils.log("Chord element ", chordElement)

            this.completeUntillTwoNextThirds(chordElement)

            this.findPrime(chordElement)
            Utils.log("Chord element:",chordElement)

            var harmFunction = this.createHarmonicFunctionOrFunctions(chordElement,
                figuredBassExercise.mode,
                figuredBassExercise.key,
                bassElements[i].delays)

            bassElements[i].bassNote.chordComponent = parseInt(harmFunction[0].revolution)

            Utils.log("Harmonic function:",harmFunction)

            harmonicFunctions.push(harmFunction) //todo moze sie tez pozniej przyda figuredbassexercise?
            chordElements.push(chordElement)
        }

        return [chordElements, harmonicFunctions]
    }

    this.convertBassToHarmonicFunctions = function (figuredBassExercise) {
        var chordElementsAndHarmonicFunctions = this.convertToFunctions(figuredBassExercise)

        var functions = chordElementsAndHarmonicFunctions[1]
        var elements = chordElementsAndHarmonicFunctions[0]

        Utils.log("Harmonic functions before split:",functions)
        return [elements, this.makeChoiceAndSplit(functions)]
    }

//todo maybe better?
    this.addNotesLength = function (a,b) {
        if (a[1] === b[1]) {
            return [a[0] + b[0], a[1]]
        }

        if (a[1] === 0) {
            return b
        }

        if (b[1] === 0) {
            return a
        }

        var x = a[1]
        var y = b[1]

        return [a[0] * y + b[0] * x, x * y]
    }


    this.notesLengthEqual = function(a,b) {
        var x = a.slice(0)
        var y = b.slice(0)

        var den1 = x[1]
        var den2 = y[1]


        x[0] = x[0] * den2
        x[1] = x[1] * den2

        y[0] = y[0] * den1
        y[1] = y[1] * den1

        return x[0] === y[0] && x[1] === y[1]
    }

    this.handleAlterations = function (harmonicFunctions, chordElements, mode, meter, durations) {

          Utils.log("Handle Alterations")
          Utils.log("harmonicFunctions:", JSON.stringify(harmonicFunctions))
          Utils.log("chordElements:", JSON.stringify(chordElements))
          Utils.log("mode:", JSON.stringify(mode))
          Utils.log("meter:", JSON.stringify(meter))
          Utils.log("durations:", JSON.stringify(durations))

        var alterationsInCurrentMeasure = []

        var summedNotesLength = [0, 0]

        for (var i = 0; i < harmonicFunctions[0].length; i++) {

            var toOmit = []
            var toExtra = []

            var chordNotesToConsider = [0, 2, 4]

            if (harmonicFunctions[0][i].extra !== undefined) {
                for (var a = 0; a < harmonicFunctions[0][i].extra.length; a++) {
                    chordNotesToConsider.push(parseInt(harmonicFunctions[0][i].extra[a]))
                }
            }

            //Utils.log("chordNotesToConsider", JSON.stringify(chordNotesToConsider))
            for (var a = 0; a < alterationsInCurrentMeasure.length; a++) {
                for (var b = 0; b < chordNotesToConsider.length; b++) {
                    if (Utils.mod(chordNotesToConsider[b] + chordElements[i].primeNote, 7) === alterationsInCurrentMeasure[a][0]) {
                        toOmit.push(Utils.mod(chordNotesToConsider[b] + 1,7))
                        toExtra.push(alterationsInCurrentMeasure[a][1] + Utils.mod(chordNotesToConsider[b] + 1,7))
                    }
                }
            }

            for (var j = 0; j < chordElements[i].bassElement.symbols.length; j++) {

                if (chordElements[i].bassElement.symbols[j].alteration !== undefined) {

                    var number = chordElements[i].bassElement.symbols[j].component !== undefined ? chordElements[i].bassElement.symbols[j].component : 3;
                    var alteration = undefined

                    var baseNoteToAlter = Utils.mod(number + chordElements[i].bassElement.bassNote.baseNote, 7)
                    if (chordElements[i].bassElement.symbols[j].alteration === Consts.ALTERATIONS.NATURAL) {
                        //nothing?
                    } else if (chordElements[i].bassElement.symbols[j].alteration === Consts.ALTERATIONS.SHARP) {
                        alteration = ">"
                    } else {
                        alteration = "<"
                    }

                    var index = undefined

                    for (var a = 0; a < alterationsInCurrentMeasure.length; a++) {
                        if (alterationsInCurrentMeasure[a][0] === baseNoteToAlter) {
                            index = a
                            break
                        }
                    }
                    //todo przy krzyzyku i bemolu dopisac ogarnianie w przypadku, gdy takie cus juz jest

                    if (alteration !== undefined) {
                        alterationsInCurrentMeasure.push([Utils.mod(baseNoteToAlter - 1, 7), alteration])
                    } else {
                        if (index !== undefined) {
                            alterationsInCurrentMeasure.splice(index, 1)
                        }
                    }


                    if (alteration !== undefined) {
                        toOmit.push(baseNoteToAlter)
                        toExtra.push(alteration + baseNoteToAlter)
                    } else {
                        for (var a = 0; a < toOmit.length; a++) {
                            if (toOmit[a] === baseNoteToAlter) {
                                toOmit.splice(a, 1)
                                toExtra.splice(a, 1)
                                break
                            }
                        }
                    }
                }
            }

            //Utils.log("alterationsInCurrentMeasure", JSON.stringify(alterationsInCurrentMeasure))
            //Utils.log("toOmit", JSON.stringify(toOmit))
            //Utils.log("toExtra", JSON.stringify(toExtra))

            if (toOmit.length === 1 && Utils.contains(toOmit, 3)) {
                if (mode === "minor" && toExtra[0] === ">3") {
                    harmonicFunctions[0][i].mode = "major";
                }
                if (mode === "major" && toExtra[0] === "<3") {
                    harmonicFunctions[0][i].mode = "minor";
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

            summedNotesLength = this.addNotesLength(summedNotesLength, durations[i])

            if (this.notesLengthEqual(summedNotesLength, meter)) {
                alterationsInCurrentMeasure = []
                summedNotesLength = [0, 0]
            }
        }
    }


    this.createExerciseFromFiguredBass = function (figuredBassExercise) {
        var chordElementsAndHarmonicFunctions = this.convertBassToHarmonicFunctions(figuredBassExercise)

        var harmonicFunctions = chordElementsAndHarmonicFunctions[1]
        var chordElements = chordElementsAndHarmonicFunctions[0]

        Utils.log("Harmonic functions after split",harmonicFunctions)

        var key = figuredBassExercise.mode === "major" ? figuredBassExercise.key : figuredBassExercise.key.toLowerCase()

        this.handleAlterations(harmonicFunctions, chordElements, figuredBassExercise.mode, figuredBassExercise.meter, figuredBassExercise.durations)

        return new Exercise.Exercise(key, figuredBassExercise.meter,
            figuredBassExercise.mode, harmonicFunctions)
    }


}
