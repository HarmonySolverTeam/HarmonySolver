.import "./Utils.js" as Utils
.import "./HarmonicFunction.js" as HarmonicFunction
.import "./ChordComponentManager.js" as ChordComponentManager

function HarmonicFunctionValidator(){

    this.result = true;

    var validFunctionNames = ["T", "S", "D"];

    this.isValid = function(harmonicFunction){
        this.harmonicFunction = harmonicFunction;
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
    }
    
    function handleValidationFailure(_this, msg){
        _this.result = false;
        Utils.error("HarmonicFunction validation error: " + msg);
    }

    function validateFunctionName(_this, functionName){
        if(!Utils.contains( validFunctionNames, functionName)) handleValidationFailure(_this, "Invalid function name");
    }

    function validateDegree(_this, degree) {
        if(! Number.isInteger(degree)){
            handleValidationFailure(_this, "Degree is not a number");
            return
        }
        if( degree < 1 || degree > 7 ) handleValidationFailure(_this, "Invalid degree value");
    }

    function validatePosition(_this, position) {
        if(!isValidChordComponent(position))  handleValidationFailure(_this, "Invalid chordComponentString of position");
    }

    function validateRevolution(_this, revolution) {
        if(!isValidChordComponent(revolution)) handleValidationFailure(_this, "Invalid chordComponentString of revolution");
    }

    function validateDelay(_this, delay){
        if(delay.length > 4) handleValidationFailure(_this, "To large delay list - there are only four voices");
        for(var i=0; i<delay.length; i++){
            
            if(delay[i].length !== 2) handleValidationFailure(_this, "Wrong size of delay");
            
            var first = delay[i][0];
            var second = delay[i][1];

            if(!isValidChordComponent(first)) handleValidationFailure(_this, "Delay first component is not valid chordComponentString");
            if(!isValidChordComponent(second)) handleValidationFailure(_this, "Delay second component is not valid chordComponentString");

            //too large difference in delay
            var chordComponentManager = new ChordComponentManager.ChordComponentManager();
            var firstChordComponent = chordComponentManager.chordComponentFromString(first);
            var secondChordComponent = chordComponentManager.chordComponentFromString(second);

            if(Utils.abs(parseInt(firstChordComponent.baseComponent) - parseInt(secondChordComponent.baseComponent)) !== 1 ) handleValidationFailure(_this, "To large difference in delay");
            // todo to many chord compontnes!
            //todo cannot omit component used in delay, position, resolution, extra

        }
    }

    function validateExtra(){
        for()
    }

    function validateOmit(){

    }

    function validateDown(){

    }

    function validateSystem(){

    }

    function validateMode() {

    }

    function isValidChordComponent(chordComponent) {
        return (/(>|<|>>|<<)?\d+/).test(chordComponent)
    }
}