import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Util from "../lib/Util";
import * as MatrixUtil from "../lib/MatrixUtil";
import * as katex from "katex";

// remove this
type Matrix<T> = Array<Array<T>>;

function matrixToTable(m: Matrix<number>): JSX.Element {
	let rowComponents: JSX.Element[] = [];
  let [mRows, mCols] = MatrixUtil.getDimension(m);
  for(let row = 0; row < mRows; row++) {
    let colComponents: JSX.Element[] = [];
    for(let col = 0; col < mCols; col++) {
      let value = m[row][col].toString().substr(0, 8);
      colComponents.push(<td>{value}</td>);
    }
    rowComponents.push(<tr>{colComponents}</tr>);
  }
	return (<table className="matrix-table">{rowComponents}</table>);
}

interface IterationState {
  weights: Matrix<number>,
  hiddenSum: Matrix<number>,
  hiddenResult: Matrix<number>,
  error: Matrix<number>,
  gradients: Matrix<number>,
  delta: Matrix<number>,
  weightUpdates: Matrix<number>
}

interface NetworkState {
  learningRate: number,
  inputData: Matrix<number>,
  outputTarget: Matrix<number>,
  iterations: IterationState[]
}

function generateNetworkState(count: number, learningRate: number): NetworkState {
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

  let weights = MatrixUtil.generateRandom(3, 1);
  let iterations: IterationState[] = [];

  for(let i = 0; i <= count; i++) {
    let hiddenSum = MatrixUtil.multiply(inputData, weights);
    let hiddenResult = MatrixUtil.mapOneToOne(hiddenSum, Util.sigmoid);
    let error = MatrixUtil.elementSubtract(outputTarget, hiddenResult);
    let gradients = MatrixUtil.mapOneToOne(hiddenSum, Util.sigmoidDeriv);
    let delta = MatrixUtil.scalar(learningRate, MatrixUtil.elementMultiply(gradients, error));
    let weightUpdates = MatrixUtil.multiply(MatrixUtil.transpose(inputData), delta);

    iterations.push({
      weights: weights,
      hiddenSum: hiddenSum,
      hiddenResult: hiddenResult,
      error: error,
      gradients: gradients,
      delta: delta,
      weightUpdates: weightUpdates
    });

    weights = MatrixUtil.elementAdd(weightUpdates, weights);
  }

  return {
    learningRate: learningRate,
    inputData: inputData,
    outputTarget: outputTarget,
    iterations: iterations
  }
}

interface IterationSliderProps {
  min: number,
  max: number,
  onIterationChange: { (number): void }
}
interface IterationSliderState { value: number }
class IterationSlider extends React.Component<IterationSliderProps, IterationSliderState> {
  constructor(props) {
    super(props);
    this.state = {
      value: props.min
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    let value = event.target.value;
    this.setState({value: value});
    this.props.onIterationChange(value);
  }
  render() {
    return (
      <div className="iteration-slider">
        <div>Iteration (of {this.props.max}): {this.state.value}</div>
        <input type="range" onChange={this.handleChange} min={this.props.min} max={this.props.max} value={this.state.value} step="1"/>
      </div>
    );
  }
}

interface SingleLayerDisplayState {
  networkState: NetworkState,
  iteration: number,
  count: number,
  learningRate: number,
  tempLearningRate: number,
  tempCount: number
}
class SingleLayerDisplay extends React.Component<{}, SingleLayerDisplayState> {
  constructor(props) {
    super(props);
    let defaultCount = 10;
    let defaultLearningRate = 0.1;
    this.state = {
      networkState: generateNetworkState(defaultCount, defaultLearningRate),
      learningRate: defaultLearningRate,
      count: defaultCount,
      tempLearningRate: defaultLearningRate,
      tempCount: defaultCount,
      iteration: 0
    };
    this.handleIterationChange = this.handleIterationChange.bind(this);
    this.handleLearningRateChange = this.handleLearningRateChange.bind(this);
    this.handleIterationCountChange= this.handleIterationCountChange.bind(this);
    this.handleGenerate = this.handleGenerate.bind(this);
  }
  handleIterationChange(iteration) {
    this.setState({
      iteration: iteration
    });
  }
  handleLearningRateChange(event) {
    this.setState({
      tempLearningRate: event.target.value
    });
  }
  handleIterationCountChange(event) {
    this.setState({
      tempCount: event.target.value
    });
  }
  handleGenerate() {
    this.setState({
      count: this.state.tempCount,
      learningRate: this.state.tempLearningRate,
      networkState: generateNetworkState(this.state.tempCount, this.state.tempLearningRate)
    });
  }
  // TODO: show equations with values filled in.
  // TODO: show graphs.
  // graph errors and weights.
  render() {
    let currentIteration = this.state.networkState.iterations[this.state.iteration];
    let test = {__html: katex.renderToString("c = \\pm\\sqrt{a^2 + b^2}")};

    return (
      <div>
        <div className="input-section">
          <div className="input-field">
            Learning Rate: <input value={this.state.tempLearningRate} onInput={this.handleLearningRateChange} />
          </div>
          <div className="input-field">
            Iteration Count: <input value={this.state.tempCount} onInput={this.handleIterationCountChange} />
          </div>
          <button className="generate-button" onClick={this.handleGenerate}>
            Generate
          </button>
        </div>
        <div className="display-field">
          Learning Rate: {this.state.learningRate}
        </div>
        <div className="display-field">
          Iteration Count: {this.state.count}
        </div>
        <IterationSlider min={0} max={this.state.count} onIterationChange={this.handleIterationChange}/>
        <table className="display-table">
          <tr>
            <td>
              <div className="matrix-header">Forward</div>
            </td>
            <td>
              <div className="matrix-header">Inputs</div>
              {matrixToTable(this.state.networkState.inputData)}
            </td>
            <td>
              <div className="matrix-header">Weights</div>
              {matrixToTable(currentIteration.weights)}
            </td>
            <td>
              <div className="matrix-header">Hidden Sum</div>
              {matrixToTable(currentIteration.hiddenSum)}
            </td>
            <td>
              <div className="matrix-header">Output</div>
              {matrixToTable(currentIteration.hiddenResult)}
            </td>
            <td>
              <div className="matrix-header">Target Output</div>
              {matrixToTable(this.state.networkState.outputTarget)}
            </td>
          </tr>
        </table>
        <table className="display-table">
          <tr>
            <td>
              <div className="matrix-header">Back Prop</div>
            </td>
            <td>
              <div className="matrix-header">Error</div>
              {matrixToTable(currentIteration.error)}
            </td>
            <td>
              <div className="matrix-header">Gradients</div>
              {matrixToTable(currentIteration.gradients)}
            </td>
            <td>
              <div className="matrix-header">Delta</div>
              {matrixToTable(currentIteration.delta)}
            </td>
            <td>
              <div className="matrix-header">Weight Updates</div>
              {matrixToTable(currentIteration.weightUpdates)}
            </td>
          </tr>
        </table>
        <div dangerouslySetInnerHTML={test}/>
      </div>
    );
  }
}

ReactDOM.render(
  <SingleLayerDisplay/>,
  document.getElementById('root')
);
