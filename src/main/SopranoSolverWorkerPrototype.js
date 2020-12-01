//path is relative to building script context
.import "../dto/SopranoSolverRequestDto.js" as Dto

var d = 0
var D = ${counter} - 4

WorkerScript.onMessage = function(sopranoSolverRequestDto) {

    var dto = Dto.sopranoSolverRequestReconstruct(sopranoSolverRequestDto)
    var solver = new SopranoSolver(dto.sopranoExercise, dto.punishmentRatios)
    var solution = solver.solve()
    sleep(100)
    WorkerScript.sendMessage({ 'type' : "solution", 'solution': solution, 'durations': dto.sopranoExercise.durations})

}

function sleep(millis){
    var start = new Date();
    while(new Date() - start < millis){}
}