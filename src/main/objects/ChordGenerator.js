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

    this.getChordTemplate = function(harmonicFunction){

        var bass = undefined;
        var tenor = undefined;
        var alto = undefined;
        var soprano = undefined;
        
        var needToAdd = ['1', '3', '5'];

        for(var i=0; i<harmonicFunction.extra.length; i++){
            needToAdd.push(harmonicFunction.extra[i]);
        }

        for(var i=0; i<harmonicFunction.omit.length; i++){
            //I'm not shure if omit conntains int or char - assume that string
            switch(harmonicFunction.omit[i]){
                case "1": 
                    needToAdd.splice(needToAdd.indexOf('1'), 1)
                    break;
                case "5": 
                    needToAdd.splice(needToAdd.indexOf('5'), 1)
                    break;
            }
        }

        //Position is given
        if(harmonicFunction.position !== -1){
            soprano = harmonicFunction.position;
            needToAdd.splice(needToAdd.indexOf("" +harmonicFunction.position), 1);
        }

        //I'm not shure if revolution is int or string - assume that string
        bass = harmonicFunction.revolution;
        needToAdd.splice(needToAdd.indexOf("" + harmonicFunction.revolution), 1);

        
        console.log("Need to add");
        console.log(needToAdd);
        return [[soprano, alto, tenor, bass], needToAdd]

    }

    this.permutations = function(array, indices){        

        var res = []
        if(indices.length === 3){
            var p = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
            for(var j=0; j<p.length; j++){
                var res_element = []
                //copy array
                for(var i=0; i<array.length; i++){
                    res_element[i] = array[i];
                }
                for(var i=0; i<indices.length; i++){
                    res_element[indices[i]] = array[indices[p[j][i]]]
                }
                res.push(res_element)
                // console.log(res_element)
            }
        }
        else if (indices.length == 2){
            var p = [[0, 1], [1, 0]];
            for(var j=0; j<p.length; j++){
                res_element = []
                //copy array
                for(var i=0; i<array.length; i++){
                    res_element[i] = array[i];
                }
                for(var i=0; i<indices.length; i++){
                    res_element[indices[i]] = array[indices[p[j][i]]]
                }
                res.push(res_element)
                // console.log(res_element)
            }
        }

        //delete repeating
        var comparator = function(a,b){
            for(var i= 0; i<4; i++){
                if(a[i] == b[i]) continue;
                if(a[i] < b[i]) return -1;
                else return 1 
            }
            return 0;
        }
        res.sort(comparator);

        var N = res.length;
        for(var i=0; i<N-1; i++){
            if(comparator(res[i], res[i+1]) === 0){
                res.splice(i+1, 1);
                N--;
            }
        }

        // console.log("PERMUTATIONS")
        // res.forEach(function(x) {
        //     console.log(x)
        // })
        // console.log("END PERMUTATIONS")
        return res;
    }

    this.getSchemas = function(harmonicFunction, chordTemplate){

        var schemas = []

        var chord = chordTemplate[0];
        var needToAdd = chordTemplate[1];

        // if soprano is not set
        if(chord[0] === undefined){
            var undefined_count = 3;
            if(needToAdd.length === 3){
                chord[0] = needToAdd[0];
                chord[1] = needToAdd[1];
                chord[2] = needToAdd[2];
                schemas = schemas.concat(this.permutations(chord, [0,1,2]));
            }
            else if (needToAdd.length === 2){
                
                chord[0] = needToAdd[0];
                chord[1] = needToAdd[1];
                
                //repeated bass
                chord[2] = chord[3];
                schemas = schemas.concat(this.permutations(chord, [0,1,2]));
                //repeated needToAdd[0]
                chord[2] = chord[0];
                schemas = schemas.concat(this.permutations(chord, [0,1,2]));
                //repeated needToAdd[1]
                chord[2] = chord[1];
                schemas = schemas.concat(this.permutations(chord, [0,1,2]));
        
            }
            else if (needToAdd.length === 1){
                chord[0] = needToAdd[0];

                //repeated bass
                chord[1] = chord[3];
                chord[2] = chord[3];
                schemas = schemas.concat(this.permutations(chord, [0,1,2]));
                //repeated needToAdd[0]
                chord[1] = chord[0];
                chord[2] = chord[0];
                schemas = schemas.concat(this.permutations(chord, [0,1,2]));
                
            }
        }
        else{
            var undefined_count = 2;
            if (needToAdd.length === 2){
                
                chord[1] = needToAdd[0];
                chord[2] = needToAdd[1];
                schemas = schemas.concat(this.permutations(chord, [1,2]));
        
            }
            else if (needToAdd.length === 1){
                chord[1] = needToAdd[0]

                //repeated bass
                chord[2] = chord[3];
                schemas = schemas.concat(this.permutations(chord, [1,2]));
                //repeated needToAdd[0]
                chord[2] = needToAdd[0];
                schemas = schemas.concat(this.permutations(chord, [1,2]));
                //repeated soprano
                chord[2] = chord[0];
                schemas = schemas.concat(this.permutations(chord, [1,2]));
                
            }
        }

        console.log("SHEMAS:");
        schemas.forEach(function(x){ console.log(x)});
        console.log("SCHEMAS END");
        return schemas;
    }

    this.mapSchemas = function(harmonicFunction, schemas){
        
        //TODO minor scale
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
        
        var chordType = Consts.basicDurChord;
        var components = {
            '1' : chordType[0],
            '3' : chordType[1],
            '5' : chordType[2],
            '6' : 9,
            '7' : 10,
            '9' : 14,
        }

        var schemas_cp = schemas.slice();
        for(var i=0; i<schemas.length; i++){
            schemas_cp[i] = schemas[i].map(function(scheme){
                
                if(scheme.length > 1){
                    var intervalPitch = components[scheme.charAt(0)];
                    for(var j=1; j<scheme.length; j++){
                        if(scheme[j] === '<') intervalPitch++;
                        if(scheme[j] === '>') intervalPitch--;
                    }
                    return basicNote + intervalPitch;
                }
                return basicNote + components[scheme];
            })
        }

         console.log("SHEMAS MAPPED:");
        schemas_cp.forEach(function(x){ console.log(x)});
        console.log("SCHEMAS MAPPED END");

        return schemas_cp;

    }

    this.generate = function(harmonicFunction){

        var chords = [];
        var temp = this.getChordTemplate(harmonicFunction);
        var schemas = this.getSchemas(harmonicFunction, temp);
        var schemas_mapped = this.mapSchemas(harmonicFunction, schemas);
        var scale = new Scale.MajorScale(this.key);

        for(var i=0; i<schemas_mapped.length; i++)
        {   
            var schema_mapped = schemas_mapped[i];
            var vb = new Consts.VoicesBoundary()
            var bass = getPossiblePitchValuesFromInterval(schema_mapped[3], vb.bassMin, vb.bassMax);
            var tenor = getPossiblePitchValuesFromInterval(schema_mapped[2], vb.tenorMin, vb.tenorMax);
            var alto = getPossiblePitchValuesFromInterval(schema_mapped[1], vb.altoMin, vb.altoMax);
            var soprano = getPossiblePitchValuesFromInterval(schema_mapped[0], vb.sopranoMin, vb.sopranoMax);

            var toBaseNote = function(scaleBaseNote, harmonicFunction, intervalName){
                var int;
                if(intervalName.length > 1) int = intervalName.charAt(0);
                else int = intervalName;
                
                var intervalToBaseNote = {
                    '1': 0,
                    '2': 1,
                    '3': 2,
                    '4': 3,
                    '5': 4,
                    '6': 5,
                    '7': 6,
                    '8': 7,
                    '9': 8
                }

                return (scaleBaseNote + (harmonicFunction.degree -1) + intervalToBaseNote[int]) % 7; 
            }

        
            for(var n =0; n< bass.length; n++){
                for(var j=0; j< tenor.length; j++){
                        if(tenor[j] >= bass[n]){
                            for(var k =0; k< alto.length; k++){
                                    if(alto[k] >= tenor[j] && alto[k] - tenor[j] < 12){
                                        for(var m=0; m<soprano.length; m++){
                                                if(soprano[m] >= alto[k] && soprano[m] - alto[k] < 12){

                                                    var bassNote = new Note.Note(bass[n], toBaseNote(scale.baseNote, harmonicFunction, schemas[i][3]), schemas[i][3]);
                                                    var tenorNote = new Note.Note(tenor[j], toBaseNote(scale.baseNote, harmonicFunction, schemas[i][2]), schemas[i][2]);
                                                    var altoNote = new Note.Note(alto[k], toBaseNote(scale.baseNote, harmonicFunction, schemas[i][1]), schemas[i][1]);
                                                    var sopranoNote = new Note.Note(soprano[m], toBaseNote(scale.baseNote, harmonicFunction, schemas[i][0]), schemas[i][0]);
                                                    chords.push(new Chord.Chord(sopranoNote, altoNote, tenorNote, bassNote, harmonicFunction));
                                                    
                                                }
                                        }
                                    }
                            }
                        }
                }
            }
        }
    
        console.log("CHORDS:");
        chords.forEach(function(x){ console.log(x.toString())});
        console.log("CHORDS END:");

        return chords;

    }
}

///////////////////////TEST///////////////////////////////////