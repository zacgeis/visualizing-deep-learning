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
  console.log('=== Iteration ' + i + ' ===');
  MatrixUtil.display('Weights:', weights);

  let hiddenSum = MatrixUtil.multiply(inputData, weights);
  let hiddenResult = MatrixUtil.mapOneToOne(hiddenSum, Util.sigmoid);
  MatrixUtil.display('Output: ', hiddenResult);

  let error = MatrixUtil.elementSubtract(outputTarget, hiddenResult);
  MatrixUtil.display('Error:', error);

  let gradients = MatrixUtil.mapOneToOne(hiddenSum, Util.sigmoidDeriv);
  MatrixUtil.display('Gradients:', gradients);

  let delta = MatrixUtil.scalar(learningRate, MatrixUtil.elementMultiply(gradients, error));
  MatrixUtil.display('Delta:', delta);

  let weightUpdates = MatrixUtil.multiply(MatrixUtil.transpose(inputData), delta);
  MatrixUtil.display('Weight Updates:', weightUpdates);

  weights = MatrixUtil.elementAdd(weightUpdates, weights);
}
