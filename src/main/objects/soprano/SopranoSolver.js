.import "./HarmonicFunctionGenerator.js" as HarmonicFunctionGenerator
.import "./SopranoRulesChecker.js" as SopranoRulesChecker
.import "../algorithms/Graph.js" as Graph
.import "../harmonic/Exercise.js" as HarmonicFunctionsExercise
.import "../utils/Utils.js" as Utils
.import "../algorithms/Dikstra.js" as Dikstra
.import "../harmonic/Exercise.js" as Exercise
.import "../harmonic/Solver2.js" as HarmonisationSolver

function SopranoSolver(exercise){

    this.exercise = exercise;
    this.harmonicFunctionGenerator = new HarmonicFunctionGenerator.HarmonicFunctionGenerator(this.exercise.possibleFunctionsList, this.exercise.key, this.exercise.mode);
    this.sopranoRulesChecker = new SopranoRulesChecker.SopranoRulesChecker(this.exercise.key);

    this.mapToHarmonisationExercise = function(harmonicFunctions){
        var measures = []
        var cursor = 0;
        for(var i=0; i<this.exercise.measures.length; i++){
            var measure = []
            for(var j=0; j<this.exercise.measures[i].notes.length; j++){
                measure.push(harmonicFunctions[cursor]);
                cursor++;
            }
            measures.push(measure);
        }

        return new Exercise.Exercise(this.exercise.key, this.exercise.meter, this.exercise.mode, measures);
    }

    this.prepareSopranoGeneratorInputs = function(sopranoExercise){
        var inputs = [];
        var duration_sum = 0;
        for(var i=0; i<sopranoExercise.notes.length; i++){
            duration_sum = duration_sum + sopranoExercise.notes[i].duration[0]/sopranoExercise.notes[i].duration[1];
            inputs.push(new HarmonicFunctionGenerator.HarmonicFunctionGeneratorInput(sopranoExercise.notes[i], i===0, i===sopranoExercise.notes.length-1, Utils.getMeasurePlace(sopranoExercise.meter, Utils.mod(duration_sum, sopranoExercise.meter[1])) ))
        }
        return inputs;
    }

    this.solve = function (){
        var graphBuilder = new Graph.GraphBuilder();
        graphBuilder.withGenerator(this.harmonicFunctionGenerator);
        graphBuilder.withEvaluator(this.sopranoRulesChecker);
        graphBuilder.withInput(this.prepareSopranoGeneratorInputs(this.exercise));
        var graph = graphBuilder.build();

        var dikstra = new Dikstra.Dikstra(graph);
        var sol_nodes = dikstra.getShortestPathToLastNode();

        var sol_functions = []
        for(var i=0; i<sol_nodes.length; i++) {
            sol_functions.push(sol_nodes[i].content.harmonicFunction)
            // console.log(sol_functions[i].harmonicFunction.functionName)
        }

        var harmonisationExercise = this.mapToHarmonisationExercise(sol_functions);
        var harmonisationSolver = new HarmonisationSolver.Solver(harmonisationExercise, undefined, this.exercise.notes);
        return harmonisationSolver.solve();
    }

}