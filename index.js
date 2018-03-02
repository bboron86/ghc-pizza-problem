const fileService = require('./src/services/fileService');
const rideService = require('./src/services/rideService');

const FILE_NAME_WITHOUT_EXTENSION = 'e_high_bonus';
const fileLines = fileService.getFileLines(`./input/${FILE_NAME_WITHOUT_EXTENSION}.in`);

// extract the first line
const [NUM_ROWS, NUM_COLS, NUM_VEHICLES, NUM_RIDES, BONUS, NUM_TICKS] = fileLines.shift().split(' ');

const ALL_RIDES = rideService.getAllRides(fileLines);

const ALL_VEHICLES = [];
for (let v = 0; v < parseInt(NUM_VEHICLES, 10); v++) {
    ALL_VEHICLES.push({
        id: v,
        row: 0,
        col: 0,
        rideId: null,
        completedRideIds: [],
        distanceToEnd: 0
    })
}



for (let tickIdx = 0; tickIdx < parseInt(NUM_TICKS, 10); tickIdx++) {
    console.log(tickIdx);
    
    for (let vehicle of findAssignedVehicles()) {
        moveOrWaitVehicle(vehicle, tickIdx);
    }
    
    for (let vehicle of findFreeVehicles()) {
        // console.log(`Next free vehicle: ${vehicle.id}`);
        let nextRide = findNextPossibleRide(tickIdx, parseInt(NUM_TICKS, 10), vehicle.row, vehicle.col);
        if (nextRide) {
            // console.log(`Found next possible Ride: ${nextRide.id} with total cost: ${nextRide.totalCost}`);
            vehicle.rideId = nextRide.id;
            vehicle.distanceToEnd = nextRide.totalCost;
            ALL_RIDES[nextRide.id].vid = vehicle.id;
        }
    }
}
fileService.writeOutputFile(ALL_VEHICLES, `./output/${FILE_NAME_WITHOUT_EXTENSION}.out`);
// console.log(ALL_VEHICLES.map(v => v.completedRideIds));

function findFreeVehicles() {
    return ALL_VEHICLES.filter(v => v.rideId === null);
}

function findAssignedVehicles() {
    return ALL_VEHICLES.filter(v => v.rideId !== null);
}

function findNextPossibleRide(currentTick, remainingTicks, vehicleRow, vehicleCol) {
    
    let rideId;
    let rideCost;
    for (let r of rideService.getUnassignedRides(ALL_RIDES)) {
        let startDistance = rideService.determineDistancePerRide(vehicleRow, vehicleCol, r.rowStart, r.columnStart);
        let startCost = r.startTime >= currentTick ? r.startTime - currentTick : 0;
        let bonus = startCost >= startDistance ? parseInt(BONUS, 10) : 0;
        let totalCost = r.distance + startDistance + startCost + bonus;
        
        if (rideId === undefined
            || (totalCost < rideCost && (totalCost - bonus) <= remainingTicks)) {
            rideId = r.id;
            rideCost = totalCost - bonus;
        }
    }
    
    if (rideCost) {
        return { id: rideId, totalCost: rideCost };
    }
}

function moveOrWaitVehicle(vehicle, currentTick) {
    if (vehicle.distanceToEnd > 0) {
        vehicle.distanceToEnd -= 1;
        if (vehicle.distanceToEnd === 0) {
            ALL_RIDES[vehicle.rideId].complete = true;
            vehicle.completedRideIds.push(vehicle.rideId);
            vehicle.row = ALL_RIDES[vehicle.rideId].rowFinish;
            vehicle.col = ALL_RIDES[vehicle.rideId].columnFinish;
            vehicle.rideId = null;
        }
    }
}