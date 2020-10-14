.import "./ChordComponentManager.js" as ChordComponentManager
.import "./Utils.js" as Utils

var cm = new ChordComponentManager.ChordComponentManager();

function Note(pitch, baseNote, chordComponent) {
    this.pitch = pitch
    this.baseNote = baseNote

    this.chordComponent = chordComponent
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
