const _file = 'medium';

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
        NUM_ROWS = parseInt(arr[0]);
        NUM_COLS = parseInt(arr[1]);
        MIN_INGREDIENTS = parseInt(arr[2]);
        MAX_CELLS = parseInt(arr[3]);
        
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
    
    let cell = { x: 0, y: 0 };
    let cellArray = [];
    let slice = {};
    
    for (let r = 0; r < NUM_ROWS; r++) {
        for (let c = 0; c < NUM_COLS; c++) {
            // console.log(PIZZA[r][c]);
            if (PIZZA[r][c].sliced) continue;
    
            // console.log(`Looking for new slice starting at (${r},${c})`);
            let bestSlice = chooseBestSlice(r, c);
            for (let _r = r; _r <= bestSlice.r; _r++) {
                for (let _c = c; _c <= bestSlice.c; _c++) {
                    PIZZA[_r][_c].sliced = true;
                }
            }
            if (bestSlice.TOM && bestSlice.MUS) {
                if (!(r === bestSlice.r && c === bestSlice.c)) {
                    console.log(`${r} ${c} ${bestSlice.r} ${bestSlice.c}`);
                }
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
                
                if (PIZZA[_r][_c].sliced) elem.SLI = true;
                
                // how many tomatoes / mushrooms does the slice contain
                if (PIZZA[_r][_c].type === 'T') {
                    elem.TOM = elem.TOM === undefined ? 1 : elem.TOM + 1
                } else {
                    elem.MUS = elem.MUS === undefined ? 1 : elem.MUS + 1
                }
            }
        }
        // how many cells does the slice cover
        elem.CNT = (elem.MUS || 0) + (elem.TOM || 0);
    });
    
    slices.sort(function(s1, s2) {
        if (s1.MUS < MIN_INGREDIENTS && s2.MUS >= MIN_INGREDIENTS) return 1;
        if (s2.MUS < MIN_INGREDIENTS && s1.MUS >= MIN_INGREDIENTS) return -1;
    
        if (s1.TOM < MIN_INGREDIENTS && s2.TOM >= MIN_INGREDIENTS) return 1;
        if (s2.TOM < MIN_INGREDIENTS && s1.TOM >= MIN_INGREDIENTS) return -1;
        
        if (s1.MUS < 1 && s2.MUS >= 1) return 1;
        if (s2.MUS < 1 && s1.MUS >= 1) return -1;
    
        if (s1.TOM < 1 && s2.TOM >= 1) return 1;
        if (s2.TOM < 1 && s1.TOM >= 1) return -1;
        
        if (s1.CNT > MAX_CELLS && s2.CNT <= MAX_CELLS) return 1;
        if (s2.CNT > MAX_CELLS && s1.CNT <= MAX_CELLS) return -1;
        
        if (s1.MUS === undefined && s2.MUS !== undefined ) return 1;
        if (s2.MUS === undefined && s1.MUS !== undefined ) return -1;
        
        if (s1.SLI !== undefined && s2.SLI === undefined) return 1;
        if (s2.SLI !== undefined && s1.SLI === undefined) return -1;
        
        if (s1.CNT <= 1 && s2.CNT > 1) return 1;
        if (s2.CNT <= 1 && s1.CNT > 1) return -1;
        
        if (s1.MUS < s2.MUS) {
            return -1;
        } else if (s2.MUS < s1.MUS) {
            return 1;
        } else { // same number of mushrooms
            if (s1.CNT > s2.CNT) return -1;
            else if (s2.CNT > s1.CNT) return 1;
            
            return 0;   // doesn't matter
        }
    });
    
    let bestSlice = slices[0];
    // console.log(`${JSON.stringify(slices)}`);
    // console.log(`Using: ${JSON.stringify(bestSlice)}`);
    
    return bestSlice;
}


function findPossibleSliceEndCoordinates(row, col) {
    
    let coordinates = [];
    
    _r = row;
    let _c = MAX_CELLS - 1;
    while (_c >= 0 && _r < NUM_ROWS && (_r - row) < MAX_CELLS) {
        coordinates.push({ r: _r, c: Math.min(NUM_COLS - 1, col + _c) });
        _r++;
        _c = parseInt(_c / 2, 10);
    }
    coordinates.push({ r: Math.min(_r, NUM_ROWS - 1), c: col });
    
    // console.log(`Found coordinates for (${row},${col}): ${JSON.stringify(coordinates.map(coord => `${coord.r},${coord.c}`))}`);
    return coordinates;
}
