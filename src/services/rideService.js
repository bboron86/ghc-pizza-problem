

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
      rowStart: lineSplitted[0],
      columnStart: lineSplitted[1],
      rowFinish: lineSplitted[2],
      columnFinish: lineSplitted[3],
      startTime: lineSplitted[4],
      finishTime: lineSplitted[5],
      complete: false,
      vid: null,
      distance: determineDistancePerRide(lineSplitted[0], lineSplitted[1], lineSplitted[2], lineSplitted[3]),
    });
  });

  return rides;
};

const getUnassignedRides = (allRides) => allRides.filter(r => r.vid === null);

module.exports = {
  getAllRides, getUnassignedRides, determineDistancePerRide
};

