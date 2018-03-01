const fileService = require('./src/services/fileService');
const rideService = require('./src/services/rideService');

const FILE_NAME_WITHOUT_EXTENSION = 'a_example';
const fileLines = fileService.getFileLines(`./input/${FILE_NAME_WITHOUT_EXTENSION}.in`);

// extract the first line
const [NUM_ROWS, NUM_COLS, NUM_VEHICLES, NUM_RIDES, BONUS, NUM_TICKS] = fileLines.shift().split(' ');
const rides = rideService.getAllRides(fileLines);
// DIST_MAP = determineDistancePerRide() -> 1->4; 2->2; 3->2

// forEachTick (1...10)

//   forEachFreeVehicles()

//      r = findNextPossibleRide(remainingTicks, v.x, v.y)

//      v.ride = r

//   forEachAssignedVehicle() -> move() // xy updaten oder an der stelle bleiben

//   forEachFinishedRide(r -> r.isCompleted())  // deassing vehicle

