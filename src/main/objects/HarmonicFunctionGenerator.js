.import "./Consts.js" as Consts
.import "./ChordGenerator.js" as ChordGenerator
.import "./Utils.js" as Utils
var BASE_NOTES = Consts.BASE_NOTES

function HarmonicFunctionMap(){
    this._map = {};

    this._initializeForPitch = function(pitch, baseNotes){
        for(var i=0; i<baseNotes.length; i++){
            this._map[pitch + " " + baseNotes[i]] = [];
        }
    };

    this._initializeMap = function(){
        this._initializeForPitch(60, [BASE_NOTES.B, BASE_NOTES.C,BASE_NOTES.D]);
        this._initializeForPitch(61, [BASE_NOTES.B, BASE_NOTES.C,BASE_NOTES.D]);
        this._initializeForPitch(62, [BASE_NOTES.C, BASE_NOTES.D,BASE_NOTES.E]);
        this._initializeForPitch(63, [BASE_NOTES.D, BASE_NOTES.E,BASE_NOTES.F]);
        this._initializeForPitch(64, [BASE_NOTES.D, BASE_NOTES.E,BASE_NOTES.F]);
        this._initializeForPitch(65, [BASE_NOTES.E, BASE_NOTES.F,BASE_NOTES.G]);
        this._initializeForPitch(66, [BASE_NOTES.E, BASE_NOTES.F,BASE_NOTES.G]);
        this._initializeForPitch(67, [BASE_NOTES.F, BASE_NOTES.G,BASE_NOTES.A]);
        this._initializeForPitch(68, [BASE_NOTES.G, BASE_NOTES.A]);
        this._initializeForPitch(69, [BASE_NOTES.G, BASE_NOTES.A,BASE_NOTES.B]);
        this._initializeForPitch(70, [BASE_NOTES.A, BASE_NOTES.B,BASE_NOTES.C]);
        this._initializeForPitch(71, [BASE_NOTES.A, BASE_NOTES.B,BASE_NOTES.C]);
    };

    this._initializeMap();

    this.getValues = function(pitch, baseNote){
        return this._map[pitch + " " + baseNote];
    };

    this.pushToValues = function(pitch, baseNote, harmonicFunction){
        if(Utils.contains(this._map[pitch + " " + baseNote], harmonicFunction))
            return;
        this._map[pitch + " " + baseNote].push(harmonicFunction)
    };
}

function HarmonicFunctionGenerator(allowedHarmonicFunctions, key, mode){
    this.key = key;
    this.mode = mode;
    this.chordGenerator = new ChordGenerator.ChordGenerator(this.key, this.mode);
    this.map = new HarmonicFunctionMap();

    for(var i=0; i<allowedHarmonicFunctions.length; i++){
        var currentFunction = allowedHarmonicFunctions[i];
        var possibleNotesToHarmonize = this.chordGenerator.generatePossibleSopranoNotesFor(currentFunction);
        for(var j=0; j<possibleNotesToHarmonize.length; j++) {
            this.map.pushToValues(possibleNotesToHarmonize[j].pitch, possibleNotesToHarmonize[j].baseNote, currentFunction);
        }
    }

    this.generate = function(sopranoNote){
        return this.map.getValues(sopranoNote.pitch, sopranoNote.baseNote);
    }
}