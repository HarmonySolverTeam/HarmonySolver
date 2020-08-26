import subprocess

subprocess.call(["python", "init.py"])
print("-"*100)

suites = ["generatorTest", "preprocessingTest", "delayTest", "1_HarmonicFunctionsTests", "sopranoTests", "rulesCheckerTest", "chordComponentManagerTest", "chordComponentTest"]#,  "basstest"]

for s in suites:
    print("\nRunning {} test class\n".format(s))
    subprocess.call(["node", "./"+s+".js"])
    print("\x1b[0m", "-"*100)
