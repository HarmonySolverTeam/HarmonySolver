.import "./Scale.js" as Scale
.import "./Chord.js" as Chord
.import "./Note.js" as Note
.import "./Consts.js" as Consts

function SopranoSolver(key){
    
    this.key = key;

    this.chordsMap = {
        0:[],
        1:[],
        2:[],
        3:[],
        4:[],
        5:[],
        6:[],
        7:[],
        8:[],
        9:[],
        10:[],
        11:[]
    }

    this.getChordsMap = function(){
        return this.chordsMap;
    }

    this.getChordBasePitch = function (harmonicFunction) {

        var chordElement = ['1', '3', '5'];

        for (var i = 0; i < harmonicFunction.extra.length; i++) {
            //Chopin chord
            if (harmonicFunction.extra[i].length > 2) {
                if (harmonicFunction.extra[i][0] == "1" && harmonicFunction.extra[i][1] == "3")
                    chordElement = "6" + harmonicFunction.extra[i].splice(2, harmonicFunction.extra[i].length);
                continue;
            }
            chordElement.push(harmonicFunction.extra[i]);
        }

        for (var i = 0; i < harmonicFunction.omit.length; i++) {
            //I'm not shure if omit conntains int or char - assume that string
            switch (harmonicFunction.omit[i]) {
                case "1":
                    chordElement.splice(chordElement.indexOf('1'), 1)
                    break;
                case "5":
                    chordElement.splice(chordElement.indexOf('5'), 1)
                    break;
            }
        }

        chordElement = chordElement;

        //TODO minor scale
        var scale = new Scale.MajorScale(this.key);
        var basicNote = scale.tonicPitch + scale.pitches[harmonicFunction.degree - 1];

        var chordType;
        var d = harmonicFunction.degree;
        if (d === 1 || d === 4 || d === 5) chordType = Consts.basicMajorChord;
        else chordType = Consts.basicMinorChord;
        var components = {
            '1': chordType[0],
            '3': chordType[1],
            '5': chordType[2],
            '6': 9,
            '7': 10,
            '9': 14,
        }

        var chordElement_cp = chordElement.slice();

        chordElement_cp = chordElement.map(function (scheme) {

            if (scheme.length > 1) {
                var intervalPitch = components[scheme.charAt(0)];
                for (var j = 1; j < scheme.length; j++) {
                    if (scheme[j] === '<') intervalPitch++;
                    if (scheme[j] === '>') intervalPitch--;
                }
                return (basicNote + intervalPitch) % 12;
            }
            return (basicNote + components[scheme]) % 12;
        })
        
        return chordElement_cp;
    }

    //assume that harmonic functions in harmonicFunctions are unique
    this.prepareMap = function(harmonicFunctions){
        
        for(var i=0; i<harmonicFunctions.length; i++){
            
            var basePitches = this.getChordBasePitch(harmonicFunctions[i]); 
            for(var j=0; j < basePitches.length; j++){
                this.chordsMap[basePitches[j]].push(harmonicFunctions[i])
            }

        }
    }

    
}