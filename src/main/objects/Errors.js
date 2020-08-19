
function BasicError(message, details) {
    this.message = message
    this.details = details
}


function FiguredBassInputError(message, details) {
    BasicError.call(this.message, this.details)
    this.source = "Error in figured bass input"
}

function HarmonicFunctionsParserError(message, details) {
    BasicError.call(this.message, this.details)
    this.source = "Error during parsing harmonic functions input"
}

function RulesCheckerError(message, details) {
    BasicError.call(this.message, this.details)
    this.source = "Error during checking connections between chords"
}

function SopranoHarmonizationInputError(message, details) {
    BasicError.call(this.message, this.details)
    this.source = "Error in soprano harmonization input"
}