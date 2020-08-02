.import "./FiguredBass.js" as FiguredBass
.import "./Utils.js" as Utils
.import "./HarmonicFunction.js" as HarmonicFunction
.import "./Exercise.js" as Exercise

//TODO jest jest sam # bez liczby (albo przy 3), to zmienić tylko mode
//TODO OGARNIAC znaki chromatyczne

function ChordElement(notesNumbers, omit, bassElement) {
    this.notesNumbers = notesNumbers
    this.omit = omit
    this.bassElement = bassElement
    this.primeNote = undefined

    this.toString = function () {
        return this.notesNumbers + " " + this.omit + " " + this.bassElement + " " + this.primeNote
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

    this.completeFiguredBassNumbers = function (element) {

        //empty -> 3,5
        if (element.symbols.length === 0) {
            element.symbols = ["3", "5"]
            return
        }

        if (element.symbols.length === 1) {
            // 5 -> 3,5
            if (Utils.contains(element.symbols, "5")) {
                element.symbols = ["3", "5"]
                return
            }

            // 6 -> 3,6
            if (Utils.contains(element.symbols, '6')) {
                element.symbols = ["3", '6']
                return
            }

            // 7 -> 3,5,7
            if (Utils.contains(element.symbols, "7")) {
                element.symbols = ['3', "5", '7']
                return
            }

            //2 -> 2,4,6
            if (Utils.contains(element.symbols, "2")) {
                element.symbols = ["2", "4", "6"]
                return
            }
        }

        if (element.symbols.length === 2) {
            if (Utils.contains(element.symbols, "3")) {
                //3,4 -> 3,4,6
                if (Utils.contains(element.symbols, "4")) {
                    element.symbols = ["3", "4", "6"]
                    return
                } else if (Utils.contains(element.symbols, "5")) {
                    // 3,5 -> 3,5
                    element.symbols = ["3", "5"]
                    return
                } else if (Utils.contains(element.symbols, "6")) {
                    // 3,6 -> 3,6
                    element.symbols = ["3", "6"]
                    return
                }

            }

            if (Utils.contains(element.symbols, "4")) {
                //2,4 -> 2,4,6
                if (Utils.contains(element.symbols, "2")) {
                    element.symbols = ["2", "4", "6"]
                    return
                } else {
                    //4,6 -> 4,6
                    element.symbols = ["4", "6"]
                    return
                }
            }

            if (Utils.contains(element.symbols, "5")) {
                //5,7 -> 3,5,7
                if (Utils.contains(element.symbols, "7")) {
                    element.symbols = ["3", "5", "7"]
                    return
                } else if (Utils.contains(element.symbols, "6")) {
                    //5,6 -> 3,5,6
                    element.symbols = ["3", "5", "6"]
                    return
                }
            }

            //2,10 -> 2,4,10
            if (Utils.contains(element.symbols, "2")) {
                element.symbols = ["2", "4", "10"]
                return
            }

        }

        if (element.symbols.length === 3) {

            //6,5,7 -> 6,5,7 (but we save 5,6,7)

            if (Utils.contains(element.symbols, "6") && Utils.contains(element.symbols, "5")
                && Utils.contains(element.symbols, "7")) {
                element.symbols = ["5", "6", "7"]
                return;
            }


            element.symbols.sort(function (a, b) {
                (parseInt(a) > parseInt(b)) ? 1 : -1
            })

            //3,5,7 -> 3,5,7
            //3,5,6 -> 3,5,6
            //3,4,6 -> 3,4,6
            //2,4,6 -> 2,4,6
            //2,4,10 -> 2,4,10
            //nothing to add
            return
        }
    }


    this.buildChordElement = function buildChordElement(bassElement) {

        var chordElement = new ChordElement([bassElement.bassNote.baseNote], [], bassElement)

        for (var i = 0; i < bassElement.symbols.length; i++) {
            chordElement.notesNumbers.push(bassElement.bassNote.baseNote
                + parseInt(bassElement.symbols[i]) - 1)
        }

        return chordElement
    }

    this.hasTwoNextThirds = function (chordElement) {
        for (var i = 0; i < chordElement.notesNumbers.length; i++) {

            var n1 = chordElement.notesNumbers[i] % 7
            var n2 = chordElement.notesNumbers[(i + 1) % chordElement.notesNumbers.length] % 7
            var n3 = chordElement.notesNumbers[(i + 2) % chordElement.notesNumbers.length] % 7

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
                    chordElement.omit.push((chordElement.notesNumbers[chordElement.notesNumbers.length - 1]) % 7 + 1)
                }
                return
            }
        }
        chordElement.notesNumbers.push(chordElement.notesNumbers[chordElement.notesNumbers.length - 1] + 2)
        if (chordElement.notesNumbers.length >= 5) {
            chordElement.omit.push((chordElement.notesNumbers[chordElement.notesNumbers.length - 1]) % 7 + 1)
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
            scaleNotes.push(chordElement.notesNumbers[i] % 7)
        }

        Utils.log( "Scale Notes: ", scaleNotes.toString())

        for (var i = 0; i < scaleNotes.length; i++) {
            var note = scaleNotes[i]
            //console.log(note)

            while (Utils.contains(scaleNotes, (note - 2) % 7)) {
                note = (note - 2) % 7
            }
            //console.log(note)

            if (Utils.contains(scaleNotes, (note + 2) % 7) && Utils.contains(scaleNotes, (note + 4) % 7)) {
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

    //TODO change
    this.getValidFunctions = function (chordElement, mode) {
            var primeNote = chordElement.primeNote
            if (mode === "minor") primeNote += 2
            primeNote = primeNote % 7
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
    //TODO change
    this.getValidPositionAndRevolution = function (harmonicFunction, chordElement) {

        var revolution = 1

        var prime = chordElement.primeNote

        var bass = chordElement.bassElement.bassNote.baseNote

        while (bass !== prime) {
            bass = (bass - 1) % 7
            revolution++
        }

        var position = -1

        if (chordElement.symbols === ["5", "6", "7"] ||
            chordElement.symbols === ["2", "4", "10"]) {
            position = 9
        }

        return [position, revolution]
    }

    this.createHarmonicFunctionOrFunctions = function (chordElement, mode) {
        var ret = []

        var functions = this.getValidFunctions(chordElement, mode)

        for (var i = 0; i < functions.length; i++) {

            var toAdd = new HarmonicFunction.HarmonicFunction()

            toAdd.functionName = functions[i]

            toAdd.degree = chordElement.primeNote + 1
            if (mode === "minor") {
                toAdd.degree += 2;
                toAdd.degree = toAdd.degree % 7;
            }

            var posAndRev = this.getValidPositionAndRevolution(toAdd, chordElement)

            toAdd.position = posAndRev[0]
            toAdd.revolution = posAndRev[1].toString()
            toAdd.omit = chordElement.omit
            toAdd.down = false
            toAdd.system = undefined
            //toAdd.delay = ?
            toAdd.extra = []
            //toAdd.mode = mode

            ret.push(toAdd)
        }

        return ret
    }

    this.convertToFunctions = function (figuredBassExercise) {

        var ret = []

        var bassElements = figuredBassExercise.elements

        for (var i = 0; i < bassElements.length; i++) {

            Utils.log("Bass elements before complete:", bassElements[i])
            this.completeFiguredBassNumbers(bassElements[i])
            Utils.log("Bass elements after complete ", bassElements[i])

            var chordElement = this.buildChordElement(bassElements[i])
            Utils.log("Chord element ", chordElement)

            this.completeUntillTwoNextThirds(chordElement)

            this.findPrime(chordElement)
            Utils.log("Chord element:",chordElement)

            var harmFunction = this.createHarmonicFunctionOrFunctions(chordElement, figuredBassExercise.mode)

            bassElements[i].bassNote.chordComponent = parseInt(harmFunction[0].revolution)

            Utils.log("Harmonic function:",harmFunction)

            ret.push(harmFunction) //todo moze sie tez pozniej przyda figuredbassexercise?
        }

        return ret
    }

    this.convertBassToHarmonicFunctions = function (figuredBassExercise) {
        var functions = this.convertToFunctions(figuredBassExercise)
        Utils.log("Harmonic functions before split:",functions)
        return this.makeChoiceAndSplit(functions)
    }

    this.createExerciseFromFiguredBass = function (figuredBassExercise) {
        var harmonicFunctions = this.convertBassToHarmonicFunctions(figuredBassExercise)

        Utils.log("Harmonic functions after split",harmonicFunctions)

        var key = figuredBassExercise.mode === "major" ? figuredBassExercise.key : figuredBassExercise.key.toLowerCase()

        return new Exercise.Exercise(key, figuredBassExercise.meter,
            figuredBassExercise.mode, harmonicFunctions)
    }

}
