import * as MatrixUtil from "../lib/MatrixUtil";

describe('MatrixUtil', () => {
  describe('generateZero', () => {
    it('works', () => {
      let matrix = MatrixUtil.generateZero(2, 3);
      let dimensions = MatrixUtil.getDimension(matrix);
      expect(dimensions).toEqual([2, 3]);
    });
  });
  describe('multiply', () => {
    it('works', () => {
      let a = [[1, 2, 3], [4, 5, 6]];
      let b = [[7, 8], [9, 10], [11, 12]];
      let expected = [[58, 64], [139, 154]];
      let actual = MatrixUtil.multiply(a, b);
      expect(actual).toEqual(expected);
    });
  });
  describe('transpose', () => {
    it('works', () => {
      let a = [[1, 2, 3], [4, 5, 6]];
      let expected = [[1, 4], [2, 5], [3, 6]];
      let actual = MatrixUtil.transpose(a);
      expect(actual).toEqual(expected);
    });
  });
  describe('elementAdd', () => {
    it('works', () => {
      let a = [[1, 2, 3], [4, 5, 6]];
      let b = [[3, 2, 0], [-1, -2, -3]];
      let expected = [[4, 4, 3], [3, 3, 3]];
      let actual = MatrixUtil.elementAdd(a, b);
      expect(actual).toEqual(expected);
    });
  });
  describe('elementSubtract', () => {
    it('works', () => {
      let a = [[1, 2, 3], [4, 5, 6]];
      let b = [[3, 2, 0], [-1, -2, -3]];
      let expected = [[-2, 0, 3], [5, 7, 9]];
      let actual = MatrixUtil.elementSubtract(a, b);
      expect(actual).toEqual(expected);
    });
  });
  describe('elementMultiply', () => {
    it('works', () => {
      let a = [[1, 2, 3], [4, 5, 6]];
      let b = [[0, 2, 1], [1, 0, 2]];
      let expected = [[0, 4, 3], [4, 0, 12]];
      let actual = MatrixUtil.elementMultiply(a, b);
      expect(actual).toEqual(expected);
    });
  });
  describe('scalar', () => {
    it('works', () => {
      let a = [[1, 2, 3], [4, 5, 6]];
      let expected = [[3, 6, 9], [12, 15, 18]];
      let actual = MatrixUtil.scalar(3, a);
      expect(actual).toEqual(expected);
    });
  });
});
