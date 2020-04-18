import QtQuick 2.0

QtObject
{
    property int sopranoMax : 81;
    property int sopranoMin : 60;
    property int altoMax : 74;
    property int altoMin : 53;
    property int tenorMax : 69;
    property int tenorMin : 48;
    property int bassMax : 62;
    property int bassMin : 41;
    property var dur : [0, 2, 4, 5, 7, 9, 11];
    property var basic_dur_chord : [0, 4, 7];

    function min(a,b){
        return a<=b?a:b
    }
    
    function max(a,b){
        return a>b?a:b
    }

    function getPossiblePitchValuesFromInterval(note, minPitch, maxPitch){

        while(note - minPitch >= 12 ){
                note = note - 12;
        }

        while(note - minPitch < 0){
                note = note + 12;
        }

        var possiblePitch = [];
        while(maxPitch - note >= 0){
                possiblePitch.push(note);
                note = note + 12;
        }

        return possiblePitch;
    }

    function generateChords(chordType, sopranoNote, key){
        
        var basicNote;
//todo wydzielic te C C# itd do osobnego pliku ze stalymi
        if(key == "C")                   basicNote = 60 + 0;
        if(key == "C#" || key == "Db") basicNote = 60 + 1;
        if(key == "D")                   basicNote = 60 + 2;
        if(key == "Eb")                  basicNote = 60 + 3;
        if(key == "E")                   basicNote = 60 + 4;
        if(key == "F")                   basicNote = 60 + 5;
        if(key == "F#" || key == "Gb") basicNote = 60 + 6;
        if(key == "G")                   basicNote = 60 + 7;
        if(key == "Ab")                  basicNote = 60 + 8;
        if(key == "A")                   basicNote = 60 + 9;
        if(key == "Bb")                   basicNote = 60 + 10;
        if(key == "B"   || key == "Cb") basicNote = 60 + 11;


        if(chordType == "T") basicNote = basicNote + dur[0];
        if(chordType == "S") basicNote = basicNote + dur[3];
        if(chordType == "D") basicNote = basicNote + dur[4];

        var pryma = basicNote + basic_dur_chord[0];
        var tercja = basicNote + basic_dur_chord[1];
        var kwinta = basicNote + basic_dur_chord[2];

        var schemas = [ [1,1,3,5], [1, 1, 5, 3], [1, 3, 1, 5], [1, 3, 5, 1], [1, 5, 1, 3], [1, 5, 3, 1], [1,3,5,5], [1,5,3,5], [1,5,5,3] ];
        
        if(sopranoNote != -1) schemas = schemas.filter( function(x){ return x[3] == sopranoNote});
        
        var chords = [];
        for(var i=0; i< schemas.length; i++){
            var schema_mapped = schemas[i].map(
                function(x){
                    if(x == 1)
                            return pryma;
                    if(x == 3)
                            return tercja;
                    if(x == 5)
                            return kwinta;
                }
            );

            //console.log(schema_mapped);
                
            var bass = getPossiblePitchValuesFromInterval(schema_mapped[0], bassMin, bassMax);
            var tenor = getPossiblePitchValuesFromInterval(schema_mapped[1], tenorMin, tenorMax);
            var alto = getPossiblePitchValuesFromInterval(schema_mapped[2], altoMin, altoMax);
            var soprano = getPossiblePitchValuesFromInterval(schema_mapped[3], sopranoMin, sopranoMax);
            
            
            /*console.log("------------");
            console.log(schema_mapped);
            console.log("------------");
            console.log(bass);
            console.log(tenor);
            console.log(alto);
            console.log(soprano);
            console.log("  ");*/
            

            for(var n =0; n< bass.length; n++){
                //console.log(n);
                for(var j=0; j< tenor.length; j++){
                        //console.log(j);
                        if(tenor[j] >= bass[n]){
                            for(var k =0; k< alto.length; k++){
                                    //console.log(k);
                                    if(alto[k] >= tenor[j] && alto[k] - tenor[j] < 12){
                                        for(var m=0; m<soprano.length; m++){
                                                //console.log(m);
                                                if(soprano[m] >= alto[k] && soprano[m] - alto[k] < 12){

                                                    chords.push([chordType, [[bass[n], schemas[i][0]], [tenor[j], schemas[i][1]], [alto[k], schemas[i][2]], [soprano[m], schemas[i][3]]]]);

                                                }
                                        }
                                    }
                            }
                        }
                }
            }
        }

        return chords;
    }
    
    function selectSoprano(cursor){
        cursor.track = 0;
    }
    function selectAlto(cursor){
        cursor.track = 1;
    }
    function selectTenor(cursor){
        cursor.track = 4;
    }
    function selectBass(cursor){
        cursor.track = 5;
    }

    function addChordsAtBegining(chords){

        chords = chords.map(
            function(x){
                return [x[1][0][0], x[1][1][0], x[1][2][0], x[1][3][0]];
            }
        );
        
        var cursor = curScore.newCursor();
        cursor.rewind(0);
        cursor.setDuration(1, 4);

        for(var i=0; i<chords.length;i++){
            var chord = chords[i];
        
            addChord(cursor, chord)

        }
        
    }

    function addChordsAtCursorPosition(cursor, chords){
        chords = chords.map(
                    function(x){

                        return [x[1][0][0], x[1][1][0], x[1][2][0], x[1][3][0]];
                    }
                );


        for(var i=0; i<chords.length;i++){
            var chord = chords[i];

            addChord(cursor, chord)
        }

    }

    function addChord(cursor, chord){
        selectSoprano(cursor);
        cursor.addNote(chord[3], false);
        cursor.prev();

        selectAlto(cursor);
        cursor.addNote(chord[2], false);
        cursor.prev()

        selectTenor(cursor);
        cursor.addNote(chord[1], false);
        cursor.prev()

        selectBass(cursor);
        cursor.addNote(chord[0], false);

    }


}