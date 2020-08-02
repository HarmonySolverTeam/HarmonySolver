var ALTERATION_TYPE = {
  SHARP : "#",
  FLAT : 'b',
  NATURAL : 'h'
};

function BassSymbol(component, alteration){
    this.component = component;
    this.alteration = alteration;

    this.toString = function() {
        return this.component + " " + this.alteration
    }
}

function FiguredBassElement(bassNote, symbols) {

    this.bassNote = bassNote;
    this.symbols = symbols; //list of BassSymbols


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

