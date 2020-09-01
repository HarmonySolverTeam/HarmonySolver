.import "./ChordComponentManager.js" as ChordComponentManager
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

    this.equals = function(other){
        return this.pitch === other.pitch;
    }

}
