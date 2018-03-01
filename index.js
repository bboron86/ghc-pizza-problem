const fileService = require('./src/services/fileService');


// DIST_MAP = determineDistancePerRide() -> 1->4; 2->2; 3->2

let NUM_ROWS = 3;
let NUM_COLS = 4;
let NUM_VEHICLES = 2;
let NUM_RIDES = 3;
let NUM_TICKS = 10;

let rides = [{
    rowStart: 0,
    columnStart: 0,
    rowFinish: 1,
    columnFinish: 3,
    startTime: 2,
    finishTime: 9,
    complete: false,
    vid: null
}];


// forEachTick (1...10)

//   forEachFreeVehicles()

//      r = findNextPossibleRide(remainingTicks, v.x, v.y)

//      v.ride = r

//   forEachAssignedVehicle() -> move() // xy updaten oder an der stelle bleiben

//   forEachFinishedRide(r -> r.isCompleted())  // deassing vehicle



