
function BasicError(message, details) {
    this.message = message
    this.details = details
}


function FiguredBassInputError(message, details) {
    BasicError.call(this, message, details)
    this.source = "Error in figured bass input"
}

function HarmonicFunctionsParserError(message, details) {
    BasicError.call(this, message,details)
    this.source = "Error during parsing harmonic functions input"
}

function RulesCheckerError(message, details) {
    BasicError.call(this, message, details)
    this.source = "Error during checking connections between chords"
}

function SopranoHarmonizationInputError(message, details) {
    BasicError.call(this, message, details)
    this.source = "Error in soprano harmonization input"
}

function ProbablyUnexpectedError(message, details) {
    BasicError.call(this, message, details)
    this.source = "Possible error in code"
}

function PreCheckerError(message, details) {
    BasicError.call(this, message, details)
    this.source = "Error during checking exercise correctness"
}

function InvalidGraphConstruction(message, details) {
    BasicError.call(this, message, details)
    this.source = "Some conditions on graph specific structure don't match"
}

function SolverError(message, details){
    BasicError.call(this, message, details)
    this.source = "Error during harmonization"
}