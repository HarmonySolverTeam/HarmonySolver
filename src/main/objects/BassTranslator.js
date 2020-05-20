function makeChoiceAndSplit(functions) {

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
    return ret
}

function completeBassoContinuoNumbers(element) {

    //empty -> 3,5
    if (element.numbers.length === 0) {
        element.numbers = ["3", "5"]
        return
    }

    if (element.numbers.length === 1) {
        // 5 -> 3,5
        if (contains(element.numbers, "5")) {
            element.numbers = ["3", "5"]
            return
        }

        // 6 -> 3,6
        if (contains(element.numbers, '6')) {
            element.numbers = ["3", '6']
            return
        }

        // 7 -> 3,5,7
        if (contains(element.numbers, "7")) {
            element.numbers = ['3', "5", '7']
            return
        }

        //2 -> 2,4,6
        if (contains(element.numbers, "2")) {
            element.numbers = ["2", "4", "6"]
            return
        }
    }

    if (element.numbers.length === 2) {
        if (contains(element.numbers, "3")) {
            //3,4 -> 3,4,6
            if (contains(element.numbers, "4")) {
                element.numbers = ["3", "4", "6"]
                return
            } else {
                // 3,5 -> 3,5
                // 3,6 -> 3,6
                return
            }
        }

        if (contains(element.numbers, "4")) {
            //2,4 -> 2,4,6
            if (contains(element.numbers, "4")) {
                element.numbers = ["2", "4", "6"]
                return
            } else {
                //4,6 -> 4,6
                return
            }
        }

        if (contains(element.numbers, "5")) {
            //5,7 -> 3,5,7
            if (contains(element.numbers, "7")) {
                element.numbers = ["3", "5", "7"]
                return
            } else if (contains(element.numbers, "6")) {
                //5,6 -> 3,5,6
                element.numbers = ["3", "5", "6"]
                return
            }
        }

        //2,10 -> 2,4,10
        if (contains(element.numbers, "2")) {
            element.numbers = ["2", "4", "10"]
            return
        }

    }

    if (element.numbers.length === 3) {
        //3,5,7 -> 3,5,7
        //3,5,6 -> 3,5,6
        //3,4,6 -> 3,4,6
        //2,4,6 -> 2,4,6
        //6,5,7 -> 6,5,7
        //2,4,10 -> 2,4,10
        //nothing to add
        return
    }
}

function buildChordElement(element) {
    //todo zbuduj po kolei te wsyztskie nutki, któe wynikają z cyferek w basie

    var chordElement = Object()
    chordElement.notesNumbers = [element.bassNote.baseNote]
    chordElement.omit = []





    return chordElement
}

function hasTwoNextThirds(chordelement) {
    for (var i = 0; i < chordelement.notesNumbers.length - 2; i++) {
        if (chordelement.notesNumbers[i + 2] - chordelement.notesNumbers[i + 1] === 2
            && chordelement.notesNumbers[i + 1] - chordelement.notesNumbers[i] === 2) {
            return true
        }
    }
    return false
}

function addNextNote(chordElement) {
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


function completeUntillTwoNextThirds(chordElement) {

    while (!hasTwoNextThirds(chordElement)) {
        addNextNote(chordElement)
    }
}

function findPrime(chordElement) {

    var scaleNotes = []
    var primeNote = undefined //from 0 to 6

    for (var i = 0; i < chordElement.notesNumbers.length; i++) {
        scaleNotes.push(chordElement.notesNumbers[i] % 7)
    }

    for (var i = 0; i < scaleNotes.length; i++) {
        var note = scaleNotes[i]

        while (contains(scaleNotes, (note - 2) % 7)) {
            note = (note - 2) % 7
        }

        if (contains(scaleNotes, (note + 2) % 7) && contains(scaleNotes, (note + 4) % 7)) {
            primeNote = note
            break
        }
    }

    if (primeNote !== undefined){
        chordElement.primeNote = primeNote
    } else {
        chordElement.primeNote = scaleNotes[0]
    }
}


function createHarmonicFunctionOrFunctions(chordElement) {
    //todo zrob z tego liste jedno albo 2 elementowa z harmonic functions


}


function convertToFunctions(figuredBassExercise) {

    var ret = []

    var bassElements = figuredBassExercise.elements

    for (var i = 0; i < bassElements.length; i++) {
        completeBassoContinuoNumbers(bassElements[i])

        var chordElement = buildChordElement(bassElements[i])

        completeUntillTwoNextThirds(chordElement)

        findPrime(chordElement)

        ret.push(createHarmonicFunctionOrFunctions(chordElement)) //todo moze sie tez przyda figuredbassexercise?
    }

    return ret
}


function convertBassToHarmonicFunctions(figuredBassExercise) {

    var functions = convertToFunctions(figuredBassExercise)

    return makeChoiceAndSplit(functions)
}

function createExerciseFromFiguredBass(figuredBassExercise) {

    var harmonicFunctions = convertBassToHarmonicFunctions(figuredBassExercise)

    //todo uzupelnienei pozostalych pol exercise
}