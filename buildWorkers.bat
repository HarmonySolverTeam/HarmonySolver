
cd ./src/main/objects/soprano
python ../../utils/buildWorker.py ../soprano/SopranoSolver2.js
cd ../harmonic
python ../../utils/buildWorker.py ../harmonic/Solver2.js
cd ../../../..