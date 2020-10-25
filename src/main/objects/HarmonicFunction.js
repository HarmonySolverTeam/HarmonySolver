.import "./Scale.js" as Scale
.import "./ChordComponentManager.js" as ChordComponentManager
.import "./Utils.js" as Utils
.import "./HarmonicFunctionValidator.js" as HarmonicFunctionValidator
.import "./Consts.js" as Consts
.import "./Errors.js" as Errors

var DEBUG = false;

function HarmonicFunction2(params){
    // Properties:
    // functionName          "T", "S", "D"
    // degree               int
    // position             should be string f.e. "<7" or "7>" or just "7"
    // revolution           should be string f.e. "<6" or "6>" or just "6"
    // delay                delayed components list
    // extra                extra components list [] | ["9", "7>"]
    // omit                 omitted components list [] | ["1", "5"]
    // down                 true or false
    // system               "open" | "close" | undefined
    // mode                 "major" | "minor"
    // key                  string, f.e. "C#", "g#", "Ab"

    //preprocessing zadania wymagał użycia tego samego chord component managera dla danej HF, co w momencie jej inicjalizacji
    this.cm = new ChordComponentManager.ChordComponentManager();
    var cm = this.cm;

    // *****CONSTUCTOR PART 1*****

    this.functionName = params["functionName"];
    this.degree = params["degree"] === undefined ? getDegreeFromFunctionName(this.functionName) : params["degree"];
    this.position = params["position"];
    this.revolution = params["revolution"] === undefined ? "1" : params["revolution"];
    this.delay = params["delay"] === undefined ? [] : params["delay"];
    this.extra = params["extra"] === undefined ? [] : params["extra"];
    this.omit = params["omit"] === undefined ? [] : params["omit"];
    this.down = params["down"] === undefined ? false : params["down"];
    this.system = params["system"];
    this.mode = params["mode"] === undefined ? Consts.MODE.MAJOR : params["mode"];
    this.key = params["key"];
    this.isRelatedBackwards = params["isRelatedBackwards"];

    // *****CONSTUCTOR PART 1 END*****

    function getDegreeFromFunctionName(functionName){
        return {"T":1, "S":4, "D":5}[functionName];
    }

    this.getPrime = function(){
        return cm.chordComponentFromString("1", this.down);
    }

    this.getThird = function(){
        if(this.down === true)
            return cm.chordComponentFromString("3", true);

        var scale = this.mode === Consts.MODE.MAJOR ? new Scale.MajorScale("X") : new Scale.MinorScale("X");
        var thirdPitch = Utils.mod(scale.pitches[Utils.mod(this.degree + 1, 7)] - scale.pitches[Utils.mod(this.degree - 1, 7)], 12);
        return cm.basicChordComponentFromPitch(thirdPitch, false);
    }

    this.getFifth = function (){
        if(this.down === true)
            return cm.chordComponentFromString("5", true);

        var scale = this.mode === Consts.MODE.MAJOR ? new Scale.MajorScale("X") : new Scale.MinorScale("X");
        var fifthPitch = Utils.mod(scale.pitches[Utils.mod(this.degree + 3, 7)] - scale.pitches[Utils.mod(this.degree - 1, 7)], 12);

        return cm.basicChordComponentFromPitch(fifthPitch, false);
    }

    this.getBasicChordComponents = function () {
        return [this.getPrime(), this.getThird(), this.getFifth()];
    };

    this.getBasicChordComponentStrings = function () {
        return [this.getPrime().chordComponentString, this.getThird().chordComponentString, this.getFifth().chordComponentString];
    }

    this.getChordComponentFromStringInThisHfContext = function(chordComponentString) {
        // console.log(chordComponentString);
        // console.log(this.getBasicChordComponents());
        if(Utils.contains(this.getBasicChordComponentStrings(), chordComponentString)){
            if(chordComponentString[0] === '1') return this.getPrime();
            if(chordComponentString[0] === '3') return this.getThird();
            if(chordComponentString[0] === '5') return this.getFifth();
        }
        return cm.chordComponentFromString(chordComponentString, this.down);
    }

    this.countChordComponents = function () {
        var chordComponentsCount = 3;
        chordComponentsCount += this.extra.length;
        chordComponentsCount -= this.omit.length;
        for(var i=0; i<this.delay.length; i++) {
            if (!Utils.contains(this.extra, this.delay[i][0])
                && Utils.contains(this.omit, this.delay[i][1])) chordComponentsCount += 1;
            if (Utils.contains(this.extra, this.delay[i][0])
                && !Utils.contains(this.omit, this.delay[i][1])) chordComponentsCount -= 1;
        }
        return chordComponentsCount;
    };

    this.getPossibleToDouble = function () {
        var res = this.getBasicChordComponents();
        for (var i = 0; i < this.omit.length; i++)
            res.splice(res.indexOf(this.omit[i]), 1);
        return res;
    };

    this.isNeapolitan = function () {
        return this.degree === 2 && this.down
            && this.functionName === Consts.FUNCTION_NAMES.SUBDOMINANT && this.mode === Consts.MODE.MINOR
            && this.revolution.baseComponent === "3"
    };

    this.isChopin = function () {
        return this.functionName === Consts.FUNCTION_NAMES.DOMINANT
            && Utils.containsChordComponent(this.omit, "5")
            && Utils.contains(this.extra, cm.chordComponentFromString("7", this.down))
            && Utils.containsBaseChordComponent(this.extra, "6")
    };

    this.containsDelayedChordComponent = function (cc) {
        for(var i = 0; i < this.delay.length; i++){
            if(this.delay[i][1] === cc)
                return true;
        }
        return false;
    };

    this.containsDelayedBaseChordComponent = function (cc) {
        for(var i = 0; i < this.delay.length; i++){
            if(this.delay[i][1].baseComponent === cc)
                return true;
        }
        return false;
    };

    this.isInDominantRelation = function (nextFunction) {
        if(this.down !== nextFunction.down && this.key === nextFunction.key)
            return false;
        if(this.key !== nextFunction.key && Utils.isDefined(this.key)){
            return Utils.contains([4,-3], this.degree - 1);
        }
        if(this.key === nextFunction.key)
            return Utils.contains([4,-3], this.degree - nextFunction.degree);
        return false;
    };

    this.copy = function copy(){
        var args = {
            "functionName" : this.functionName,
            "degree" : this.degree,
            "position" : (this.position === undefined ? undefined : this.position.chordComponentString),
            "revolution" : this.revolution.chordComponentString,
            "down" : this.down,
            "system" : this.system,
            "mode" : this.mode,
            "omit" : this.omit.map(function (cc) { return cc.chordComponentString; }),
            "extra" : this.extra.map(function (cc) { return cc.chordComponentString; }),
            "key" : this.key
        };
        return new HarmonicFunction2(args);
    }

    this.equals = function (other) {
        return this.functionName === other.functionName
            && this.degree === other.degree
            && this.down === other.down
            && this.key === other.key
    };

    this.toString = function () {
        return "FunctionName: " + this.functionName + " " +
            "Degree: " + this.degree + " " +
            "Position: " + this.position + " " +
            "Revolution: " + this.revolution + " " +
            "Delay: " + this.delay + " " +
            "Extra: " + this.extra + " " +
            "Omit: " + this.omit + " " +
            "Down: " + this.down + " " +
            "System: " + this.system + " " +
            "Mode: " + this.mode +
            "Key: " + this.key
    };

    if(DEBUG) {
        var validator = new HarmonicFunctionValidator.HarmonicFunctionValidator();
        validator.validate(this);
    }

    this.getSimpleChordName = function() {
    //    functionName [moll] [delay] [deg] [down]
        var functionNameAdapter = { "T" : "A", "S" : "B", "D":"D", "same_as_prev" : "C"};
        var res = functionNameAdapter[this.functionName];

        if(this.mode === "minor") res += "moll";

        if(this.delay.length === 1){
            res += "delay" + this.delay[0][0].chordComponentString + "-" + this.delay[0][1].chordComponentString;
        }

        if(this.delay.length === 2){
            res += "delay" + this.delay[0][0].chordComponentString + this.delay[1][0].chordComponentString
                     + "-" + this.delay[0][1].chordComponentString + this.delay[1][1].chordComponentString;
        }

        var degreeAdapter = {1: "I", 2:"II", 3:"III", 4:"IV", 5:"V", 6:"VI", 7:"VII"};

        if(this.down) {
            res += "down";
            if(this.degree === 1 || this.degree === 4 || this.degree === 5)
            res += "deg" + degreeAdapter[this.degree]
        }

        if(this.degree !== undefined && this.degree !== 1 && this.degree !== 4 && this.degree !== 5)
            res += "deg" + degreeAdapter[this.degree];

        console.log(res);
        return res;
    }

    this.isDelayRoot = function() {
        return this.delay.length > 0;
    }

    // *****CONSTUCTOR PART 2*****

    // mapping to ChordComponent
    if(this.position !== undefined) this.position = this.getChordComponentFromStringInThisHfContext(this.position);
    this.revolution = this.getChordComponentFromStringInThisHfContext(this.revolution);
    for(var i=0; i<this.delay.length; i++){
        this.delay[i][0] = this.getChordComponentFromStringInThisHfContext(this.delay[i][0]);
        this.delay[i][1] = this.getChordComponentFromStringInThisHfContext(this.delay[i][1]);
    }
    for(i=0; i<this.extra.length; i++) this.extra[i] = this.getChordComponentFromStringInThisHfContext(this.extra[i]);
    for(i=0; i<this.omit.length; i++) this.omit[i] = this.getChordComponentFromStringInThisHfContext(this.omit[i]);


    //additional rules
    if((Utils.contains(this.extra, cm.chordComponentFromString("9", this.down)) || Utils.contains(this.extra, cm.chordComponentFromString("9>", this.down)) || Utils.contains(this.extra, cm.chordComponentFromString("9<", this.down)))
        && !Utils.contains(this.extra, cm.chordComponentFromString("7", this.down)) && !Utils.contains(this.extra, cm.chordComponentFromString("7<", this.down))) {
        this.extra.push(cm.chordComponentFromString("7", this.down));
    }
    if(this.position !== undefined && !Utils.contains(this.getBasicChordComponents(), this.position) && !Utils.contains(this.extra, this.position)) this.extra.push(this.position);
    if(!Utils.contains(this.getBasicChordComponents(), this.revolution) && !Utils.contains(this.extra, this.revolution)) this.extra.push(this.revolution);
    if(Utils.contains(this.extra, cm.chordComponentFromString("5<", this.down)) || Utils.contains(this.extra, cm.chordComponentFromString("5>", this.down))) this.omit.push(cm.chordComponentFromString("5", this.down));

    if(Utils.contains(this.omit, this.cm.chordComponentFromString("1", this.down)) && this.revolution === this.cm.chordComponentFromString("1", this.down)){
        this.revolution = this.getBasicChordComponents()[1];
    }

    if(Utils.contains(this.omit, this.cm.chordComponentFromString("5", this.down))){
        var five = this.cm.chordComponentFromString("5", this.down);
        if(five !== this.getBasicChordComponents()[2]){
            this.omit = this.omit.filter(function(x){return x !== five});
            this.omit.push(this.getBasicChordComponents()[2]);
        }
    }

    if(this.revolution === this.cm.chordComponentFromString("5", this.down)){
        this.revolution = this.getBasicChordComponents()[2];
    }

    if(this.position === this.cm.chordComponentFromString("5", this.down)){
        this.position = this.getBasicChordComponents()[2];
    }

    //handle ninth chords
    // todo obnizenia -> czy nie powinno sie sprawdzac po baseComponentach 1 i 5?
    if(Utils.containsBaseChordComponent(this.extra, "9")){
        if(this.countChordComponents() > 4){
            var prime = this.getPrime()
            var fifth = this.getFifth()
            if(this.position === this.revolution){
                throw new Errors.HarmonicFunctionsParserError("HarmonicFunction validation error: " +
                    "ninth chord could not have same position as revolution")
            }
            if (Utils.contains([prime, fifth], this.position) && Utils.contains([prime, fifth], this.revolution)) {
                throw new Errors.HarmonicFunctionsParserError("HarmonicFunction validation error: " +
                    "ninth chord could not have both prime or fifth in position and revolution")
            }
            if(!Utils.contains(this.omit, fifth) && this.position !== fifth && this.revolution !== fifth) {
                this.omit.push(fifth);
            }
            else if(!Utils.contains(this.omit, prime)) {
                this.omit.push(prime);
                if(this.revolution === prime)
                    this.revolution = this.getBasicChordComponents()[1];
            }
        }
    }
// *****CONSTUCTOR PART 2 END*****

}

function HarmonicFunction(functionName, degree, position, revolution, delay, extra, omit, down, system, mode, key, isRelatedBackwards) {
    var args = {
        "functionName" : functionName,
        "degree" : degree,
        "position" : position,
        "revolution" : revolution,
        "delay" : delay,
        "extra" : extra,
        "omit" : omit,
        "down" : down,
        "system" : system,
        "mode" : mode,
        "key" : key,
        "isRelatedBackwards" : isRelatedBackwards
    };
    HarmonicFunction2.call(this, args);
}
