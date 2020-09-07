.import "./Scale.js" as Scale
.import "./Chord.js" as Chord
.import "./Note.js" as Note
.import "./ChordComponentManager.js" as ChordComponentManager
.import "./Consts.js" as Consts
.import "./Utils.js" as Utils

function ChordGenerator(key, mode) {
    this.key = key;
    this.mode = mode;

    function getPossiblePitchValuesFromInterval(note, minPitch, maxPitch) {

        while (note - minPitch >= 12) {
            note = note - 12;
        }

        while (note - minPitch < 0) {
            note = note + 12;
        }

        var possiblePitch = [];
        while (maxPitch - note >= 0) {
            possiblePitch.push(note);
            note = note + 12;
        }

        return possiblePitch;
    }

    this.getChordTemplate = function (harmonicFunction) {

        var bass = undefined;
        var tenor = undefined;
        var alto = undefined;
        var soprano = undefined;

        var needToAdd = harmonicFunction.getBasicChordComponents();

        for (var i = 0; i < harmonicFunction.extra.length; i++) {
            //todo chopin chord need to be implemented again in new architecture

            // if (harmonicFunction.extra[i].length > 2) {
            //     if (harmonicFunction.extra[i][0] === "1" && harmonicFunction.extra[i][1] === "3")
            //         soprano = "6" + harmonicFunction.extra[i].splice(2, harmonicFunction.extra[i].length);
            //     continue;
            // }
            needToAdd.push(harmonicFunction.extra[i]);
        }

        for(i = 0; i < harmonicFunction.omit.length; i++) {
            if(Utils.contains(needToAdd, harmonicFunction.omit[i]))
                needToAdd.splice(needToAdd.indexOf(harmonicFunction.omit[i]), 1);
        }

        //Position is given
        if (harmonicFunction.position !== undefined) {
            soprano = harmonicFunction.position;
            if(Utils.contains(needToAdd, harmonicFunction.position))
                needToAdd.splice(needToAdd.indexOf(harmonicFunction.position), 1);
        }

        //Revolution handling
        bass = harmonicFunction.revolution;
        if(Utils.contains(needToAdd, harmonicFunction.revolution))
            needToAdd.splice(needToAdd.indexOf(harmonicFunction.revolution), 1);

        return [[soprano, alto, tenor, bass], needToAdd]

    };

    this.permutations = function (array, indices) {

        var res = []
        if (indices.length === 3) {
            var p = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
            for (var j = 0; j < p.length; j++) {
                var res_element = []
                //copy array
                for (var i = 0; i < array.length; i++) {
                    res_element[i] = array[i];
                }
                for (var i = 0; i < indices.length; i++) {
                    res_element[indices[i]] = array[indices[p[j][i]]]
                }
                res.push(res_element)
            }
        } else if (indices.length === 2) {
            var p = [[0, 1], [1, 0]];
            for (var j = 0; j < p.length; j++) {
                res_element = []
                //copy array
                for (var i = 0; i < array.length; i++) {
                    res_element[i] = array[i];
                }
                for (var i = 0; i < indices.length; i++) {
                    res_element[indices[i]] = array[indices[p[j][i]]]
                }
                res.push(res_element)
            }
        }

        //delete repeating
        var comparator = function (a, b) {
            for (var i = 0; i < 4; i++) {
                if (a[i].semitonesNumber === b[i].semitonesNumber) continue;
                if (a[i].semitonesNumber < b[i].semitonesNumber) return -1;
                else return 1
            }
            return 0;
        }
        res.sort(comparator);

        var N = res.length;
        for (var i = 0; i < N - 1; i++) {
            if (comparator(res[i], res[i + 1]) === 0) {
                res.splice(i + 1, 1);
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

    this.getSchemas = function (harmonicFunction, chordTemplate) {


        // console.log(chordTemplate);

        var schemas = []

        var chord = chordTemplate[0];
        var needToAdd = chordTemplate[1];

        var possible_to_double = harmonicFunction.getPossibleToDouble();

        // if soprano is not set
        if (chord[0] === undefined) {
            var undefined_count = 3;
            if (needToAdd.length === 3) {
                chord[0] = needToAdd[0];
                chord[1] = needToAdd[1];
                chord[2] = needToAdd[2];
                schemas = schemas.concat(this.permutations(chord, [0, 1, 2]));
            } else if (needToAdd.length === 2) {

                chord[0] = needToAdd[0];
                chord[1] = needToAdd[1];

                for(var i=0; i<possible_to_double.length; i++) {
                    chord[2] = possible_to_double[i];
                    schemas = schemas.concat(this.permutations(chord, [0, 1, 2]));
                }

            } else if (needToAdd.length === 1) {
                chord[0] = needToAdd[0];

                if(possible_to_double.length === 2){
                    chord[1] = possible_to_double[0];
                    chord[2] = possible_to_double[0];
                    schemas = schemas.concat(this.permutations(chord, [0, 1, 2]));
                    chord[1] = possible_to_double[0];
                    chord[2] = possible_to_double[1];
                    schemas = schemas.concat(this.permutations(chord, [0, 1, 2]));
                    chord[1] = possible_to_double[1];
                    chord[2] = possible_to_double[1];
                    schemas = schemas.concat(this.permutations(chord, [0, 1, 2]));
                }
                else if (possible_to_double.length === 1){
                    chord[1] = possible_to_double[0];
                    chord[2] = possible_to_double[0];
                    schemas = schemas.concat(this.permutations(chord, [0, 1, 2]));
                }


            }
        } else {
            var undefined_count = 2;
            if (needToAdd.length === 2) {

                chord[1] = needToAdd[0];
                chord[2] = needToAdd[1];
                schemas = schemas.concat(this.permutations(chord, [1, 2]));

            } else if (needToAdd.length === 1) {
                chord[1] = needToAdd[0]

                for(var i=0; i<possible_to_double.length; i++) {
                    chord[2] = possible_to_double[i];
                    schemas = schemas.concat(this.permutations(chord, [0, 1, 2]));
                }

            } else if (needToAdd.length === 0){

                if(possible_to_double.length === 2){
                    chord[1] = possible_to_double[0];
                    chord[2] = possible_to_double[0];
                    schemas = schemas.concat(this.permutations(chord, [0, 1, 2]));
                    chord[1] = possible_to_double[0];
                    chord[2] = possible_to_double[1];
                    schemas = schemas.concat(this.permutations(chord, [0, 1, 2]));
                    chord[1] = possible_to_double[1];
                    chord[2] = possible_to_double[1];
                    schemas = schemas.concat(this.permutations(chord, [0, 1, 2]));
                }
                else if (possible_to_double.length === 1){
                    chord[1] = possible_to_double[0];
                    chord[2] = possible_to_double[0];
                    schemas = schemas.concat(this.permutations(chord, [0, 1, 2]));
                }

            }
        }


        // console.log("SHEMAS:");
        // schemas.forEach(function(x){ console.log(x)});
        // console.log("SCHEMAS END");

        return schemas;
    };

    this.mapSchemas = function (harmonicFunction, schemas) {

        var scale = harmonicFunction.mode === Consts.MODE.MAJOR ? new Scale.MajorScale(this.key) : new Scale.MinorScale(this.key);

        var chordFirstPitch = scale.tonicPitch + scale.pitches[harmonicFunction.degree - 1];

        var schemas_cp = schemas.slice();
        for (var i = 0; i < schemas.length; i++) {
            schemas_cp[i] = schemas[i].map(function (scheme_elem) {
                var intervalPitch = scheme_elem.semitonesNumber;
                return chordFirstPitch + intervalPitch;
            })
        }

       // console.log("SHEMAS MAPPED:");
      //  schemas_cp.forEach(function(x){ console.log(x)});
       // console.log("SCHEMAS MAPPED END");

        return schemas_cp;

    };

    this.generate = function (harmonicFunction, givenNotes) {

        var chords = [];
        var temp = this.getChordTemplate(harmonicFunction);
        var schemas = this.getSchemas(harmonicFunction, temp);
        var schemas_mapped = this.mapSchemas(harmonicFunction, schemas);

        var scale = harmonicFunction.mode === Consts.MODE.MAJOR ? new Scale.MajorScale(this.key) : new Scale.MinorScale(this.key);

        for (var i = 0; i < schemas_mapped.length; i++) {
            var schema_mapped = schemas_mapped[i];
            var vb = new Consts.VoicesBoundary()
            var bass = getPossiblePitchValuesFromInterval(schema_mapped[3], vb.bassMin, vb.bassMax);
            var tenor = getPossiblePitchValuesFromInterval(schema_mapped[2], vb.tenorMin, vb.tenorMax);
            var alto = getPossiblePitchValuesFromInterval(schema_mapped[1], vb.altoMin, vb.altoMax);
            var soprano = getPossiblePitchValuesFromInterval(schema_mapped[0], vb.sopranoMin, vb.sopranoMax);

            var toBaseNote = function (scaleBaseNote, harmonicFunction, chordComponent) {
                var int = chordComponent.baseComponent;

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

                return Utils.mod((scaleBaseNote + (harmonicFunction.degree - 1) + intervalToBaseNote[int]), 7);
            }


            for (var n = 0; n < bass.length; n++) {
                for (var j = 0; j < tenor.length; j++) {
                    if (tenor[j] >= bass[n]) {
                        for (var k = 0; k < alto.length; k++) {
                            if (alto[k] >= tenor[j] && alto[k] - tenor[j] <= 12) {
                                for (var m = 0; m < soprano.length; m++) {
                                    if (soprano[m] >= alto[k] && soprano[m] - alto[k] <= 12) {

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

        //filtering in case of given system (open/close)
        if (harmonicFunction.system !== undefined) {

            chords = chords.filter(function (chord) {
                // console.log("\n");
                // console.log(chord.toString());
                var isInOpenInterval = function(pitch, interval){
                    for(var i= interval[0] + 1; i<interval[1];i++){
                        if( Utils.mod(i, 12) === Utils.mod(pitch, 12) ) return true;
                    }
                    return false;
                }

                var xor = function(p,q){
                    return (p || q) && !(p && q)
                }

                var interval1 = [chord.altoNote.pitch, chord.sopranoNote.pitch];
                var interval2 = [chord.tenorNote.pitch, chord.altoNote.pitch];
                // console.log(interval1)
                // console.log(interval2)

                var p = isInOpenInterval(chord.bassNote.pitch, interval1);
                var q = isInOpenInterval(chord.tenorNote.pitch, interval1);

                var r = isInOpenInterval(chord.bassNote.pitch, interval2);
                var s = isInOpenInterval(chord.sopranoNote.pitch, interval2);
                // console.log( p + " " + q + " " + r + " " + s)

                if(chord.harmonicFunction.system === "open") {
                    var t = (chord.bassNote.chordComponent === chord.tenorNote.chordComponent);
                    var u = (chord.bassNote.chordComponent === chord.sopranoNote.chordComponent);
                    
                    return (xor(p,q) || (t && p && q)) && (xor(r,s) || (u && r && s));
                }
                if(chord.harmonicFunction.system === "close") return (!p && !q && !r && !s);
                Utils.log("ILLEGAL system in harmonicFunction: " + chord.harmonicFunction.system)
                return true;
            });


        }

        // console.log("CHORDS:");
        // chords.forEach(function(x){ console.log(x.toString())});
        // console.log("CHORDS END:");

        // filtering chords with given pitches
        if (givenNotes !== undefined) {
            chords = chords.filter(function (chord) {
                function eq(x, y) {
                    return y === undefined || x.equals(y)
                }

                return eq(chord.bassNote, givenNotes[0]) &&
                    eq(chord.tenorNote, givenNotes[1]) &&
                    eq(chord.altoNote, givenNotes[2]) &&
                    eq(chord.sopranoNote, givenNotes[3])
            })
        }

        return chords;

    }
}
