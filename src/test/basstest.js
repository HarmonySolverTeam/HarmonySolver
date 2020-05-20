
function contains(list, obj){

    for (var i = 0; i< list.length; i++){
        if (list[i] === obj){
            return true
        }
    }
    return false

}

function abs(a){
    return a>0?a:-a;
}

function Exercise(key, meter, mode,measures)
{
    this.mode = mode
    this.key = key
    this.meter = meter
    this.measures = measures
}



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

function completeFiguredBassNumbers(element) {

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

        //6,5,7 -> 6,5,7 (but we save 5,6,7)

        if (contains(element.numbers, "6") && contains(element.numbers, "6")
            && contains(element.numbers, "6")) {
            element.numbers = ["5", "6", "7"]
        }

        //3,5,7 -> 3,5,7
        //3,5,6 -> 3,5,6
        //3,4,6 -> 3,4,6
        //2,4,6 -> 2,4,6
        //2,4,10 -> 2,4,10
        //nothing to add
        return
    }
}

function buildChordElement(element) {

    var chordElement = Object()
    chordElement.notesNumbers = [element.bassNote.baseNote]
    chordElement.omit = []

    chordElement.bassElement = element

    for (var i = 0; i < element.numbers.length; i++) {
        chordElement.notesNumbers.push(parseInt(element.numbers[i]))
    }

    return chordElement
}

function hasTwoNextThirds(chordelement) {
    for (var i = 0; i < chordelement.notesNumbers.length; i++) {

        var n1 = chordelement.notesNumbers[i] % 7
        var n2 = chordelement.notesNumbers[(i + 1) % chordelement.notesNumbers.length] % 7
        var n3 = chordelement.notesNumbers[(i + 2) % chordelement.notesNumbers.length] % 7

        if ((abs(n2 - n1) === 2 || abs(n2 - n1) === 5)
            && (abs(n3 - n2) === 2 || abs(n3 - n2) === 5)) {
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

    if (primeNote !== undefined) {
        chordElement.primeNote = primeNote
    } else {
        chordElement.primeNote = scaleNotes[0]
    }
}


function getValidFunctions(chordElement) {

    switch (chordElement.primeNote) {
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


function getValidPositionAndRevolution(harmonicFunction, chordElement) {

    var revolution = 1

    var prime = chordElement.primeNote

    var bass = chordElement.bassNote.baseNote

    while (bass !== prime) {
        bass = (bass + 1) % 7
        revolution++
    }

    var position = -1

    if (chordElement.numbers === ["5", "6", "7"] ||
        chordElement.numbers === ["2", "4", "10"]) {
        position = 9
    }

    return [position, revolution]
}


function createHarmonicFunctionOrFunctions(chordElement) {

    var ret = []

    var functions = getValidFunctions(chordElement)

    for (var i = 0; i < functions.length; i++) {

        var toAdd = new HarmonicFuntion()

        toAdd.functionName = functions[i]

        toAdd.degree = chordElement.primeNote + 1

        var posAndRev = getValidPositionAndRevolution(toAdd, chordElement)

        toAdd.position = posAndRev[0].toString()
        toAdd.revolution = posAndRev[1].toString()
        toAdd.omit = chordElement.omit
        //toAdd.down = ?
        //toAdd.system = ?
        //toAdd.delay = ?

    }

    return ret
}


function convertToFunctions(figuredBassExercise) {

    var ret = []

    var bassElements = figuredBassExercise.elements

    for (var i = 0; i < bassElements.length; i++) {
        completeFiguredBassNumbers(bassElements[i])

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

    return new Exercise(figuredBassExercise.key, figuredBassExercise.meter,
        figuredBassExercise.mode, harmonicFunctions)
}