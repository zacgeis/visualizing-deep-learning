import * as React from "react";
import * as ReactDOM from "react-dom";
import * as MatrixUtil from "../lib/MatrixUtil";
import * as katex from "katex";
import * as Plotly from "plotly.js";

type Matrix<T> = Array<Array<T>>;

function weightToStyle(weight: number) {
  let alpha = (Math.min(100, Math.abs(weight * 25)) / 100).toString().substr(0, 4);
  if(weight < 0) {
    return {
      'background-color': 'rgba(0, 255, 255, ' + alpha + ')'
    }
  }
  return {
    'background-color': 'rgba(255, 150, 0, ' + alpha + ')'
  }
}

function matrixToTable(m: Matrix<number>, colorize: boolean): JSX.Element {
	let rowComponents: JSX.Element[] = [];
  let [mRows, mCols] = MatrixUtil.getDimension(m);
  for(let row = 0; row < mRows; row++) {
    let colComponents: JSX.Element[] = [];
    for(let col = 0; col < mCols; col++) {
      let value = m[row][col].toString().substr(0, 8);
      let style = {};
      if(colorize) {
        style = weightToStyle(m[row][col]);
      }
      colComponents.push(<td style={style}>{value}</td>);
    }
    rowComponents.push(<tr>{colComponents}</tr>);
  }
	return (<table className="matrix-table">{rowComponents}</table>);
}

interface IterationState {
  weights: Matrix<number>;
  hiddenSum: Matrix<number>;
  hiddenResult: Matrix<number>;
  error: Matrix<number>;
  gradients: Matrix<number>;
  delta: Matrix<number>;
  weightUpdates: Matrix<number>;
}

class PlotData {
  index: number;
  iteration: number[];
  traces: {};

  constructor() {
    this.index = 0;
    this.iteration = [];
    this.traces = {};
  }
  addPoints(points: {}) {
    this.iteration.push(this.index++);
    for(let name in points) {
      if(!this.traces.hasOwnProperty(name)) {
        this.traces[name] = [];
      }
      this.traces[name].push(points[name]);
    }
  }
  getSingleTrace(name, values) {
		return {
			x: this.iteration,
			y: values,
			mode: 'lines',
			name: name,
			line: {
				width: 1
			}
		};
  }
  getPlotlyFormattedData() {
    let data: any = [];
    for(let name in this.traces) {
      data.push(this.getSingleTrace(name, this.traces[name]));
    }
    return data;
  }
  render(div: string, title: string) {
    Plotly.purge(div);
		let layout = {
			width: 480,
			height: 400,
      title: title,
      xaxis: {
        title: 'Iterations'
      }
		};

		let data = this.getPlotlyFormattedData();
		Plotly.newPlot(div, data, layout);
  }
}

interface NetworkState {
  learningRate: number;
  inputData: Matrix<number>;
  outputTarget: Matrix<number>;
  iterations: IterationState[][];
  plotData: PlotData;
  finalError: number;
}


function generateNetworkState(count: number, learningRate: number, hiddenLayerSize: number): NetworkState {
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

  let iterations: IterationState[][] = [];
  let plotData = new PlotData();
  let sumSquaredError = 0;

  let weights1 = MatrixUtil.generateRandom(3, hiddenLayerSize);
  let weights2 = MatrixUtil.generateRandom(hiddenLayerSize, 1);

  for(let i = 0; i <= count; i++) {
    let hiddenSum1 = MatrixUtil.multiply(inputData, weights1);
    let hiddenResult1 = MatrixUtil.mapOneToOne(hiddenSum1, MatrixUtil.sigmoid);

    let hiddenSum2 = MatrixUtil.multiply(hiddenResult1, weights2);
    let hiddenResult2 = MatrixUtil.mapOneToOne(hiddenSum2, MatrixUtil.sigmoid);

    let error2 = MatrixUtil.elementSubtract(outputTarget, hiddenResult2);
    let gradients2 = MatrixUtil.mapOneToOne(hiddenSum2, MatrixUtil.sigmoidDeriv);
    let delta2 = MatrixUtil.elementMultiply(gradients2, error2);

    let error1 = MatrixUtil.multiply(delta2, MatrixUtil.transpose(weights2));
    let gradients1 = MatrixUtil.mapOneToOne(hiddenSum1, MatrixUtil.sigmoidDeriv);
    let delta1 = MatrixUtil.elementMultiply(gradients1, error1);

    let weightUpdates1 = MatrixUtil.scalar(learningRate, MatrixUtil.multiply(MatrixUtil.transpose(inputData), delta1));
    let weightUpdates2 = MatrixUtil.scalar(learningRate, MatrixUtil.multiply(MatrixUtil.transpose(hiddenResult1), delta2));

    iterations.push([
      {
        weights: weights1,
        hiddenSum: hiddenSum1,
        hiddenResult: hiddenResult1,
        error: error1,
        gradients: gradients1,
        delta: delta1,
        weightUpdates: weightUpdates1
      },
      {
        weights: weights2,
        hiddenSum: hiddenSum2,
        hiddenResult: hiddenResult2,
        error: error2,
        gradients: gradients2,
        delta: delta2,
        weightUpdates: weightUpdates2
      }
    ]);

    weights1 = MatrixUtil.elementAdd(weightUpdates1, weights1);
    weights2 = MatrixUtil.elementAdd(weightUpdates2, weights2);

    sumSquaredError = MatrixUtil.sumSquaredError(hiddenResult2, outputTarget);
    plotData.addPoints({
      error: sumSquaredError,
    });
  }

  return {
    learningRate: learningRate,
    inputData: inputData,
    outputTarget: outputTarget,
    iterations: iterations,
    plotData: plotData,
    finalError: sumSquaredError
  }
}

interface IterationSliderProps {
  min: number;
  max: number;
  value: number;
  onIterationChange: { (number): void };
}
interface IterationSliderState { value: number; }
class IterationSlider extends React.Component<IterationSliderProps, IterationSliderState> {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    let value = event.target.value;
    this.props.onIterationChange(value);
  }
  render() {
    return (
      <div className="iteration-slider">
        <div>Iteration (of {this.props.max}): {this.props.value}</div>
        <input type="range" onChange={this.handleChange} min={this.props.min} max={this.props.max} value={this.props.value} step="1"/>
      </div>
    );
  }
}

function renderCanvasGraphLayer(ctx, styledWeights1, styledWeights2) {
	let height = 400;
	let verticalSep = 30;
	let horizontalSep = 60;
	let nodeRadius = 10;
	let x = 30 + nodeRadius;

	let layer1Count = styledWeights1.length;
	let layer2Count = styledWeights1[0].length;
	let layer3Count = styledWeights2[0].length;

	let layer1Locs: number[][] = [];
	let layer2Locs: number[][] = [];
	let layer3Locs: number[][] = [];

	let totalNodeHeight = nodeRadius * 2 + verticalSep;
	let totalNodeWidth = nodeRadius * 2 + horizontalSep;

	let layer1StartY = (height / 2) - ((totalNodeHeight * layer1Count) / 2);
	let layer2StartY = (height / 2) - ((totalNodeHeight * layer2Count) / 2);
	let layer3StartY = (height / 2) - ((totalNodeHeight * layer3Count) / 2);

  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
	for(let i = 0; i < layer1Count; i++) {
		ctx.beginPath();
		ctx.arc(x, layer1StartY, nodeRadius, 0, Math.PI * 2, true);
		layer1Locs.push([x, layer1StartY]);
		layer1StartY += totalNodeHeight;
		ctx.stroke();
	}
	x += totalNodeWidth;

	for(let i = 0; i < layer2Count; i++) {
		ctx.beginPath();
		ctx.arc(x, layer2StartY, nodeRadius, 0, Math.PI * 2, true);
		layer2Locs.push([x, layer2StartY]);
		layer2StartY += totalNodeHeight;
		ctx.stroke();
	}
	x += totalNodeWidth;

	for(let i = 0; i < layer3Count; i++) {
		ctx.beginPath();
		ctx.arc(x, layer3StartY, nodeRadius, 0, Math.PI * 2, true);
		layer3Locs.push([x, layer3StartY]);
		layer3StartY += totalNodeHeight;
		ctx.stroke();
	}

  ctx.lineWidth = 2;
	for(let i = 0; i < layer1Locs.length; i++) {
		for(let j = 0; j < layer2Locs.length; j++) {
			ctx.beginPath();
			ctx.strokeStyle = styledWeights1[i][j];
			ctx.moveTo(layer1Locs[i][0], layer1Locs[i][1]);
			ctx.lineTo(layer2Locs[j][0], layer2Locs[j][1]);
			ctx.stroke();
		}
	}
	for(let i = 0; i < layer2Locs.length; i++) {
		for(let j = 0; j < layer3Locs.length; j++) {
			ctx.beginPath();
			ctx.strokeStyle = styledWeights2[i][j];
			ctx.moveTo(layer2Locs[i][0], layer2Locs[i][1]);
			ctx.lineTo(layer3Locs[j][0], layer3Locs[j][1]);
			ctx.stroke();
		}
	}
}

function renderCanvasGraph(styledWeights1, styledWeights2) {
	let canvas = document.getElementById('canvas-graph') as HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
  ctx.clearRect(0, 0, 250, 400);
  renderCanvasGraphLayer(ctx, styledWeights1, styledWeights2);
}

interface SingleLayerDisplayState {
  networkState: NetworkState;
  iteration: number;
  count: number;
  learningRate: number;
  hiddenLayerSize: number;
  tempLearningRate: number;
  tempCount: number;
  tempHiddenLayerSize: number;
}
class SingleLayerDisplay extends React.Component<{}, SingleLayerDisplayState> {
  constructor(props) {
    super(props);
    let defaultCount = 10;
    let defaultLearningRate = 0.1;
    let defaultHiddenLayerSize = 4;
    this.state = {
      networkState: generateNetworkState(defaultCount, defaultLearningRate, defaultHiddenLayerSize),
      learningRate: defaultLearningRate,
      count: defaultCount,
      hiddenLayerSize: defaultHiddenLayerSize,
      tempHiddenLayerSize: defaultHiddenLayerSize,
      tempLearningRate: defaultLearningRate,
      tempCount: defaultCount,
      iteration: defaultCount
    };
    this.handleIterationChange = this.handleIterationChange.bind(this);
    this.handleLearningRateChange = this.handleLearningRateChange.bind(this);
    this.handleIterationCountChange= this.handleIterationCountChange.bind(this);
    this.handleHiddenLayerSizeChange= this.handleHiddenLayerSizeChange.bind(this);
    this.handleGenerate = this.handleGenerate.bind(this);
  }
  handleIterationChange(iteration) {
    this.setState({
      iteration: iteration
    });
    this.renderWeightsToCanvas();
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
  handleHiddenLayerSizeChange(event) {
    this.setState({
      tempHiddenLayerSize: event.target.value
    });
  }
  handleGenerate() {
    let newState = generateNetworkState(this.state.tempCount, this.state.tempLearningRate, this.state.tempHiddenLayerSize);
    this.setState({
      count: this.state.tempCount,
      iteration: this.state.tempCount,
      learningRate: this.state.tempLearningRate,
      networkState: newState,
      hiddenLayerSize: this.state.tempHiddenLayerSize
    });

    this.nonReactRenders();
  }
  getCurrentLayer1() {
    return this.state.networkState.iterations[this.state.iteration][0];
  }
  getCurrentLayer2() {
    return this.state.networkState.iterations[this.state.iteration][1];
  }
  renderWeightsToCanvas() {
    let styledWeights1 = MatrixUtil.mapOneToOne(this.getCurrentLayer1().weights, (weight) => weightToStyle(weight)['background-color']);
    let styledWeights2 = MatrixUtil.mapOneToOne(this.getCurrentLayer2().weights, (weight) => weightToStyle(weight)['background-color']);
    renderCanvasGraph(styledWeights1, styledWeights2);
  }
  nonReactRenders() {
    this.renderWeightsToCanvas();
    this.state.networkState.plotData.render('error-plot', 'Error');
  }
  componentDidUpdate() {
    this.nonReactRenders();
  }
  componentDidMount() {
    this.nonReactRenders();
  }
  render() {
    let layer1 = this.getCurrentLayer1();
    let layer2 = this.getCurrentLayer2();
    let finalError = this.state.networkState.finalError;

    return (
      <div>
        <div className="input-section">
          <div className="input-field">
            Hidden Layer Size: <input value={this.state.tempHiddenLayerSize} onInput={this.handleHiddenLayerSizeChange} />
          </div>
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
          Hidden Layer Size: {this.state.hiddenLayerSize}
        </div>
        <div className="display-field">
          Learning Rate: {this.state.learningRate}
        </div>
        <div className="display-field">
          Iteration Count: {this.state.count}
        </div>
        <div className="display-field">
          Final Error: {finalError}
        </div>
        <IterationSlider min={0} max={this.state.count} value={this.state.iteration} onIterationChange={this.handleIterationChange}/>
        <table className="display-table">
          <tr>
            <td>
              <div className="matrix-header">Forward Layer 1</div>
            </td>
            <td>
              <div className="matrix-header">Inputs</div>
              {matrixToTable(this.state.networkState.inputData, false)}
            </td>
            <td>
              <div className="matrix-header">Weights</div>
              {matrixToTable(layer1.weights, true)}
            </td>
            <td>
              <div className="matrix-header">Weighted Sum</div>
              {matrixToTable(layer1.hiddenSum, false)}
            </td>
            <td>
              <div className="matrix-header">Output</div>
              {matrixToTable(layer1.hiddenResult, false)}
            </td>
          </tr>
        </table>
        <table className="display-table">
          <tr>
            <td>
              <div className="matrix-header">Forward Layer 2</div>
            </td>
            <td>
              <div className="matrix-header">Inputs (Layer 1 Output)</div>
              {matrixToTable(layer1.hiddenResult,false)}
            </td>
            <td>
              <div className="matrix-header">Weights</div>
              {matrixToTable(layer2.weights, true)}
            </td>
            <td>
              <div className="matrix-header">Weighted Sum</div>
              {matrixToTable(layer2.hiddenSum, false)}
            </td>
            <td>
              <div className="matrix-header">Output</div>
              {matrixToTable(layer2.hiddenResult, false)}
            </td>
            <td>
              <div className="matrix-header">Target Output</div>
              {matrixToTable(this.state.networkState.outputTarget, false)}
            </td>
          </tr>
        </table>
        <table className="display-table">
          <tr>
            <td>
              <div className="matrix-header">Back Prop Layer 2</div>
            </td>
            <td>
              <div className="matrix-header">Error</div>
              {matrixToTable(layer2.error, false)}
            </td>
            <td>
              <div className="matrix-header">Gradients</div>
              {matrixToTable(layer2.gradients, false)}
            </td>
            <td>
              <div className="matrix-header">Delta</div>
              {matrixToTable(layer2.delta, false)}
            </td>
            <td>
              <div className="matrix-header">Weight Updates</div>
              {matrixToTable(layer2.weightUpdates, false)}
            </td>
          </tr>
        </table>
        <table className="display-table">
          <tr>
            <td>
              <div className="matrix-header">Back Prop Layer 1</div>
            </td>
            <td>
              <div className="matrix-header">Error</div>
              {matrixToTable(layer1.error, false)}
            </td>
            <td>
              <div className="matrix-header">Gradients</div>
              {matrixToTable(layer1.gradients, false)}
            </td>
            <td>
              <div className="matrix-header">Delta</div>
              {matrixToTable(layer1.delta, false)}
            </td>
            <td>
              <div className="matrix-header">Weight Updates</div>
              {matrixToTable(layer1.weightUpdates, false)}
            </td>
          </tr>
        </table>
        <table>
          <tr>
          <td>
              <canvas id="canvas-graph" width="250" height="400"></canvas>
          </td>
          <td>
              <div id="error-plot"></div>
          </td>
          </tr>
        </table>
      </div>
    );
  }
}

ReactDOM.render(
  <SingleLayerDisplay/>,
  document.getElementById('root')
);
