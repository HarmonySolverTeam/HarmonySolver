/*
Example usage:
    var x1 = new UnitTest(()=>{return assertNotEqualsPrimitives(5,1)}, "5!=1 Test")
    var x2 = new UnitTest(()=>{return assertTrue(false)}, "Wrong Test")
    var suite = new TestSuite();
    suite.addTest(x1);
    suite.addTest(x2);
    suite.run()
 */


function assertEqualsObjects(expected, actual){
    return expected.equals(actual)
}

function assertNotEqualsObjects(expected, actual){
    return !expected.equals(actual)
}

function assertEqualsPrimitives(expected, actual){
    return expected === actual
}

function assertNotEqualsPrimitives(expected, actual){
    return !(expected === actual)
}

// message - expected error message, fun - function reference, args - arguments of fun as list
function assertThrows(message, fun, args){
    try {
        for (var i = 0; i < args.length; i++)
            fun = fun.apply(args[i]);
        return false
    } catch(error){
        return message === error.message;
    }
}

function assertFalse(condition){
    return !condition
}

function assertTrue(condition){
    return condition
}

function fail(message){
    throw new Error("Test failed: " + message)
}

//fun should be arg-free function returning boolean (passed or not)
function UnitTest(fun, name){
    this.fun = fun;
    this.name = name;

    this.run = function () {
        return fun();
    }
}

function TestSuite(){
    this.tests = []; // [Test]

    this.addTest = function(test){
        this.tests.push(test)
    };

    this.run = function () {
        var passed = 0, failed = 0;
        for (var i = 0; i < this.tests.length; i++) {
            var currentTest = this.tests[i].run();
            if (currentTest) {
                passed += 1;
                console.log("\"" + this.tests[i].name + "\"" + " passed.")
            } else {
                failed += 1;
                console.log("\"" + this.tests[i].name + "\"" + " failed.")
            }
        }
        console.log("\n");
        console.log("Passed: " + passed + " tests.");
        console.log("Failed: " + failed + " tests.");
        if(failed > 0) console.log("TESTSUITE NOT PASSED");
        else console.log("TESTSUITE PASSED")
    }
}
