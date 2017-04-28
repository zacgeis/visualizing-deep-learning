import * as Util from "../lib/Util";
import * as MatrixUtil from "../lib/MatrixUtil";

let inputData = [
    [0,0,1],
    [0,1,1],
    [1,0,1],
    [1,1,1],
];

let outputTarget = [
  [0],
  [1],
  [1],
  [0],
];

// without an additional layer, the resulsts just settle at 0.5 across.

let learningRate = 0.1;
let weights1 = MatrixUtil.generateRandom(3, 4);
let weights2 = MatrixUtil.generateRandom(4, 1);

for(let i = 0; i < 10000; i++) {
  let hiddenSum1 = MatrixUtil.multiply(inputData, weights1);
  let hiddenResult1 = MatrixUtil.mapOneToOne(hiddenSum1, Util.sigmoid);

  let hiddenSum2 = MatrixUtil.multiply(hiddenResult1, weights2);
  let hiddenResult2 = MatrixUtil.mapOneToOne(hiddenSum2, Util.sigmoid);

  console.log(hiddenResult2); //output

  let error2 = MatrixUtil.elementSubtract(outputTarget, hiddenResult2);
  let gradients2 = MatrixUtil.mapOneToOne(hiddenSum2, Util.sigmoidDeriv);
  let delta2 = MatrixUtil.elementMultiply(gradients2, error2);

  let error1 = MatrixUtil.multiply(delta2, MatrixUtil.transpose(weights2));
  let gradients1 = MatrixUtil.mapOneToOne(hiddenSum1, Util.sigmoidDeriv);
  let delta1 = MatrixUtil.elementMultiply(gradients1, error1);

  let weight1Updates = MatrixUtil.scalar(learningRate, MatrixUtil.multiply(MatrixUtil.transpose(inputData), delta1));
  let weight2Updates = MatrixUtil.scalar(learningRate, MatrixUtil.multiply(MatrixUtil.transpose(hiddenResult1), delta2));
  weights1 = MatrixUtil.elementAdd(weight1Updates, weights1);
  weights2 = MatrixUtil.elementAdd(weight2Updates, weights2);
}
