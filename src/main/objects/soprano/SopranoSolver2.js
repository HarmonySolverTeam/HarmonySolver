.import "../soprano/HarmonicFunctionGenerator.js" as HarmonicFunctionGenerator
    .import "../soprano/SopranoRulesChecker.js" as SopranoRulesChecker
    .import "../algorithms/SopranoGraphBuilder.js" as SopranoGraphBuilder
    .import "../harmonic/Exercise.js" as HarmonicFunctionsExercise
    .import "../utils/Utils.js" as Utils
    .import "../algorithms/Dikstra.js" as Dikstra
    .import "../harmonic/Exercise.js" as Exercise
    .import "../harmonic/Solver2.js" as HarmonisationSolver
    .import "../commons/ExerciseSolution.js" as ExerciseSolution
    .import "../commons/Errors.js" as Errors
    .import "../harmonic/ChordGenerator.js" as ChordGenerator
    .import "../harmonic/ChordRulesChecker.js" as RulesChecker
    .import "../algorithms/Graph.js" as Graph

function SopranoSolver(exercise, punishmentRatios){

    this.exercise = exercise;
    this.harmonicFunctionGenerator = new HarmonicFunctionGenerator.HarmonicFunctionGenerator(this.exercise.possibleFunctionsList, this.exercise.key, this.exercise.mode);
    this.numberOfRetry = 10;
    this.punishmentRatios = punishmentRatios;
    this.sopranoRulesChecker = new SopranoRulesChecker.SopranoRulesChecker(this.exercise.key, this.exercise.mode, this.punishmentRatios);

    this.mapToHarmonisationExercise = function(harmonicFunctions){
        var measures = []
        var current_measure = []
        var counter = 0
        var tmp = "";
        for(var i=0; i<this.exercise.notes.length; i++){
            var note = this.exercise.notes[i];
            counter += note.duration[0] / note.duration[1]
            current_measure.push(harmonicFunctions[i])
            tmp += harmonicFunctions[i].getSimpleChordName() + " "
            if( counter === this.exercise.meter[0]/this.exercise.meter[1]){
                tmp += "| "
                measures.push(current_measure)
                current_measure = []
                counter = 0
            }
        }
        tmp += "\n"
        // console.log(tmp)
        return new Exercise.Exercise(this.exercise.key, this.exercise.meter, this.exercise.mode, measures);
    }

    this.prepareSopranoGeneratorInputs = function(sopranoExercise){
        var inputs = [];
        for(var i=0; i<sopranoExercise.measures.length; i++){
            var duration_sum = 0;
            for(var j=0; j<sopranoExercise.measures[i].notes.length; j++){
                // console.log( "Duration sum: " + duration_sum + " \tMeasure place " + Utils.getMeasurePlace(sopranoExercise.meter, duration_sum));
                inputs.push(new HarmonicFunctionGenerator.HarmonicFunctionGeneratorInput(sopranoExercise.measures[i].notes[j], i===0 && j==0, i===sopranoExercise.measures.length-1 && j === sopranoExercise.measures[i].notes.length -1 , Utils.getMeasurePlace(sopranoExercise.meter, duration_sum)))
                duration_sum = duration_sum + sopranoExercise.measures[i].notes[j].duration[0]/sopranoExercise.measures[i].notes[j].duration[1];
            }
        }
        return inputs;
    }

    this.solve = function (){
        var graphBuilder = new SopranoGraphBuilder.SopranoGraphBuilder();
        graphBuilder.withOuterGenerator(this.harmonicFunctionGenerator);
        graphBuilder.withOuterEvaluator(this.sopranoRulesChecker);
        graphBuilder.withOuterGeneratorInput(this.prepareSopranoGeneratorInputs(this.exercise));
        graphBuilder.withInnerGenerator(new ChordGenerator.ChordGenerator(this.exercise.key, this.exercise.mode));
        var innerEvaluator = Utils.isDefined(this.punishmentRatios) ?
            new RulesChecker.AdaptiveChordRulesChecker(this.punishmentRatios) :
            new RulesChecker.ChordRulesChecker(false, true);
        graphBuilder.withInnerEvaluator(innerEvaluator);

        var graph = graphBuilder.build();

        var dikstra = new Dikstra.Dikstra(graph);
        var sol_nodes = dikstra.getShortestPathToLastNode();

        if(sol_nodes.length !== this.exercise.notes.length) throw new Errors.SolverError("Cannot find any harmonic function sequence satisfying given notes");

        var layers = []
        var harmonicFunctions = []
        for (var i = 0; i < sol_nodes.length; i++) {
            layers.push(sol_nodes[i].nestedLayer)
            harmonicFunctions.push(sol_nodes[i].content.harmonicFunction)
        }

        var graphBuilder = new Graph.GraphBuilder();
        graphBuilder.withEvaluator(innerEvaluator);
        graphBuilder.withConnectedLayers(layers);
        var innerGraph = graphBuilder.build();

        // console.log("PRINTINF")
        // innerGraph.enumerateNodes()
        // innerGraph.printEdges()
        // console.log("PRINTINF END")
        var harmonisationExercise = this.mapToHarmonisationExercise(harmonicFunctions);
        var harmonisationSolver = new HarmonisationSolver.Solver(harmonisationExercise, undefined, this.exercise.notes, true, false, this.punishmentRatios);
        harmonisationSolver.overrideGraph(innerGraph);
        var solutionCandidate = harmonisationSolver.solve();

        if(!solutionCandidate.success) throw new Errors.SolverError("Error that should not occur");

        return solutionCandidate;
    }

}