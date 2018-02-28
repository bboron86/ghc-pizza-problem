
const pizzaService = require('./src/services/pizzaService');
const fileService = require('./src/services/fileService');

const FILE_NAME_WITHOUT_EXTENSION = 'example';
const fileLines = fileService.getFileLines(`./input/${FILE_NAME_WITHOUT_EXTENSION}.in`);

// extract the first line
const [NUM_ROWS, NUM_COLUMNS, MIN_INGREDIENT, MAX_CELLS_PER_SLICE] = fileLines.shift().split(' ');
const INGREDIENTS = pizzaService.determineIngredients(fileLines);

// determine the ingredient that least occurs, the variable holds in our example only M or T
const LEAST_INGREDIENT_KEY = pizzaService.determineLeastIngredient(INGREDIENTS);

const pizza = pizzaService.createPizza(fileLines);
const finalSlices = [];

// first of all we iterate over each cell and collect the possible slices which can be created
// after the search, the decision is made which slice will be kept

pizza.forEach((row, rowIndex, pizzaArray) => {
  row.forEach((cell, columnIndex) => {
    // check if the current cell is already assigned
    if (pizzaArray[rowIndex][columnIndex].assigned) { return; }

    // get possible end coordinates
    let endCoordinates = pizzaService.getPossibleEndCoordinates(rowIndex, columnIndex, MAX_CELLS_PER_SLICE, NUM_ROWS, NUM_COLUMNS);
    if (endCoordinates.length < 1) { return; }

    // filter slices with cells which are already assigned to others
    endCoordinates = pizzaService.filterCoordinatesWithAssignedCells(rowIndex, columnIndex, endCoordinates, pizzaArray);
    if (endCoordinates.length < 1) { return; }

    // create slices
    let possibleSlices = pizzaService.createSlices(rowIndex, columnIndex, endCoordinates, pizzaArray);
    if (possibleSlices.length < 1) { return; }

    // filter slices that do not have the minimum number of ingredients
    possibleSlices = pizzaService.filterTooFewIngredients(possibleSlices, Object.keys(INGREDIENTS), MIN_INGREDIENT);
    if (possibleSlices.length < 1) { return; }

    // choose the best slice
    const slice = pizzaService.getFinalSlice(possibleSlices, LEAST_INGREDIENT_KEY, MAX_CELLS_PER_SLICE);
    if (!slice) { return; }

    // nachdem das Pizza Stück identifiziert wurde, werden dessen Zellen in der Pizza makiert
    pizzaArray = pizzaService.markCells(slice, pizzaArray);

    finalSlices.push(slice);
  });
});

fileService.writeOutputFile(finalSlices, `./output/${FILE_NAME_WITHOUT_EXTENSION}.out`);
