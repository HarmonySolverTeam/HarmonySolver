var Utils = require("./objects/Utils")
const UnitTest = require("./TestUtils");
var BassTranslator = require("./objects/BassTranslator")


var bassTranslatorTestSuite = new UnitTest.TestSuite("Bass Translator Tests");

var bassTranslator = new BassTranslator.BassTranslator()


const handleAlterationsTest1 = () => {

    var harmonicFunctions = JSON.parse('[[{"functionName":"T","degree":1,"revolution":"1","extra":[],"omit":[],"down":false},{"functionName":"D","degree":5,"revolution":"1","extra":[],"omit":[],"down":false},{"functionName":"T","degree":1,"revolution":"5","extra":[],"omit":[],"down":false},{"functionName":"S","degree":4,"revolution":"3","extra":[],"omit":[],"down":false},{"functionName":"T","degree":1,"revolution":"1","extra":[],"omit":[],"down":false}]]')
    var chordElements = JSON.parse('[{"notesNumbers":[0,2,4],"omit":[],"bassElement":{"bassNote":{"pitch":48,"baseNote":0,"chordComponent":1},"symbols":[{"component":3},{"component":5}]},"primeNote":0},{"notesNumbers":[4,6,8],"omit":[],"bassElement":{"bassNote":{"pitch":43,"baseNote":4,"chordComponent":1},"symbols":[{"component":3},{"component":5}]},"primeNote":4},{"notesNumbers":[4,9,7],"omit":[],"bassElement":{"bassNote":{"pitch":43,"baseNote":4,"chordComponent":5},"symbols":[{"component":6,"alteration":"b"},{"component":4}]},"primeNote":0},{"notesNumbers":[5,10,7],"omit":[],"bassElement":{"bassNote":{"pitch":45,"baseNote":5,"chordComponent":3},"symbols":[{"component":6},{"component":3}]},"primeNote":3},{"notesNumbers":[0,2,4],"omit":[],"bassElement":{"bassNote":{"pitch":48,"baseNote":0,"chordComponent":1},"symbols":[{"component":3},{"component":5}]},"primeNote":0}]')
    var mode = "major"
    var meter = [4, 4]
    var durations = [[1, 2], [1, 2], [1, 2], [1, 4], [1, 4]]

    bassTranslator.handleAlterations(harmonicFunctions, chordElements, mode, meter, durations)

    console.log(JSON.stringify(harmonicFunctions))

    return UnitTest.assertEqualsPrimitives(0, 0)
}


bassTranslatorTestSuite.addTest(new UnitTest.UnitTest(handleAlterationsTest1, "handleAlterationsTest1"))

bassTranslatorTestSuite.run()
