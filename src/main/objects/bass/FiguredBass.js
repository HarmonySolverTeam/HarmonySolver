.import "../model/Note.js" as Note
.import "../conf/PluginConfigurationUtils.js" as Conf

var ALTERATION_TYPE = {
  SHARP : "#",
  FLAT : 'b',
  NATURAL : 'h'
};

function BassSymbol(component, alteration){
    this.component = component;
    this.alteration = alteration;

    this.toString = function() {
        return "Component: " + this.component + " Alteration: " + this.alteration
    }

    this.equals = function (other) {
        return this.component === other.component && this.alteration === other.alteration
    }
}

function bassSymbolReconstruct(symbol) {
    return new BassSymbol(symbol.component, symbol.alteration)
}

function FiguredBassElement(bassNote, symbols, delays) {

    this.bassNote = bassNote;
    this.symbols = symbols; //list of BassSymbols
    this.delays = delays;


    this.toString = function () {
        return "Bass note: "+ this.bassNote + " Symbols: " + this.symbols + " Delays: " + this.delays
    }

}

function figuredBassElementReconstruct(element) {
    return new FiguredBassElement(
        Note.noteReconstruct(element.bassNote),
        element.symbols.map(function(x){return bassSymbolReconstruct(x)}),
        element.delays
    )
}

function FiguredBassExercise(mode, key, meter, elements, durations) {
    this.mode = mode;
    this.key = key;
    this.meter = meter;
    this.elements = elements;
    this.durations = durations;
    this.evaluateWithProlog = Conf.enableProlog;

    this.toString = function () {
        return "Mode: " + this.mode + " Key: " + this.key + " Meter: " + this.meter + " Elements: " + this.elements + " Durations: " + this.durations
    }
}

function figuredBassExerciseReconstruct(exercise) {
    return new FiguredBassExercise(
        exercise.mode,
        exercise.key,
        exercise.meter,
        exercise.elements.map(function(x){return figuredBassElementReconstruct(x)}),
        exercise.durations
    )
}