export type Matrix<T> = Array<Array<T>>;

export function getDimension<T>(
  m: Matrix<T>
): [number, number] {
  let rows = m.length;
  let cols = m[0].length;
  return [rows, cols];
}

export function generateZero(
  rows: number,
  cols: number
): Matrix<number> {
  return generate(
    rows,
    cols,
    (row, col) => 0
  );
}

export function generateRandom(
  rows: number,
  cols: number
): Matrix<number> {
  return generate(
    rows,
    cols,
    (row, col) => Math.random() * 2 - 1
  );
}

export function generate<T>(
  rows: number,
  cols: number,
  values: { (row: number, col: number): T }
): Matrix<T> {
  let m = new Array(rows);
  for(let row = 0; row < rows; row++) {
    m[row] = new Array(cols);
    for(let col = 0; col < cols; col++) {
      m[row][col] = values(row, col);
    }
  }
  return m;
}

export function multiply(
  m1: Matrix<number>,
  m2: Matrix<number>
): Matrix<number> {
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

export function transpose<T>(
  m: Matrix<T>
): Matrix<T> {
  let [mRows, mColumns] = getDimension(m);
  return generate(
    mColumns,
    mRows,
    (row, column) => m[column][row]
  );
}

export function mapTwoToOne<A, B, C>(
  m1: Matrix<A>,
  m2: Matrix<B>,
  operation: { (val1: A, val2: B): C }
): Matrix<C> {
  let [m1Rows, m1Cols] = getDimension(m1);
  let [m2Rows, m2Cols] = getDimension(m2);
  if(m1Rows != m2Rows || m1Cols != m2Cols) {
    throw 'Matrix size mismatch';
  }
  return generate(
    m1Rows,
    m1Cols,
    (row, col) => operation(m1[row][col], m2[row][col])
  );
}

export function mapOneToOne<A, B>(
  m: Matrix<A>,
  operation: { (val: A): B }
): Matrix<B> {
  let [rows, cols] = getDimension(m);
  return generate(
    rows,
    cols,
    (row, col) => operation(m[row][col])
  );
}

export function elementAdd(
  m1: Matrix<number>,
  m2: Matrix<number>
): Matrix<number> {
  return mapTwoToOne(
    m1,
    m2,
    (val1, val2) => val1 + val2
  );
}

export function elementSubtract(
  m1: Matrix<number>,
  m2: Matrix<number>
): Matrix<number> {
  return mapTwoToOne(
    m1,
    m2,
    (val1, val2) => val1 - val2
  );
}

export function elementMultiply(
  m1: Matrix<number>,
  m2: Matrix<number>
): Matrix<number> {
  return mapTwoToOne(
    m1,
    m2,
    (val1, val2) => val1 * val2
  );
}

export function scalar(
  x: number,
  m: Matrix<number>
): Matrix<number> {
  return mapOneToOne(
    m,
    (val) => x * val
  );
}

// (deltae)/(deltaw_1)=
// start with a hand generate random and zero matrix
