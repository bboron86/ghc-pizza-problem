const fileService = require('./src/services/fileService');
const rideService = require('./src/services/rideService');

const FILE_NAME_WITHOUT_EXTENSION = 'a_example';
const fileLines = fileService.getFileLines(`./input/${FILE_NAME_WITHOUT_EXTENSION}.in`);

// extract the first line
const [NUM_ROWS, NUM_COLS, NUM_VEHICLES, NUM_RIDES, BONUS, NUM_TICKS] = fileLines.shift().split(' ');

const ALL_RIDES = rideService.getAllRides(fileLines);
const ALL_VEHICLES = [];



for (let tickIdx = 0; tickIdx < NUM_TICKS; tickIdx++) {
    
    for (let vehicle of findAssignedVehicles()) {
        moveOrWaitVehicle(vehicle, tickIdx);
    }
    
    for (let finishedRide of findFinishedRides()) {
        findAssignedVehicles()
        .filter(v => v.rideId === finishedRide.id)
        .forEach(v => {
            v.completedRideIds.push(v.rideId);
            v.rideId = null;
        })
    }
    
    for (let vehicle of findFreeVehicles()) {
    
        let nextRide = findNextPossibleRide(NUM_TICKS - 1 - tickIdx, vehicle.row, vehicle.col);
        vehicle.rideId = nextRide.id;
        nextRide.vid = vehicle.id;
    }
}

function findFreeVehicles() {
    return ALL_VEHICLES.filter(v => v.rideId === null);
}

function findAssignedVehicles() {
    return ALL_VEHICLES.filter(v => v.rideId !== null);
}

function findFinishedRides() {
    return ALL_RIDES.filter(r => r.complete === true);
}

function findNextPossibleRide(remainingTicks, vehicleRow, vehicleCol) {
    // todo
}

function moveOrWaitVehicle(vehicle, tickIdx) {
    // todo
}

// forEachTick (1...10)

//   forEachFreeVehicles()

//      r = findNextPossibleRide(remainingTicks, v.x, v.y)

//      v.ride = r

//   forEachAssignedVehicle() -> move() // xy updaten oder an der stelle bleiben

//   forEachFinishedRide(r -> r.isCompleted())  // deassing vehicle

