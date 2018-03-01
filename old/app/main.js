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
    
    findCoordinates(0, 0);
    
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

function findAllPossibleSlices(r, c) {
    
    let slices = findCoordinates(r, c); // TODO
    
    coordinates.forEach(elem => {
        for (let _r = r; _r < elem.r; _r++) {
            for (let _c = c; i < elem.c; _c++) {
                if (PIZZA[_r][_c].type === 'T') {
                    elem.t = elem.t === undefined ? 1 : elem.t + 1
                } else {
                    elem.m = elem.m === undefined ? 1 : elem.m + 1
                }
            }
        }
    })
    
}


function findCoordinates(row, col) {
    
    let coordinates = [];
    _r = row;
    maxC = col + MAX_CELLS;
    
    while (maxC >= _r) {
        coordinates.push({ r: _r, c: Math.min(maxC, NUM_COLS) });
        _r++;
        maxC = parseInt(maxC / 2, 10);
    }
    
    console.log(coordinates);
    return coordinates;
}
