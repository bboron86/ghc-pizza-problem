const _file = 'small';

let NUM_ROWS;
let NUM_COLS;
let MIN_INGREDIENTS;
let MAX_CELLS;

let NUM_TOMATOS = 0;
let NUM_MUSHRO0MS = 0;

let PIZZA = [[]];

const READ_LINE = require('linebyline'), rl = READ_LINE(`./app/resources/${_file}.in`);

rl.on('line', function(line, lineCount, byteCount) {
    
    if (lineCount === 1) {
        let arr = line.split(" ");
        NUM_ROWS = arr[0];
        NUM_COLS = arr[1];
        MIN_INGREDIENTS = arr[2];
        MAX_CELLS = arr[3];
        
        for (let i = 0; i < NUM_ROWS; i++) PIZZA[i] = []
        
    } else {
        
        line.split("").forEach((entry, _idx) => {
            PIZZA[lineCount - 2][_idx] = { type: entry, sliced: false };
            
            if (entry === 'T') {
                NUM_TOMATOS++
            }
            else {
                NUM_MUSHRO0MS++
            }
        });
    }
    
})
.on('close', () => {
    console.log("CLOSE");
    //console.log(PIZZA)
    
    console.log("TOMATOS: " + NUM_TOMATOS);
    console.log("MUSHROOMS: " + NUM_MUSHRO0MS);
    
    chooseBestSlice(0, 0);
    
    return;
    
    let cell = { x: 0, y: 0 };
    let cellArray = [];
    let slice = {};
    
    for (let r = 0; r < NUM_ROWS; r++) {
        for (let c = 0; c < NUM_COLS; c++) {
            
            if (PIZZA[r][c].sliced) continue;
            
            if (cellArray.length === 0) {
                slice.x = r;
                slice.y = c;
                cellArray.push({ x: r, y: c })
                
            } else if (cellArray.length < MAX_CELLS) {
            
            }
            
        }
    }
    
})
.on('error', function(e) {
    // something went wrong
    console.error(e)
});

function chooseBestSlice(row, col) {
    
    let slices = findPossibleSliceEndCoordinates(row, col);
    
    slices.forEach(elem => {
        for (let _r = row; _r <= elem.r; _r++) {
            for (let _c = col; _c <= elem.c; _c++) {
                
                // how many cells does the slice cover
                elem.CNT = ((_r - row) + 1) * (_c - col);
                
                // how many tomatoes / mushrooms does the slice contain
                if (PIZZA[_r][_c].type === 'T') {
                    elem.TOM = elem.TOM === undefined ? 1 : elem.TOM + 1
                } else {
                    elem.MUS = elem.MUS === undefined ? 1 : elem.MUS + 1
                }
            }
        }
    });
    
    console.log(`${JSON.stringify(slices)}`);
}


function findPossibleSliceEndCoordinates(row, col) {
    
    let coordinates = [];
    
    _r = row;
    maxC = col + MAX_CELLS;
    while (maxC >= _r) {
        coordinates.push({ r: _r, c: Math.min(maxC, NUM_COLS) });
        _r++;
        maxC = parseInt(maxC / 2, 10);
    }
    
    console.log(`Found coordinates for (${row},${col}): ${JSON.stringify(coordinates.map(coord => `${coord.r},${coord.c}`))}`);
    return coordinates;
}
