var ComponentManager = require("./objects/ChordComponentManager")
var TestUtils = require("./TestUtils")


var testSuite = new TestUtils.TestSuite("ChordComponentManager tests");

var testStaticField = () => {
    var componentManager1 = new ComponentManager.ChordComponentManager();
    var component1 = componentManager1.chordComponentFromString("5>")

    var componentManager2 = new ComponentManager.ChordComponentManager();
    var component2 = componentManager2.chordComponentFromString("5>");
    var component3 = componentManager2.chordComponentFromString("3");

    return TestUtils.assertEqualsObjects(component1, component2)
        && TestUtils.assertNotEqualsObjects(component1, component3);
};

testSuite.addTest(new TestUtils.UnitTest(testStaticField, "Test of static field emulation"));

testSuite.run()

