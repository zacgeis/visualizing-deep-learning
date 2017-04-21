describe('MatrixUtil', () => {
  var Matrix = require('../lib/MatrixUtil');

  describe('generateZero', () => {
    it('returns the correct dimensions', () => {
      var matrix = Matrix.generateZero(2, 3);
      var dimensions = Matrix.getDimension(matrix);
      expect(dimensions).toEqual([2, 3]);
    });
  });
});
