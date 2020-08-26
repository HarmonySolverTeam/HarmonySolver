.import "./Scale.js" as Scale
.import "./ChordComponentManager.js" as ChordComponentManager
.import "./Utils.js" as Utils

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

    this.functionName = params["functionName"];
    this.degree = params["degree"] === undefined ? getDegreeFromFuntionName(this.functionName) : params["degree"];
    this.position = params["position"];
    this.revolution = params["revolution"] === undefined ? (params["down"] === true ? "1>" : "1") : params["revolution"];
    this.delay = params["delay"] === undefined ? [] : params["delay"];
    this.extra = params["extra"] === undefined ? [] : params["extra"];
    this.omit = params["omit"] === undefined ? [] : params["omit"];
    this.down = params["down"] === undefined ? false : params["down"];
    this.system = params["system"];
    this.mode = params["mode"] === undefined ? 'major' : params["mode"];

    this.getBasicChordComponents = function () {
        var scale = this.mode === 'major' ? new Scale.MajorScale("X") : new Scale.MinorScale("X");

        var thirdPitch = Utils.mod(scale.pitches[Utils.mod(this.degree + 1, 7)] - scale.pitches[Utils.mod(this.degree - 1, 7)], 12 );
        var fifthPitch = Utils.mod(scale.pitches[Utils.mod(this.degree + 3 ,7)] - scale.pitches[Utils.mod(this.degree - 1, 7)], 12 );

        var chordComponentManager = new ChordComponentManager.ChordComponentManager();

        var basicChordComponents = [chordComponentManager.chordComponentFromString("1"),
            chordComponentManager.basicChordComponentFromPitch(thirdPitch),
            chordComponentManager.basicChordComponentFromPitch(fifthPitch)];

        if(this.down) {
            basicChordComponents[0] = chordComponentManager.chordComponentFromString(basicChordComponents[0].chordComponentString + ">");
            // basicChordComponents[2] = chordComponentManager.chordComponentFromString(basicChordComponents[2].chordComponentString + ">");
        }

        return basicChordComponents;
    };

    this.getBasicChordComponentsStrings = function () {
        var res = this.getBasicChordComponents();
        res = res.map(function (chordComponent) {
            return chordComponent.chordComponentString;
        })
        return res
    }

    //additional rules
    if(Utils.contains(this.extra, "9") && !Utils.contains(this.extra, "7")) this.extra.push("7");
    if(this.position !== undefined && !Utils.contains(this.getBasicChordComponentsStrings(), this.position) && !Utils.contains(this.extra, this.position)) this.extra.push(this.position);
    if(!Utils.contains(this.getBasicChordComponentsStrings(), this.revolution) && !Utils.contains(this.extra, this.revolution)) this.extra.push(this.revolution);

    function getDegreeFromFuntionName(functionName){
        return {"T":1, "S":4, "D":5}[functionName];
    }

    // this.getBasicChordComponents = function(){
    //
    // };
    //todo tmp function impl

    this.getPossibleToDouble = function () {
        var res = this.getBasicChordComponents();
        res = res.map(function (chordComponent) {
            return chordComponent.chordComponentString;
        })
        for (var i = 0; i < this.omit.length; i++)
            res.splice(res.indexOf(this.omit[i]), 1);
        return res;
    };

    this.equals = function (other) {
        return this.functionName === other.functionName && this.degree === other.degree && this.down === other.down
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
            "Mode: " + this.mode
    };

}

function HarmonicFunction(functionName, degree, position, revolution, delay, extra, omit, down, system, mode) {
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
        "mode" : mode
    };
    HarmonicFunction2.call(this, args);
}
