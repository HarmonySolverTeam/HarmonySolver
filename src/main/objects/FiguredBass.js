function FiguredBassElement(bassNote, symbols) {

    this.bassNote = bassNote;
    this.symbols = symbols;


    this.toString = function () {
        return this.bassNote + " " + this.symbols
    }

}

function FiguredBassExercise(mode, key, meter, elements, durations) {
    this.mode = mode;
    this.key = key;
    this.meter = meter;
    this.elements = elements;
    this.durations = durations;

    this.toString = function () {
        return this.mode + " " + this.key + " " + this.meter + " " + this.elements + " " + this.durations
    }
}

function ChordElement(notesNumbers, omit, bassElement) {
    this.notesNumbers = notesNumbers
    this.omit = omit
    this.bassElement = bassElement
    this.primeNote = undefined

    this.toString = function () {
        return this.notesNumbers + " " + this.omit + " " + this.bassElement + " " + this.primeNote
    }
}