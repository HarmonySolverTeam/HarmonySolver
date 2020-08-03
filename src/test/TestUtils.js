/*
Example usage:
    var x1 = new UnitTest(()=>{return assertNotEqualsPrimitives(5,1)}, "5!=1 Test")
    var x2 = new UnitTest(()=>{return assertTrue(false)}, "Wrong Test")
    var suite = new TestSuite("Example");
    suite.addTest(x1);
    suite.addTest(x2);
    suite.run()
 */
const LOG_STYLES = {
    "Reset" : "\x1b[0m",
    "Bright" : "\x1b[1m",
    "FgRed" : "\x1b[31m",
    "FgYellow" : "\x1b[33m",
    "FgCyan" : "\x1b[36m"
};

exports.assertEqualsObjects = function assertEqualsObjects(expected, actual){
    return expected.equals(actual)
}

exports.assertNotEqualsObjects = function assertNotEqualsObjects(expected, actual){
    return !expected.equals(actual)
}

exports.assertEqualsPrimitives = function assertEqualsPrimitives(expected, actual){
    return expected === actual
}

exports.assertNotEqualsPrimitives = function assertNotEqualsPrimitives(expected, actual){
    return !(expected === actual)
}

// message - expected error message, fun - function reference, args - arguments of fun as list
exports.assertThrows = function assertThrows(message, fun, args){
    try {
        if(args.length === 0){
            fun();
            return false;
        }
        for (var i = 0; i < args.length; i++)
            fun = fun.apply(args[i]);
        return false
    } catch(error){
        return message === error.message;
    }
}

exports.assertFalse = function assertFalse(condition){
    return !condition
}

exports.assertTrue = function assertTrue(condition){
    return condition
}

exports.fail = function fail(message){
    throw new Error("Test failed: " + message)
}

//fun should be arg-free function returning boolean (passed or not)
exports.UnitTest = function UnitTest(fun, name){
    this.fun = fun;
    this.name = name;

    this.run = function () {
        return fun();
    }
}

exports.TestSuite = function TestSuite(name){
    this.tests = []; // [Test]
    this.name = name;

    this.addTest = function(test){
        this.tests.push(test)
    };

    this.run = function () {
        var passed = 0, failed = 0;
        for (var i = 0; i < this.tests.length; i++) {
            var currentTest = this.tests[i].run();
            if (currentTest) {
                passed += 1;
                console.log(LOG_STYLES.FgCyan ,"\"" + this.tests[i].name + "\"" + " passed.")
            } else {
                failed += 1;
                console.log(LOG_STYLES.FgRed ,"\"" + this.tests[i].name + "\"" + " failed.")
            }
        }
        console.log();
        if(failed === 0) console.log(LOG_STYLES.FgYellow, "\tAll tests passed.");
        else {
            console.log(LOG_STYLES.FgYellow, "\tPassed: " + passed + "/" + (passed+failed) + " tests.");
        }
        if(failed > 0) console.log(LOG_STYLES.Bright, LOG_STYLES.FgRed ,"\tTESTSUITE \"" + this.name + "\" NOT PASSED");
        else console.log(LOG_STYLES.Bright, LOG_STYLES.FgCyan, "\tTESTSUITE \"" + this.name + "\" PASSED")
    }
};
