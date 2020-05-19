function BassoContinuoElement(bassNote, numbers) {

    this.bassNote = bassNotes
    this.numbers = numbers


    this.toString = function () {
        return this.bassNote + " " + this.numbers
    }

}

function BassoContinuoTask(mode, key, meter, measures){
    this.mode = mode
    this.key = key
    this.meter = meter
    this.measures = measures //tutaj moze niech beda listy z BassoContinuoElement
}