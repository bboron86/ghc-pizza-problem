const fileService = require('./src/services/fileService');
const rideService = require('./src/services/rideService');

const FILE_NAME_WITHOUT_EXTENSION = 'a_example';
const fileLines = fileService.getFileLines(`./input/${FILE_NAME_WITHOUT_EXTENSION}.in`);

// extract the first line
const [NUM_ROWS, NUM_COLS, NUM_VEHICLES, NUM_RIDES, BONUS, NUM_TICKS] = fileLines.shift().split(' ');

const ALL_RIDES = rideService.getAllRides(fileLines);

const ALL_VEHICLES = [];
for (let v = 0; v < NUM_VEHICLES; v++) {
    ALL_VEHICLES.push({
        id: v,
        row: 0,
        col: 0,
        rideId: null,
        completedRideIds: [],
        distanceToEnd: 0
    })
}



for (let tickIdx = 0; tickIdx < NUM_TICKS; tickIdx++) {
    console.log(tickIdx);
    
    for (let vehicle of findAssignedVehicles()) {
        moveOrWaitVehicle(vehicle, tickIdx);
    }
    
    for (let finishedRide of findFinishedRides()) {
        findAssignedVehicles()
        .filter(v => v.rideId === finishedRide.id)
        .forEach(v => {
            v.completedRideIds.push(v.rideId);
            v.row = ALL_RIDES[v.rideId].rowFinish;
            v.col = ALL_RIDES[v.rideId].columnFinish;
            v.rideId = null;
        })
    }
    
    for (let vehicle of findFreeVehicles()) {
        console.log(`Next free vehicle: ${vehicle.id}`);
        let nextRide = findNextPossibleRide(tickIdx, NUM_TICKS, vehicle.row, vehicle.col);
        if (nextRide) {
            console.log(`Found next possible Ride: ${nextRide.id} with total cost: ${nextRide.totalCost}`);
            vehicle.rideId = nextRide.id;
            vehicle.distanceToEnd = nextRide.totalCost;
            ALL_RIDES[nextRide.id].vid = vehicle.id;
        }
    }
}

console.log(ALL_VEHICLES);

function findFreeVehicles() {
    return ALL_VEHICLES.filter(v => v.rideId === null);
}

function findAssignedVehicles() {
    return ALL_VEHICLES.filter(v => v.rideId !== null);
}

function findFinishedRides() {
    return ALL_RIDES.filter(r => r.complete === true);
}

function findNextPossibleRide(currentTick, remainingTicks, vehicleRow, vehicleCol) {
    
    let cheapestRideId;
    let cheapestRideCost;
    for (let r of rideService.getUnassignedRides(ALL_RIDES)) {
        let startDistance = rideService.determineDistancePerRide(vehicleRow, vehicleCol, r.rowStart, r.columnStart);
        let startCost = r.startTime >= currentTick ? r.startTime - currentTick : 0;
        let totalCost = r.distance + startDistance + startCost;
        
        if (cheapestRideId === undefined) {
            cheapestRideId = r.id;
            cheapestRideCost = totalCost;
            
        } else if (totalCost < cheapestRideCost) {
            
            cheapestRideId = r.id;
            cheapestRideCost = totalCost;
        }
    }
    
    if (cheapestRideCost && cheapestRideCost <= remainingTicks) {
        return { id: cheapestRideId, totalCost: cheapestRideCost };
    }
}

function moveOrWaitVehicle(vehicle, currentTick) {
    let vRide = ALL_RIDES[vehicle.rideId];
    if (vehicle.distanceToEnd > 0) {
        vehicle.distanceToEnd -= 1;
        if (vehicle.distanceToEnd === 0) vRide.complete = true;
    }
}