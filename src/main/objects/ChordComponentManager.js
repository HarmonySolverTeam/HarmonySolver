.import "./ChordComponent.js" as ChordComponent

//G
var availableChordComponents = {};

//G
var sequence = 0;

function ChordComponentManager(){

    this.chordComponentFromString = function (chordComponentString) {
        if(availableChordComponents.hasOwnProperty(chordComponentString))
            return availableChordComponents[chordComponentString];

        var chordComponent = new ChordComponent.ChordComponent(chordComponentString, sequence);
        sequence++;
        availableChordComponents[chordComponentString] = chordComponent;
        return chordComponent;
    };

    this.basicChordComponentFromPitch = function (chordComponentPitch) {
        return this.chordComponentFromString( {3:"3>",4:"3",5:"3<",6:"5>",7:"5",8:"5<"}[chordComponentPitch] );
    }
}