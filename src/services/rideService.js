

const determineDistancePerRide = (rowStart, columnStart, rowFinish, columnFinish) => {
  let rows = 0;
  if (rowStart > rowFinish) {
    rows = rowStart - rowFinish;
  } else {
    rows = rowFinish - rowStart;
  }

  let columns = 0;
  if (columnStart > columnFinish) {
    columns = columnStart - columnFinish;
  } else {
    columns = columnFinish - columnStart;
  }

  return rows + columns;
};

const getAllRides = (fileLines) => {
  const rides = [];

  fileLines.forEach((line, index) => {
    const lineSplitted = line.split(' ');

    rides.push({
      id: index,
      rowStart: parseInt(lineSplitted[0], 10),
      columnStart: parseInt(lineSplitted[1], 10),
      rowFinish: parseInt(lineSplitted[2], 10),
      columnFinish: parseInt(lineSplitted[3], 10),
      startTime: parseInt(lineSplitted[4], 10),
      finishTime: parseInt(lineSplitted[5], 10),
      complete: false,
      vid: null,
      distance: determineDistancePerRide(
          parseInt(lineSplitted[0], 10),
          parseInt(lineSplitted[1], 10),
          parseInt(lineSplitted[2], 10),
          parseInt(lineSplitted[3], 10)
      ),
    });
  });

  return rides;
};

const getUnassignedRides = (allRides) => allRides.filter(r => r.vid === null && r.complete === false);

module.exports = {
  getAllRides, getUnassignedRides, determineDistancePerRide
};

