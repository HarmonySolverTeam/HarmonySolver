
function HarmonicFunction(functionName, degree, position, revolution, delay, extra, omit, down) {
    this.functionName = functionName
    this.degree = degree
    this.position = position
    this.revolution = revolution
    this.delay = delay //delayed components list
    this.extra = extra  //extra components list
    this.omit = omit //omitted components list
    this.down = down //true or false

    this.getSymbol = function(){
        return this.down?(this.functionName+"down"+this.extra):(this.functionName+this.extra)
    }
    this.equals = function(other){
        return this.functionName === other.functionName && this.degree === other.degree && this.down === other.down
    }
}
