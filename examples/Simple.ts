 // print('error', matrix_sum_squared_error(hidden_result, output_target))
 // print('error', error)
 // print('result', hidden_result)
 // print('grad', gradients)
 // print('delta', delta)
 // print('weights', weights)
 // print()

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
  [0],
  [1],
  [1],
];

let learningRate = 0.1;
let weights = MatrixUtil.generateRandom(3, 1);

for(let i = 0; i < 2000; i++) {
  let hiddenSum = MatrixUtil.multiply(inputData, weights);
  let hiddenResult = MatrixUtil.mapOneToOne(hiddenSum, Util.sigmoid);
  let error = MatrixUtil.elementSubtract(outputTarget, hiddenResult);
  let gradients = MatrixUtil.mapOneToOne(hiddenSum, Util.sigmoidDeriv);
  let delta = MatrixUtil.scalar(learningRate, MatrixUtil.elementMultiply(gradients, error));
  let weightUpdates = MatrixUtil.multiply(MatrixUtil.transpose(inputData), delta);
  weights = MatrixUtil.elementAdd(weightUpdates, weights);
  console.log(hiddenResult);
}
