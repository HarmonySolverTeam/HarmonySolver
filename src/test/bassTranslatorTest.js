function mod(a, b) {
    while (a < 0) {
        a += b
    }
    return a % b
}

function contains(list, obj) {

    for (var i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true
        }
    }
    return false

}

function addNotesLength(a, b) {
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

function notesLengthEqual(a, b) {

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

function handleAlterations(harmonicFunctions, chordElements, mode, meter, durations) {

    /*  Utils.log("Handle Alterations")
      Utils.log("harmonicFunctions:", JSON.stringify(harmonicFunctions))
      Utils.log("chordElements:", JSON.stringify(chordElements))
      Utils.log("mode:", JSON.stringify(mode))
      Utils.log("meter:", JSON.stringify(meter))
      Utils.log("durations:", JSON.stringify(durations)) */

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
                if (mod(chordNotesToConsider[b] + chordElements[i].primeNote, 7) === alterationsInCurrentMeasure[a][0]) {
                    toOmit.push(mod(chordNotesToConsider[b] + 1,7))
                    toExtra.push(alterationsInCurrentMeasure[a][1] + mod(chordNotesToConsider[b] + 1,7))
                }
            }
        }

        for (var j = 0; j < chordElements[i].bassElement.symbols.length; j++) {

            if (chordElements[i].bassElement.symbols[j].alteration !== undefined) {
                var number = chordElements[i].bassElement.symbols[j].component !== undefined ? chordElements[i].bassElement.symbols[j].component : 3;
                var alteration = undefined

                var baseNoteToAlter = mod(number + chordElements[i].bassElement.bassNote.baseNote, 7)

                if (chordElements[i].bassElement.symbols[j].alteration === 'h') {
                    //nothing?
                } else if (chordElements[i].bassElement.symbols[j].alteration === '#') {
                    alteration = ">"
                } else {
                    alteration = "<"
                }

                var index = undefined

                for (var a = 0; a < alterationsInCurrentMeasure.length; a++) {
                    if (alterationsInCurrentMeasure[a][0] === number) {
                        index = a
                        break
                    }
                }

                //todo przy krzyzyku i bemolu dopisac ogarnianie w przypadku, gdy takie cus juz jest

                if (alteration !== undefined) {
                    alterationsInCurrentMeasure.push([mod(baseNoteToAlter - 1, 7), alteration])
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
                        if (toOmit[a] === number) {
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

        if (toOmit.length === 1 && contains(toOmit, 3)) {
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

        summedNotesLength = addNotesLength(summedNotesLength, durations[i])

        if (notesLengthEqual(summedNotesLength, meter)) {
            alterationsInCurrentMeasure = []
            summedNotesLength = [0, 0]
        }
    }
}


var harmonicFunctions = JSON.parse('[[{"functionName":"T","degree":1,"revolution":"1","extra":[],"omit":[],"down":false},{"functionName":"D","degree":5,"revolution":"1","extra":[],"omit":[],"down":false},{"functionName":"T","degree":1,"revolution":"5","extra":[],"omit":[],"down":false},{"functionName":"S","degree":4,"revolution":"3","extra":[],"omit":[],"down":false},{"functionName":"T","degree":1,"revolution":"1","extra":[],"omit":[],"down":false}]]')
var chordElements = JSON.parse('[{"notesNumbers":[0,2,4],"omit":[],"bassElement":{"bassNote":{"pitch":48,"baseNote":0,"chordComponent":1},"symbols":[{"component":3},{"component":5}]},"primeNote":0},{"notesNumbers":[4,6,8],"omit":[],"bassElement":{"bassNote":{"pitch":43,"baseNote":4,"chordComponent":1},"symbols":[{"component":3},{"component":5}]},"primeNote":4},{"notesNumbers":[4,9,7],"omit":[],"bassElement":{"bassNote":{"pitch":43,"baseNote":4,"chordComponent":5},"symbols":[{"component":6,"alteration":"b"},{"component":4}]},"primeNote":0},{"notesNumbers":[5,10,7],"omit":[],"bassElement":{"bassNote":{"pitch":45,"baseNote":5,"chordComponent":3},"symbols":[{"component":6},{"component":3}]},"primeNote":3},{"notesNumbers":[0,2,4],"omit":[],"bassElement":{"bassNote":{"pitch":48,"baseNote":0,"chordComponent":1},"symbols":[{"component":3},{"component":5}]},"primeNote":0}]')
var mode = "major"
var meter = [4, 4]
var durations = [[1, 2], [1, 2], [1, 2], [1, 4], [1, 4]]


handleAlterations(harmonicFunctions, chordElements, mode, meter, durations)

console.log(JSON.stringify(harmonicFunctions))