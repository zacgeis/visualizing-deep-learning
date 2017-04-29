import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Util from "../lib/Util";
import * as MatrixUtil from "../lib/MatrixUtil";
let weights = MatrixUtil.generateRandom(3, 4);

function matrixToTable(m) {
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
	return (<table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">{rowComponents}</table>);
}

const element = (
  <table>
    <tr>
      <td>
        <h6>Weights</h6>
        {matrixToTable(weights)}
      </td>
    </tr>
  </table>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
