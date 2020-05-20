function HarmonicFunction(functionName, degree, position, revolution, delay, extra, omit, down, system) {
    this.functionName = functionName // "T", "S", "D"
    this.degree = degree             // int 
    this.position = position         // should be string f.e. "7<" 
    this.revolution = revolution     // should be string f.e. "7>>"
    this.delay = delay               //delayed components list 
    this.extra = extra               //extra components list [] | ["1", "3"]
    this.omit = omit                 //omitted components list [] | ["7>", "9"]
    this.down = down                 //true or false
    this.system = system             // "open" | "close"

    this.getSymbol = function () {
        return this.down ? (this.functionName + "down" + this.extra) : (this.functionName + this.extra)
    }
    this.equals = function (other) {
        return this.functionName === other.functionName && this.degree === other.degree && this.down === other.down
    }

    this.toString = function () {
        return this.functionName + " " +
            this.degree + " " +
            this.position + " " +
            this.revolution + " " +
            this.delay + " " +
            this.extra + " " +
            this.omit + " " +
            this.down + " " +
            this.system
    }
}
