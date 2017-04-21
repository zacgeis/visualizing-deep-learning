
function getDimension(matrix) {
  var rows = matrix.length;
  var columns = matrix[0].length;
  return [rows, columns];
}

function generateZero(rows, columns) {
  var matrix = new Array(rows);
  for(var row = 0; row < rows; row++) {
    matrix[row] = new Array(columns);
    for(var column = 0; column < columns; column++) {
      matrix[row][column] = 0;
    }
  }
  return matrix;
}

function generateRandom(rows, columns) {
  var matrix = new Array(rows);
  for(var row = 0; row < rows; row++) {
    matrix[row] = new Array(columns);
    for(var column = 0; column < columns; column++) {
      matrix[row][column] = Math.random() * 2 - 1;
    }
  }
  return matrix;
}

function multiply(mat1, mat2) {
  [mat1Rows, mat1Columns] = getDimension(mat1);
  [mat2Rows, mat2Columns] = getDimension(mat2);
  if(mat1Columns != mat2Rows) {
    throw 'Matrix size mismatch';
  }
  return [[]];
}

var MatrixUtil = {
  multiply: multiply,
  generateZero: generateZero,
  generateRandom: generateRandom,
  getDimension: getDimension,
};

module.exports = MatrixUtil;
