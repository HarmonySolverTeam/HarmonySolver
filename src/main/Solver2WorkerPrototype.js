//path is relative to building script context
.import "../dto/SolverRequestDto.js" as Dto

var d = 0
var D = ${counter}

WorkerScript.onMessage = function(solverRequestDto) {

    var dto = Dto.solverRequestReconstruct(solverRequestDto)
    var solver = new Solver(dto.exercise, dto.bassLine, dto.sopranoLine, dto.enableCorrector,dto.enablePrechecker)
    var solution = solver.solve()
    WorkerScript.sendMessage({ 'type' : "solution", 'solution': solution})

}