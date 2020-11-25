import subprocess

subprocess.call(["python", "init.py"])
print("-"*100)

suites = [
    "generatorTest",
    "delayTest",
    "1_HarmonicFunctionsTests",
    "bassTranslatorTest",
    "rulesCheckerTest",
    "harmonicFunctionValidatorTest",
    "chordComponentManagerTest",
    "chordComponentTest",
    "intervalUtilsTest",
    "parserTest",
    "exerciseCorrectorTest",
    "sopranoRulesCheckerTest",
    "utilsTest",
    "graphBuilderTest",
    "priorityQueueTest",
    "dikstraTest",
    "harmonicFunctionGeneratorTest",
    "sopranoTests",
    # "performanceTests"
]

for s in suites:
    subprocess.call(["node", "./"+s+".js"])
    print("\x1b[0m", "-"*100)
