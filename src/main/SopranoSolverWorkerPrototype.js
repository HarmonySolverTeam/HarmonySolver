//path is relative to building script context
.import "../dto/SopranoSolverRequestDto.js" as Dto

var d = 0
var D = ${counter} * 11

WorkerScript.onMessage = function(sopranoSolverRequestDto) {

    var dto = Dto.sopranoSolverRequestReconstruct(sopranoSolverRequestDto)
    var solver = new SopranoSolver(dto.sopranoExercise, dto.punishmentRatios)
    var solution = solver.solve()
    WorkerScript.sendMessage({ 'type' : "solution", 'solution': solution, 'durations': dto.sopranoExercise.durations})

}