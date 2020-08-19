function Note(pitch, baseNote, chordComponent) {
    this.pitch = pitch
    this.baseNote = baseNote
    this.chordComponent = chordComponent

    this.toString = function () {
        if (this.pitch === undefined) return undefined;
        return "Pitch: " + this.pitch + " BaseNote: " + this.baseNote + " ChordComponent: " + this.chordComponent;
    }

    this.equals = function(other){
        return this.pitch === other.pitch;
    }

}
