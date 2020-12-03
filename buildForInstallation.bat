set paths=objects resources utils\myStyle.xml harmonySolver.qml SopranoSolverWorker.js SolverWorker.js

@IF %1 == -push (
cd ../HarmonySolverPlugin
git pull
cd ../HarmonySolver
)

cd ./src/main/objects/soprano
python ../../utils/buildWorker.py ../soprano/SopranoSolver2.js
cd ../harmonic
python ../../utils/buildWorker.py ../harmonic/Solver2.js
cd ../../../..

(for %%a in (%paths%) do (
    xcopy /s /q /y .\src\main\%%a ..\HarmonySolverPlugin\main\%%a /EXCLUDE:exclude.txt
))


xcopy /y /q .\README.md ..\HarmonySolverPlugin\README.md

xcopy /y /q /s .\photos ..\HarmonySolverPlugin\photos

@IF %1 == -push (
cd ../HarmonySolverPlugin
git add -u
git commit -m "Update"
git push
cd ../HarmonySolver
)