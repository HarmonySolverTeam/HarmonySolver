//path is relative to building script context
.import "../dto/SolverRequestDto.js" as Dto

var d = 0
var D = ${counter}

WorkerScript.onMessage = function(solverRequestDto) {
    try{
        var dto = Dto.solverRequestReconstruct(solverRequestDto)
        var solver = new Solver(dto.exercise, dto.bassLine, dto.sopranoLine, dto.enableCorrector,dto.enablePrechecker)
        var solution = solver.solve()
        sleep(100)
        WorkerScript.sendMessage({ 'type' : "solution", 'solution': solution})
    } catch (e) {
        WorkerScript.sendMessage({ 'type' : "error", 'error': e})
    }
}

function sleep(millis){
    var start = new Date();
    while(new Date() - start < millis){}
}