.import "./Scale.js" as Scale
.import "./Chord.js" as Chord
.import "./Note.js" as Note
.import "./Consts.js" as Consts

function ChordGenerator(key){
    this.key = key;

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

    this.getBasicPitches = function(harmonicFunction){

        var scale = new Scale.MajorScale(this.key);
        var basicNote = scale.tonicPitch;

        switch(harmonicFunction.functionName){
            case 'T':
                basicNote += scale.pitches[0];
                break;
            case 'S':
                basicNote += scale.pitches[3];
                break;
            case 'D':
                basicNote += scale.pitches[4];
                break;
        };
        
        var isPositionGiven = false;
        if(harmonicFunction.position !== -1) isPositionGiven = true;

        var needToAdd = [];

        var chordType = Consts.basicDurChord;
        needToAdd.push(basicNote + chordType[0])
        needToAdd.push(basicNote + chordType[1])
        needToAdd.push(basicNote + chordType[2])

        extra = {
            '6' : 9,
            '7' : 10,
            '9' : 14
        }

        for(var i=0; i<harmonicFunction.extra.length; i++){
            var e = harmonicFunction.extra[i];
            var intervalPitch = extra[e.charAt(0)];
            for(var j=1; j<e.length; j++){
                if(e[j] === '<') intervalPitch++;
                if(e[j] === '>') intervalPitch--;
            }
            needToAdd.push(basicNote + intervalPitch);
        }

        for(var i=0; i<harmonicFunction.omit.length; i++){
            var o = harmonicFunction.omit[i];
            switch(o){
                case 1:
                    needToAdd.splice(needToAdd.indexOf(basicNote + chordType[0]), 1);
                    break;
                case 3:
                    needToAdd.splice(needToAdd.indexOf(basicNote + chordType[1]), 1);
                    break;
                case 5:
                    needToAdd.splice(needToAdd.indexOf(basicNote + chordType[2]), 1);
                    break;
            }
        }

        console.log("Need to add");
        console.log(needToAdd);
        return needToAdd;
    }

    this.getSchemas = function(harmonicFunction){

        var scale = new Scale.MajorScale(this.key);
        var basicNote = scale.tonicPitch;

        switch(harmonicFunction.functionName){
            case 'T':
                basicNote += scale.pitches[0];
                break;
            case 'S':
                basicNote += scale.pitches[3];
                break;
            case 'D':
                basicNote += scale.pitches[4];
                break;
        };


        //TODO
    }

    this.generate = function(harmonicFunction){
        var scale = new Scale.MajorScale(this.key);
        var basicNote = scale.tonicPitch;

        switch(harmonicFunction.functionName){
            case 'T':
                basicNote += scale.pitches[0];
                break;
            case 'S':
                basicNote += scale.pitches[3];
                break;
            case 'D':
                basicNote += scale.pitches[4];
                break;
        };

        var chordScheme = Consts.basicDurChord;
        var schemas = [ [1, 1, 3, 5], [1, 1, 5, 3], [1, 3, 1, 5], [1, 3, 5, 1], [1, 5, 1, 3], [1, 5, 3, 1], [1,3,5,5], [1,5,3,5], [1,5,5,3] ];

        if(harmonicFunction.extra) {
            switch (harmonicFunction.extra[0]) {
                case 6:
                    console.log("ADDED 6");
                    chordScheme = basicDur6Chord;
                    schemas = [[1, 3, 5, 6], [1, 3, 6, 5], [1, 5, 3, 6], [1, 5, 6, 3], [1, 6, 3, 5], [1, 6, 5, 3]];
                    break;
                case 7:
                    console.log("ADDED 7");
                    chordScheme = basicDur7Chord;
                    schemas = [[1, 3, 5, 7], [1, 3, 7, 5], [1, 5, 3, 7], [1, 5, 7, 3], [1, 7, 3, 5], [1, 7, 5, 3]];
                    break;
            }
        }

        var pryma = basicNote + chordScheme[0];
        var tercja = basicNote + chordScheme[1];
        var kwinta = basicNote + chordScheme[2];
        var added = basicNote + chordScheme[3];

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
                    if(x == 6)
                            return added;
                    if(x == 7)
                            return added;
                }
            );
            
            var vb = new Consts.VoicesBoundary()
            var bass = getPossiblePitchValuesFromInterval(schema_mapped[0], vb.bassMin, vb.bassMax);
            var tenor = getPossiblePitchValuesFromInterval(schema_mapped[1], vb.tenorMin, vb.tenorMax);
            var alto = getPossiblePitchValuesFromInterval(schema_mapped[2], vb.altoMin, vb.altoMax);
            var soprano = getPossiblePitchValuesFromInterval(schema_mapped[3], vb.sopranoMin, vb.sopranoMax);
        
            for(var n =0; n< bass.length; n++){
                for(var j=0; j< tenor.length; j++){
                        if(tenor[j] >= bass[n]){
                            for(var k =0; k< alto.length; k++){
                                    if(alto[k] >= tenor[j] && alto[k] - tenor[j] < 12){
                                        for(var m=0; m<soprano.length; m++){
                                                if(soprano[m] >= alto[k] && soprano[m] - alto[k] < 12){

                                                    var d1 = {"T": 0, "S": 3, "D" : 4 };
                                                    var position = harmonicFunction.position
                                                    if(position === -1 || schemas[i][3] === position) {
                                                        var bassNote = new Note.Note(bass[n], (scale.baseNote + d1[harmonicFunction.functionName] + schemas[i][0] - 1) % 7, schemas[i][0]);
                                                        var tenorNote = new Note.Note(tenor[j], (scale.baseNote + d1[harmonicFunction.functionName] + schemas[i][1] - 1) % 7, schemas[i][1]);
                                                        var altoNote = new Note.Note(alto[k], (scale.baseNote + d1[harmonicFunction.functionName] + schemas[i][2] - 1) % 7, schemas[i][2]);
                                                        var sopranoNote = new Note.Note(soprano[m], (scale.baseNote + d1[harmonicFunction.functionName] + schemas[i][3] - 1) % 7, schemas[i][3]);
                                                        chords.push(new Chord.Chord(sopranoNote, altoNote, tenorNote, bassNote, harmonicFunction));
                                                    }
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
}