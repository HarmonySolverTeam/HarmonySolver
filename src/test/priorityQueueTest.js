var TestUtils = require("./TestUtils")
var Utils = require("./objects/Utils")
var PriorityQueue = require("./objects/PriorityQueue")

var testSuite = new TestUtils.TestSuite("Priority queue tests");

function ObjectWithKey(key, value){
    this.key = key;
    this.value = value;
}

var extractMinTest = () => {
    var queue = new PriorityQueue.PriorityQueue("key");
    queue.insert(new ObjectWithKey("infinity", "NODE 1"));
    queue.insert(new ObjectWithKey("infinity", "NODE 2"));
    queue.insert(new ObjectWithKey(12, "NODE 3"));
    queue.insert(new ObjectWithKey("infinity", "NODE 4"));
    queue.insert(new ObjectWithKey("infinity", "NODE 5"));
    queue.insert(new ObjectWithKey(400, "NODE 6"));

    return TestUtils.assertEqualsPrimitives("NODE 3", queue.extractMin().value)
        && TestUtils.assertEqualsPrimitives("NODE 6", queue.extractMin().value);
}

testSuite.addTest(new TestUtils.UnitTest(extractMinTest, "Extract minimum test with infinities"));

var extractMinTest2 = () => {
    var queue = new PriorityQueue.PriorityQueue("key");
    queue.insert(new ObjectWithKey("infinity", "NODE 1"));
    queue.insert(new ObjectWithKey(400, "NODE 2"));

    return TestUtils.assertEqualsPrimitives("NODE 2", queue.extractMin().value)
        && TestUtils.assertEqualsPrimitives("NODE 1", queue.extractMin().value)
        && TestUtils.assertEqualsPrimitives("empty", queue.extractMin());
}
testSuite.addTest(new TestUtils.UnitTest(extractMinTest2, "Extract minimum test when queue is empty"));

var isEmptyTest = () => {
    var queue = new PriorityQueue.PriorityQueue("key");
    queue.insert(new ObjectWithKey("infinity", "NODE 1"));
    var queue2 = new PriorityQueue.PriorityQueue("key");

    return TestUtils.assertFalse(queue.isEmpty())
        && TestUtils.assertTrue(queue2.isEmpty());
}

testSuite.addTest(new TestUtils.UnitTest(isEmptyTest, "Priority queue isEmpty method test"));

testSuite.run();
