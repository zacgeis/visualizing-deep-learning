import * as React from "react";
import * as ReactDOM from "react-dom";
import * as MatrixUtil from "../lib/MatrixUtil";
import * as katex from "katex";
import * as Plotly from "plotly.js";

type Matrix<T> = Array<Array<T>>;

interface MatrixTableProps {
  matrix: Matrix<any>;
  colorize: boolean;
  fullString?: boolean;
}
class MatrixTable extends React.Component<MatrixTableProps, {}> {
  constructor(props) {
    super(props);
  }
  render() {
    let rowComponents: JSX.Element[] = [];
    let [mRows, mCols] = MatrixUtil.getDimension(this.props.matrix);
    for(let row = 0; row < mRows; row++) {
      let colComponents: JSX.Element[] = [];
      for(let col = 0; col < mCols; col++) {
        let value = this.props.matrix[row][col]
        if(!this.props.fullString) {
          value = value.toString().substr(0, 8);
        }
        let style = {};
        if(this.props.colorize) {
          style['background-color'] = MatrixUtil.weightToColor(this.props.matrix[row][col]);
        }
        colComponents.push(<td style={style}>{value}</td>);
      }
      rowComponents.push(<tr>{colComponents}</tr>);
    }
    return (<table className="matrix-table">{rowComponents}</table>);
  }
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

interface PlotlyGraphProps {
  plotData: PlotData;
  width: number;
  height: number;
  title: string;
}
class PlotlyGraph extends React.Component<PlotlyGraphProps, {}> {
  graphDiv: HTMLElement;
  constructor(props) {
    super(props);
  }
  componentDidUpdate() {
    this.plotlyRender();
  }
  componentDidMount() {
    this.plotlyRender();
  }
  render() {
    return <div ref={(input) => { this.graphDiv = input }}></div>
  }
  plotlyRender() {
    Plotly.purge(this.graphDiv);
    let layout = {
      width: this.props.width,
      height: this.props.height,
      title: this.props.title,
      xaxis: {
        title: 'Iterations'
      }
    };

    let data = this.props.plotData.getPlotlyFormattedData();
    Plotly.newPlot(this.graphDiv, data, layout);
  }
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

interface MathIntroState { value: number; }
class MathIntro extends React.Component<{}, {}> {
  sigmoidElement: HTMLElement;
  sigmoidDerivElement: HTMLElement;
  constructor(props) {
    super(props);
  }
  componentDidUpdate() {
    this.renderLatex();
  }
  componentDidMount() {
    this.renderLatex();
  }
  renderLatex() {
    katex.render("s(x) = \\frac{1}{1 + e^{-x}}", this.sigmoidElement);
    katex.render("s'(x) = \\frac{ds(x)}{dx} = s(x)(1 - s(x))", this.sigmoidDerivElement);
  }
  render() {
    let x22 = [['x11', 'x12'], ['x21', 'x22']];
    let y22 = [['y11', 'y12'], ['y21', 'y22']];
    let plus = [['x11 + y11', 'x12 + y12'], ['x21 + y21', 'x22 + y22']];
    let adot = [['a*x11', 'a*x12'], ['a*x21', 'a*x22']];
    let fx = [['f(x11)', 'f(x12)'], ['f(x21)', 'f(x22)']];

    let x23 = [['x11', 'x12', 'x13'], ['x21', 'x22', 'x23']];
    let transpose = [['x11', 'x21'], ['x12', 'x22'], ['x21', 'x23']];
    let y32 = [['y11', 'y12'], ['y21', 'y22'], ['y31', 'y32']];
    let xydot = [
      [
        'x11*y11 + x12*y21 + x13*y31',
        'x11*y12 + x12*y22 + x13*y32',
      ],
      [
        'x21*y11 + x22*y21 + x23*y31',
        'x21*y12 + x22*y22 + x23*y32',
      ]
    ];
    return (
      <div className="math-intro">
        <h3 className="math-intro-header">Brief Function Guide:</h3>
        <h4 className="math-intro-label">Sigmoid:</h4>
        <table className="display-table">
          <tr>
            <td>
              <div className="math" ref={(input) => { this.sigmoidElement = input }}></div>
            </td>
          </tr>
        </table>
        <h4 className="math-intro-label">Sigmoid's First Derivative:</h4>
        <table className="display-table">
          <tr>
            <td>
              <div className="math" ref={(input) => { this.sigmoidDerivElement = input }}></div>
            </td>
          </tr>
        </table>
        <h4 className="math-intro-label">Matrix Element-Wise Operations</h4>
        <div className="math-intro-label-sub">This applies to all basic arithmetic operations</div>
        <table className="display-table">
          <tr>
            <td>
              <MatrixTable matrix={x22} colorize={false} fullString={true}/>
            </td>
            <td className="symbol">
              +
            </td>
            <td>
              <MatrixTable matrix={y22} colorize={false} fullString={true}/>
            </td>
            <td className="symbol">
              =
            </td>
            <td>
              <MatrixTable matrix={plus} colorize={false} fullString={true}/>
            </td>
          </tr>
        </table>
        <h4 className="math-intro-label">Matrix Multiplication</h4>
        <table className="display-table">
          <tr>
            <td>
              <MatrixTable matrix={x23} colorize={false} fullString={true}/>
            </td>
            <td className="symbol">
              ·
            </td>
            <td>
              <MatrixTable matrix={y32} colorize={false} fullString={true}/>
            </td>
            <td className="symbol">
              =
            </td>
            <td>
              <MatrixTable matrix={xydot} colorize={false} fullString={true}/>
            </td>
          </tr>
        </table>
        <h4 className="math-intro-label">Matrix Scalar</h4>
        <table className="display-table">
          <tr>
            <td>
              a
            </td>
            <td className="symbol">
              ·
            </td>
            <td>
              <MatrixTable matrix={x22} colorize={false} fullString={true}/>
            </td>
            <td className="symbol">
              =
            </td>
            <td>
              <MatrixTable matrix={adot} colorize={false} fullString={true}/>
            </td>
          </tr>
        </table>
        <h4 className="math-intro-label">Matrix Transpose</h4>
        <table className="display-table">
          <tr>
            <td className="symbol">
              T(
            </td>
            <td>
              <MatrixTable matrix={x23} colorize={false} fullString={true}/>
            </td>
            <td className="symbol">
              )=
            </td>
            <td>
              <MatrixTable matrix={transpose} colorize={false} fullString={true}/>
            </td>
          </tr>
        </table>
        <h4 className="math-intro-label">Matrix Element-Wise Apply</h4>
        <table className="display-table">
          <tr>
            <td className="symbol">
              f(
            </td>
            <td>
              <MatrixTable matrix={x22} colorize={false} fullString={true}/>
            </td>
            <td className="symbol">
              )=
            </td>
            <td>
              <MatrixTable matrix={fx} colorize={false} fullString={true}/>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

interface NetworkGraphProps {
  styledWeights1: Matrix<string>;
  styledWeights2: Matrix<string>;
  height: number;
  width: number;
}
class NetworkGraph extends React.Component<NetworkGraphProps, {}> {
  canvasElement: HTMLCanvasElement;
  constructor(props) {
    super(props);
  }
  componentDidUpdate() {
    this.renderCanvasGraph();
  }
  componentDidMount() {
    this.renderCanvasGraph();
  }
  renderCanvasGraph() {
    let ctx: CanvasRenderingContext2D = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, 250, 400);

    let styledWeights1 = this.props.styledWeights1;
    let styledWeights2 = this.props.styledWeights2;
    let height = this.props.height;
    let verticalSep = 30;
    let horizontalSep = 60;
    let nodeRadius = 10;

    let layer1Count = styledWeights1.length;
    let layer2Count = styledWeights1[0].length;
    let layer3Count = styledWeights2[0].length;

    let layer1Locs: number[][] = [];
    let layer2Locs: number[][] = [];
    let layer3Locs: number[][] = [];

    let totalNodeHeight = nodeRadius * 2 + verticalSep;
    let totalNodeWidth = nodeRadius * 2 + horizontalSep;

    let x = (this.props.width / 2) - ((totalNodeWidth * (3 - 1)) / 2);
    let layer1StartY = (height / 2) - ((totalNodeHeight * (layer1Count - 1)) / 2);
    let layer2StartY = (height / 2) - ((totalNodeHeight * (layer2Count - 1)) / 2);
    let layer3StartY = (height / 2) - ((totalNodeHeight * (layer3Count - 1)) / 2);

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0, 0 , 0, 1)';
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
  render() {
    return <canvas ref={(input) => { this.canvasElement = input }} width={this.props.width} height={this.props.height}></canvas>;
  }
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
  }
  render() {
    let layer1 = this.state.networkState.iterations[this.state.iteration][0];
    let layer2 = this.state.networkState.iterations[this.state.iteration][1];
    let finalError = this.state.networkState.finalError;
    let plotData = this.state.networkState.plotData;
    let styledWeights1 = MatrixUtil.mapOneToOne(layer1.weights, (weight) => MatrixUtil.weightToColor(weight));
    let styledWeights2 = MatrixUtil.mapOneToOne(layer2.weights, (weight) => MatrixUtil.weightToColor(weight));

    return (
      <div>
        <MathIntro/>
        <h3>Interactive Network:</h3>
        <div className="input-section">
          <div className="input-field">
            Hidden Neuron Count: <input value={this.state.tempHiddenLayerSize} onInput={this.handleHiddenLayerSizeChange} />
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
        <table>
          <tr>
            <td>
              <div className="display-field">
                Hidden Neuron Count: {this.state.hiddenLayerSize}
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
            </td>
            <td>
              <NetworkGraph styledWeights1={styledWeights1} styledWeights2={styledWeights2} height={300} width={300}/>
            </td>
            <td>
              <PlotlyGraph plotData={plotData} title="Error" height={300} width={400}/>
            </td>
          </tr>
        </table>
        <div className="section">
          <div className="section-header">Forward Pass: </div>
          <table className="display-table">
            <tr>
              <td>
                <div className="matrix-header">L1 Weighted Sum</div>
                <MatrixTable matrix={layer1.hiddenSum} colorize={false}/>
              </td>
              <td className="symbol">
                =
              </td>
              <td>
                <div className="matrix-header">Inputs</div>
                <MatrixTable matrix={this.state.networkState.inputData} colorize={false}/>
              </td>
              <td className="symbol">
                ·
              </td>
              <td>
                <div className="matrix-header">L1 Weights</div>
                <MatrixTable matrix={layer1.weights} colorize={true}/>
              </td>
            </tr>
          </table>
          <table className="display-table">
            <tr>
              <td>
                <div className="matrix-header">L1 Output</div>
                <MatrixTable matrix={layer1.hiddenResult} colorize={false}/>
              </td>
              <td className="symbol">
                = S(
              </td>
              <td>
                <div className="matrix-header">L1 Weighted Sum</div>
                <MatrixTable matrix={layer1.hiddenSum} colorize={false}/>
              </td>
              <td className="symbol">
                )
              </td>
            </tr>
          </table>
          <table className="display-table">
            <tr>
              <td>
                <div className="matrix-header">L2 Weighted Sum</div>
                <MatrixTable matrix={layer2.hiddenSum} colorize={false}/>
              </td>
              <td className="symbol">
                =
              </td>
              <td>
                <div className="matrix-header">Inputs (L1 Output)</div>
                <MatrixTable matrix={layer1.hiddenResult} colorize={false}/>
              </td>
              <td className="symbol">
                ·
              </td>
              <td>
                <div className="matrix-header">L2 Weights</div>
                <MatrixTable matrix={layer2.weights} colorize={true}/>
              </td>
            </tr>
          </table>
          <div className="section-header">Output: </div>
          <table className="display-table">
            <tr>
              <td>
                <div className="matrix-header">L2 Output (Final Result)</div>
                <MatrixTable matrix={layer2.hiddenResult} colorize={false}/>
              </td>
              <td className="symbol">
                = S(
              </td>
              <td>
                <div className="matrix-header">L2 Weighted Sum</div>
                <MatrixTable matrix={layer2.hiddenSum} colorize={false}/>
              </td>
              <td className="symbol">
                )
              </td>
            </tr>
          </table>
        </div>
        <div className="section">
          <div className="section-header">Back Propagation Pass: </div>
          <table className="display-table">
            <tr>
              <td>
                <div className="matrix-header">L2 Error</div>
                <MatrixTable matrix={layer2.error} colorize={false}/>
              </td>
              <td className="symbol">
                =
              </td>
              <td>
                <div className="matrix-header">Target Output</div>
                <MatrixTable matrix={this.state.networkState.outputTarget} colorize={false}/>
              </td>
              <td className="symbol">
                -
              </td>
              <td>
                <div className="matrix-header">L2 Output</div>
                <MatrixTable matrix={layer2.hiddenResult} colorize={false}/>
              </td>
            </tr>
          </table>
          <table className="display-table">
            <tr>
              <td>
                <div className="matrix-header">L2 Gradients</div>
                <MatrixTable matrix={layer2.gradients} colorize={false}/>
              </td>
              <td className="symbol">
                = S'(
              </td>
              <td>
                <div className="matrix-header">L2 Weighted Sum</div>
                <MatrixTable matrix={layer2.hiddenSum} colorize={false}/>
              </td>
              <td className="symbol">
                )
              </td>
            </tr>
          </table>
          <table className="display-table">
            <tr>
              <td>
                <div className="matrix-header">L2 Delta</div>
                <MatrixTable matrix={layer2.delta} colorize={false}/>
              </td>
              <td className="symbol">
                =
              </td>
              <td>
                <div className="matrix-header">L2 Gradients</div>
                <MatrixTable matrix={layer2.gradients} colorize={false}/>
              </td>
              <td className="symbol">
                x
              </td>
              <td>
                <div className="matrix-header">L2 Error</div>
                <MatrixTable matrix={layer2.error} colorize={false}/>
              </td>
            </tr>
          </table>
          <table className="display-table">
            <tr>
              <td>
                <div className="matrix-header">L1 Error</div>
                <MatrixTable matrix={layer1.error} colorize={false}/>
              </td>
              <td className="symbol">
                =
              </td>
              <td>
                <div className="matrix-header">L2 Delta</div>
                <MatrixTable matrix={layer2.delta} colorize={false}/>
              </td>
              <td className="symbol">
                ·T(
              </td>
              <td>
                <div className="matrix-header">L2 Weights</div>
                <MatrixTable matrix={layer2.weights} colorize={false}/>
              </td>
              <td className="symbol">
                )
              </td>
            </tr>
          </table>
          <table className="display-table">
            <tr>
              <td>
                <div className="matrix-header">L1 Gradients</div>
                <MatrixTable matrix={layer1.gradients} colorize={false}/>
              </td>
              <td className="symbol">
                = S'(
              </td>
              <td>
                <div className="matrix-header">L1 Hidden Sum</div>
                <MatrixTable matrix={layer1.hiddenSum} colorize={false}/>
              </td>
              <td className="symbol">
                )
              </td>
            </tr>
          </table>
          <table className="display-table">
            <tr>
              <td>
                <div className="matrix-header">L1 Delta</div>
                <MatrixTable matrix={layer1.delta} colorize={false}/>
              </td>
              <td className="symbol">
                =
              </td>
              <td>
                <div className="matrix-header">L1 Gradients</div>
                <MatrixTable matrix={layer1.gradients} colorize={false}/>
              </td>
              <td className="symbol">
                x
              </td>
              <td>
                <div className="matrix-header">L1 Error</div>
                <MatrixTable matrix={layer1.error} colorize={false}/>
              </td>
            </tr>
          </table>
          <table className="display-table">
            <tr>
              <td>
                <div className="matrix-header">L1 Weight Updates</div>
                <MatrixTable matrix={layer1.weightUpdates} colorize={false}/>
              </td>
              <td className="symbol">
                = {this.state.learningRate} · (T(
              </td>
              <td>
                <div className="matrix-header">Inputs</div>
                <MatrixTable matrix={this.state.networkState.inputData} colorize={false}/>
              </td>
              <td className="symbol">
                )·
              </td>
              <td>
                <div className="matrix-header">L1 Delta</div>
                <MatrixTable matrix={layer1.delta} colorize={false}/>
              </td>
              <td className="symbol">
                )
              </td>
            </tr>
          </table>
          <table className="display-table">
            <tr>
              <td>
                <div className="matrix-header">L2 Weight Updates</div>
                <MatrixTable matrix={layer2.weightUpdates} colorize={false}/>
              </td>
              <td className="symbol">
                = {this.state.learningRate} · (T(
              </td>
              <td>
                <div className="matrix-header">L1 Output</div>
                <MatrixTable matrix={layer1.hiddenResult} colorize={false}/>
              </td>
              <td className="symbol">
                )·
              </td>
              <td>
                <div className="matrix-header">L2 Delta</div>
                <MatrixTable matrix={layer2.delta} colorize={false}/>
              </td>
              <td className="symbol">
                )
              </td>
            </tr>
          </table>
          <table className="display-table">
            <tr>
              <td>
                <div className="matrix-header">New L1 Weights</div>
                <MatrixTable matrix={MatrixUtil.elementAdd(layer1.weightUpdates, layer1.weights)} colorize={true}/>
              </td>
              <td className="symbol">
                =
              </td>
              <td>
                <div className="matrix-header">L1 Delta</div>
                <MatrixTable matrix={layer1.weights} colorize={true}/>
              </td>
              <td className="symbol">
                +
              </td>
              <td>
                <div className="matrix-header">L1 Weight Updates</div>
                <MatrixTable matrix={layer1.weightUpdates} colorize={false}/>
              </td>
            </tr>
          </table>
          <table className="display-table">
            <tr>
              <td>
                <div className="matrix-header">New L2 Weights</div>
                <MatrixTable matrix={MatrixUtil.elementAdd(layer2.weightUpdates, layer2.weights)} colorize={true}/>
              </td>
              <td className="symbol">
                =
              </td>
              <td>
                <div className="matrix-header">L2 Delta</div>
                <MatrixTable matrix={layer2.weights} colorize={true}/>
              </td>
              <td className="symbol">
                +
              </td>
              <td>
                <div className="matrix-header">L2 Weight Updates</div>
                <MatrixTable matrix={layer2.weightUpdates} colorize={false}/>
              </td>
            </tr>
          </table>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <SingleLayerDisplay/>,
  document.getElementById('root')
);
