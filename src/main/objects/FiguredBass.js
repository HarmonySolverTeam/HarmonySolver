function FiguredBassElement(bassNote, symbols) {

    this.bassNote = bassNote;
    this.symbols = symbols;


    this.toString = function () {
        return this.bassNote + " " + this.symbols
    }

}

function FiguredBassExercise(mode, key, meter, elements, durations){
    this.mode = mode;
    this.key = key;
    this.meter = meter;
    this.elements = elements;
    this.durations = durations;
}

function ChordElement(notesNumbers, omit, bassElement){
    this.notesNumbers = notesNumbers
    this.omit = omit
    this.bassElement = bassElement
    this.primeNote = undefined
}