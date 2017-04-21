export type Matrix<T> = Array<Array<T>>;

export function generateZero(rows: number, cols: number): Matrix<number> {
  return generate(rows, cols, () => 0);
}

export function generateRandom(rows: number, cols: number): Matrix<number> {
  return generate(rows, cols, () => Math.random() * 2 - 1);
}

export function generate(rows: number, cols: number, values: { (): number }): Matrix<number> {
  let m = new Array(rows);
  for(let row = 0; row < rows; row++) {
    m[row] = new Array(cols);
    for(let col = 0; col < cols; col++) {
      m[row][col] = values();
    }
  }
  return m;
}

export function getDimension(m: Matrix<number>): [number, number] {
  let rows = m.length;
  let cols = m[0].length;
  return [rows, cols];
}

export function multiply(m1: Matrix<number>, m2: Matrix<number>): Matrix<number> {
  let [m1Rows, m1Cols] = getDimension(m1);
  let [m2Rows, m2Cols] = getDimension(m2);
  if(m1Cols != m2Rows) {
    throw 'Matrix multiply size mismatch';
  }
  let result = generateZero(m1Rows, m2Cols);
  for(let m1Row = 0; m1Row < m1Rows; m1Row++) {
    for(let m2Col = 0; m2Col < m2Cols; m2Col++) {
      let sum = 0;
      for(let m1Col = 0; m1Col < m1Cols; m1Col++) {
        sum += m1[m1Row][m1Col] * m2[m1Col][m2Col];
      }
      result[m1Row][m2Col] = sum;
    }
  }
  return result;
}

// (deltae)/(deltaw_1)=
// start with a hand generate random and zero matrix
