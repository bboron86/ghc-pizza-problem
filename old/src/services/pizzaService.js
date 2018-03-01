/**
 *
 * @param {Array<String>} fileLines
 */
const determineIngredients = (fileLines) => {
  const ingredients = {};

  fileLines.forEach((fileLine) => {
    const ingredientsPerLine = fileLine.split('');
    ingredientsPerLine.forEach((ingredient) => {
      ingredients[ingredient] = ingredients[ingredient] === undefined ? 1 : ingredients[ingredient] += 1;
    });
  });

  return ingredients;
};

/**
 * Create an Object in each cell with the properties ingredient and assigend
 *
 * Example:
 *  {
 *    ingredient: String ["M" | "T"],
 *    assigend: Boolean [false],
 *  }
 *
 * @param {Array<String>} fileLines
 */
const createPizza = (fileLines) => {
  // create the pizza as a two-dimensional array
  const pizza = [[]];

  // fill the pizza with cells
  fileLines.forEach((fileLine, rowIndex) => {
    const ingredientsPerRow = fileLine.split('');
    pizza[rowIndex] = [];
    ingredientsPerRow.forEach((ingredient, columnIndex) => {
      pizza[rowIndex][columnIndex] = { ingredient, assigned: false };
    });
  });

  return pizza;
};

/**
 * get a x/y coordinate and try to determine the x/y where the slice ends
 *
 * @param {int} rowIndex
 * @param {int} columnIndex
 * @param {int} maxCellsPerSlice
 * @param {int} numRows;
 * @param {int} numColumns;
 */
const getPossibleEndCoordinates = (rowStartIndex, columnStartIndex, maxCellsPerSlice, numRows, numColumns) => {
  const possibleEndCoordinates = [];

  const rowEndIndex = Math.min(rowStartIndex + maxCellsPerSlice, numRows - 1);
  const columnEndIndex = Math.min(columnStartIndex + maxCellsPerSlice, numColumns - 1);

  for (let rowIndex = rowStartIndex; rowIndex <= rowEndIndex; rowIndex += 1) {
    for (let columnIndex = columnEndIndex; columnIndex >= columnStartIndex; columnIndex -= 1) {
      const countCellsForCombination = ((rowIndex - rowStartIndex) + 1) * ((columnIndex - columnStartIndex) + 1);

      if (countCellsForCombination > maxCellsPerSlice) { continue; }

      possibleEndCoordinates.push({ rowEndIndex: rowIndex, columnEndIndex: columnIndex });
    }
  }

  return possibleEndCoordinates;
};

/**
 * Check if for the given coordinates all cells are unassigned
 *
 * @param {int} rowStartIndex
 * @param {int} columnStartIndex
 * @param {Array<{rowEndIndex, columnEndIndex}>} coordinates
 * @returns {Array<{rowEndIndex, columnEndIndex}>} end coordinates where all cells are unassgined
 */
const filterCoordinatesWithAssignedCells = (rowStartIndex, columnStartIndex, coordinates, pizza) => coordinates.filter((coordinate) => {
  // temp variable to check if the coordinate can be used
  let allCellsUnassigned = true;

  for (let rowIndex = rowStartIndex; rowIndex <= coordinate.rowEndIndex; rowIndex += 1) {
    for (let columnIndex = columnStartIndex; columnIndex <= coordinate.columnEndIndex; columnIndex += 1) {
      if (pizza[rowIndex][columnIndex].assigned) {
        allCellsUnassigned = false;
      }
    }
  }

  return allCellsUnassigned;
});

/**
 *
 * @param {*} rowStartIndex
 * @param {*} columnStartIndex
 * @param {*} endCoordinates
 * @param {*} pizza
 */
const createSlices = (rowStartIndex, columnStartIndex, endCoordinates, pizza) => {
  const slices = [];

  endCoordinates.forEach((coordinate) => {
    const slice = {
      rowStartIndex,
      columnStartIndex,
      rowEndIndex: coordinate.rowEndIndex,
      columnEndIndex: coordinate.columnEndIndex,
      cellCount: 0,
      ingredients: {},
    };

    for (let rowIndex = rowStartIndex; rowIndex <= coordinate.rowEndIndex; rowIndex += 1) {
      for (let columnIndex = columnStartIndex; columnIndex <= coordinate.columnEndIndex; columnIndex += 1) {
        slice.cellCount += 1;

        // count ingredients for each slice
        if (slice.ingredients[pizza[rowIndex][columnIndex].ingredient] === undefined) {
          slice.ingredients[pizza[rowIndex][columnIndex].ingredient] = 1;
          continue;
        }
        slice.ingredients[pizza[rowIndex][columnIndex].ingredient] += 1;
      }
    }

    slices.push(slice);
  });

  return slices;
};


/**
 * Filter alle slices raus, die von einer Zutat weniger haben als mindestens gefordert ist
 * @param {*} slices
 */
const filterTooFewIngredients = (slices, ingredientKeys, minIngredientCount) => slices.filter((slice) => {
  let validSlice = true;

  ingredientKeys.forEach((key) => {
    if (!slice.ingredients[key] || slice.ingredients[key] < minIngredientCount) {
      validSlice = false;
    }
  });

  return validSlice;
});

/**
 * Sortiert die Liste an Zutaten basierend auf deren Häufigkeit in aufsteigender Reihenfolge.
 * Die Zutat mit kleinsten Häufigkeit ist im Index 0 zu finden.
 * @param {*} ingredients
 */
const determineLeastIngredient = (ingredients) => {
  const ingredientsSorted = Object.keys(ingredients).sort((a, b) => ingredients[a] - ingredients[b]);
  return ingredientsSorted[0];
};

/**
 * Sorts the slices in ascending order based on the ingredient
 *
 * @param {Array<Object>} slices
 * @param {Char} ingredient M | T
 */
const sortSlicesByIngredient = (slices, ingredient) => slices.sort((a, b) => ((a.ingredients[ingredient] > b.ingredients[ingredient]) ? 1 : ((b.ingredients[ingredient] > a.ingredients[ingredient]) ? -1 : 0)));

/**
 * Returns the best slice of each options
 *
 * @param {Array<Object>} slices
 * @param {int} numMaxCells
 */
const getFinalSlice = (slices, rareIngredientKey, maxCellsPerSlice) => {
  let result = false;

  // Vorschlag: Stück bei dem die am geringsten vorgenomme Zutat minimal ist und der Rest Maximal
  // sort possibleSlices according to the number of least ingredients
  const sortedSlices = sortSlicesByIngredient(slices, rareIngredientKey);

  for (let i = 1; i <= maxCellsPerSlice; i += 1) {
    let tmpSlices = sortedSlices.filter(slice => slice.ingredients[rareIngredientKey] === i);

    if (tmpSlices.length < 1) {
      continue;
    }

    tmpSlices = tmpSlices.sort((a, b) => ((a.cellCount > b.cellCount) ? 1 : ((b.cellCount > a.cellCount) ? -1 : 0)));
    result = tmpSlices.pop();
    break;
  }
  return result;

  // Vorschlag: da die Stücke aufsteigend nach der am wenigsten vorhanden Zutat sortiert sind wird jetzt von der maximalen Anzahl an Zellen runtergezählt

  // while (numMaxCells > 0) {
  //   const slicesWithSpecificCells = slices.filter(slice => slice.cellCount === parseInt(numMaxCells, 10));
  //   if (slicesWithSpecificCells.length > 0) {
  //     result = slicesWithSpecificCells.shift();
  //     break;
  //   }
  //   numMaxCells -= 1;
  // }

  // Vorschlag: Die Häufigkeit aller Zutaten wird bestimmt und die kleinste Zutat darf maximal einen prozentualen Wert der restlichen Zutaten bekommen

  // TODO
};

/**
 * Makiert alle Zellen in der Pizza, die bereits verwendet wurden
 *
 * @param {Object} slice
 * @param {Array<Array>} pizza
 */
const markCells = (slice, pizza) => {
  for (let rowIndex = slice.rowStartIndex; rowIndex <= slice.rowEndIndex; rowIndex += 1) {
    for (let columnIndex = slice.columnStartIndex; columnIndex <= slice.columnEndIndex; columnIndex += 1) {
      pizza[rowIndex][columnIndex].assigned = true;
    }
  }
  return pizza;
};


module.exports = {
  determineIngredients,
  createPizza,
  getPossibleEndCoordinates,
  filterCoordinatesWithAssignedCells,
  createSlices,
  filterTooFewIngredients,
  determineLeastIngredient,
  sortSlicesByIngredient,
  getFinalSlice,
  markCells,
};
