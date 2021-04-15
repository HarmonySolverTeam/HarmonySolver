.import "../model/ChordComponentManager.js" as ChordComponentManager
.import "../utils/Utils.js" as Utils

var cm = new ChordComponentManager.ChordComponentManager();

function Note(pitch, baseNote, chordComponent, duration) {
    this.pitch = pitch
    this.baseNote = baseNote

    this.chordComponent = chordComponent
    this.duration = duration

    if(typeof chordComponent === 'string'){
        this.chordComponent = cm.chordComponentFromString(chordComponent);
    }

    this.toString = function () {
        if (this.pitch === undefined) return undefined;
        return "Pitch: " + this.pitch + " BaseNote: " + this.baseNote + " ChordComponent: " + this.chordComponent.toString();
    };

    this.isUpperThan = function(other){
        return this.pitch > other.pitch;
    }

    this.isLowerThan = function(other){
        return this.pitch < other.pitch;
    }

    this.chordComponentEquals = function(chordComponentString){
        return this.chordComponent.chordComponentString === chordComponentString;
    }

    this.baseChordComponentEquals = function(baseComponentString){
        return this.chordComponent.baseComponent === baseComponentString;
    }

    // other is of type Note
    this.equalPitches = function(other){
        return this.pitch === other.pitch;
    }

    this.equals = function(other){
        return this.pitch === other.pitch
            && this.baseNote === other.baseNote
            && this.chordComponent.equals(other.chordComponent);
    }

    this.equalsInOneOctave = function(other){
        return Utils.mod(this.pitch, 12) === Utils.mod(other.pitch, 12)
            && this.baseNote === other.baseNote
            && this.chordComponent.equals(other.chordComponent);
    }

}

function Measure(notes){
    this.notes = notes; // [Note]
}

function noteReconstruct(note){
    var chordComponentString = note.chordComponent !== undefined ? cm.chordComponentFromString(note.chordComponent) : undefined
    var baseNote = undefined
    switch(note.baseNote) {
        case "C": baseNote = 0; break
        case "D": baseNote = 1; break
        case "E": baseNote = 2; break
        case "F": baseNote = 3; break
        case "G": baseNote = 4; break
        case "A": baseNote = 5; break
        case "B": baseNote = 6; break
    }
    return new Note(note.pitch, baseNote, chordComponentString, note.duration)
}

function measureReconstruct(measure){
    var notes = [];
    for(var i=0; i<measure.notes.length; i++){
        notes.push(noteReconstruct(measure.notes[i]))
    }
    return new Measure(notes);
}