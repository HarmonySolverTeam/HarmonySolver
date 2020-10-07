.import "./Scale.js" as Scale
.import "./ChordComponentManager.js" as ChordComponentManager
.import "./Utils.js" as Utils
.import "./HarmonicFunctionValidator.js" as HarmonicFunctionValidator
.import "./Consts.js" as Consts

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

    var cm = new ChordComponentManager.ChordComponentManager();

    this.functionName = params["functionName"];
    this.degree = params["degree"] === undefined ? getDegreeFromFunctionName(this.functionName) : params["degree"];
    this.position = params["position"];
    this.revolution = params["revolution"] === undefined ? (params["down"] === true ? "1>" : "1") : params["revolution"];
    this.delay = params["delay"] === undefined ? [] : params["delay"];
    this.extra = params["extra"] === undefined ? [] : params["extra"];
    this.omit = params["omit"] === undefined ? [] : params["omit"];
    this.down = params["down"] === undefined ? false : params["down"];
    this.system = params["system"];
    this.mode = params["mode"] === undefined ? Consts.MODE.MAJOR : params["mode"];
    this.key = params["key"];

    // mapping to ChordComponent
    if(this.position !== undefined) this.position = cm.chordComponentFromString(this.position);
    this.revolution = cm.chordComponentFromString(this.revolution);
    for(var i=0; i<this.delay.length; i++){
        this.delay[i][0] = cm.chordComponentFromString(this.delay[i][0]);
        this.delay[i][1] = cm.chordComponentFromString(this.delay[i][1]);
    }
    for(i=0; i<this.extra.length; i++) this.extra[i] = cm.chordComponentFromString(this.extra[i]);
    for(i=0; i<this.omit.length; i++) this.omit[i] = cm.chordComponentFromString(this.omit[i]);


    function getDegreeFromFunctionName(functionName){
        return {"T":1, "S":4, "D":5}[functionName];
    }

    this.getBasicChordComponents = function () {
        var chordComponentManager = new ChordComponentManager.ChordComponentManager();
        var scale = this.mode === Consts.MODE.MAJOR ? new Scale.MajorScale("X") : new Scale.MinorScale("X");
        var basicChordComponents;

        if(!this.down) {
            var thirdPitch = Utils.mod(scale.pitches[Utils.mod(this.degree + 1, 7)] - scale.pitches[Utils.mod(this.degree - 1, 7)], 12);
            var fifthPitch = Utils.mod(scale.pitches[Utils.mod(this.degree + 3, 7)] - scale.pitches[Utils.mod(this.degree - 1, 7)], 12);


            basicChordComponents = [chordComponentManager.chordComponentFromString("1"),
                                    chordComponentManager.basicChordComponentFromPitch(thirdPitch),
                                    chordComponentManager.basicChordComponentFromPitch(fifthPitch)];
        }
        else {
            basicChordComponents = [chordComponentManager.chordComponentFromString("1>"),
                chordComponentManager.chordComponentFromString("3>"),
                chordComponentManager.chordComponentFromString("5>")];
        }

        return basicChordComponents;
    };

    //additional rules
    if((Utils.contains(this.extra, cm.chordComponentFromString("9")) || Utils.contains(this.extra, cm.chordComponentFromString("9>")) || Utils.contains(this.extra, cm.chordComponentFromString("9<")))
        && !Utils.contains(this.extra, cm.chordComponentFromString("7")) && !Utils.contains(this.extra, cm.chordComponentFromString("7<"))) {
        this.extra.push(cm.chordComponentFromString("7"));
    }
    if(this.position !== undefined && !Utils.contains(this.getBasicChordComponents(), this.position) && !Utils.contains(this.extra, this.position)) this.extra.push(this.position);
    if(!Utils.contains(this.getBasicChordComponents(), this.revolution) && !Utils.contains(this.extra, this.revolution)) this.extra.push(this.revolution);
    if(Utils.contains(this.extra, cm.chordComponentFromString("5<")) || Utils.contains(this.extra, cm.chordComponentFromString("5>"))) this.omit.push(cm.chordComponentFromString("5"));

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
            && Utils.contains(this.extra, cm.chordComponentFromString("7"))
            && Utils.containsBaseChordComponent(this.extra, "6")
    };

    this.isInDominantRelationToDegree = function (nextFunctionDegree) {
        return Utils.contains([4,-3], this.degree - nextFunctionDegree)
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
}

function HarmonicFunction(functionName, degree, position, revolution, delay, extra, omit, down, system, mode, key) {
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
        "key" : key
    };
    HarmonicFunction2.call(this, args);
}
