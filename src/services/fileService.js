const fs = require('fs');
const path = require('path');

/**
 *
 * @param {String} filePath
 * @returns {Array<String>} file lines as an array of strings
 */
const getFileLines = (filePath) => {
  // read file into buffer
  const fileBuffer = fs.readFileSync(filePath, 'utf-8');

  // convert the buffer into normal string
  const fileString = fileBuffer.toString('ascii', 0, fileBuffer.length);

  // create an array of lines
  const fileLines = fileString.split('\n');

  // iterate over all lines an remove empty lines
  // overengineered! the reason was, that the array "fileLines" contains in the last row an empty string, maybe from the EOF
  let i = fileLines.length;
  while (i--) {
    if (fileLines[i].length < 1) {
      fileLines.splice(i, 1);
    }
  }

  return fileLines;
};

/**
 *
 * @param {Array<Object>} finalSlices
 * @param {String} filePath
 */
const writeOutputFile = (finalSlices, filePath) => {
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath));
  }
  const stream = fs.createWriteStream(filePath);

  stream.once('open', (fd) => {
    stream.write(`${finalSlices.length}\n`);
    finalSlices.forEach(slice => stream.write(`${slice.rowStartIndex} ${slice.columnStartIndex} ${slice.rowEndIndex} ${slice.columnEndIndex}\n`));
    stream.end();
  });
};

module.exports = {
  getFileLines,
  writeOutputFile,
};
