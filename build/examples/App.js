"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var MatrixUtil = require("../lib/MatrixUtil");
function formatName(user) {
    return user.firstName + ' ' + user.lastName;
}
var user = {
    firstName: 'Harper',
    lastName: 'Perez'
};
// const element = (
//   <h1>
//     Hello, {formatName(user)}!
//   </h1>
// );
var weights = MatrixUtil.generateRandom(3, 4);
function matrixToTable(m) {
    var rowComponents = [];
    var _a = MatrixUtil.getDimension(m), mRows = _a[0], mCols = _a[1];
    for (var row = 0; row < mRows; row++) {
        var colComponents = [];
        for (var col = 0; col < mCols; col++) {
            var value = m[row][col].toString().substr(0, 8);
            colComponents.push(React.createElement("td", null, value));
        }
        rowComponents.push(React.createElement("tr", null, colComponents));
    }
    return (React.createElement("table", { className: "mdl-data-table mdl-js-data-table mdl-shadow--2dp" }, rowComponents));
}
var element = (React.createElement("table", null,
    React.createElement("tr", null,
        React.createElement("td", null,
            React.createElement("h6", null, "Weights"),
            matrixToTable(weights)))));
ReactDOM.render(element, document.getElementById('root'));
// <table>
// 	<tr>
// 		<td>
// 			<h6>Weights</h6>
// 			<table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
// 				<tbody>
// 					<tr>
// 						<td>25</td>
// 						<td>25</td>
// 						<td>$2.90</td>
// 					</tr>
// 					<tr>
// 						<td>25</td>
// 						<td>25</td>
// 						<td>$2.90</td>
// 					</tr>
// 					<tr>
// 						<td>25</td>
// 						<td>25</td>
// 						<td>$2.90</td>
// 					</tr>
// 				</tbody>
// 			</table>
// 		</td>
// 		<td>
// 			<h6>Weights</h6>
// 			<table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
// 				<tbody>
// 					<tr>
// 						<td>25</td>
// 						<td>25</td>
// 						<td>$2.90</td>
// 					</tr>
// 					<tr>
// 						<td>25</td>
// 						<td>25</td>
// 						<td>$2.90</td>
// 					</tr>
// 					<tr>
// 						<td>25</td>
// 						<td>25</td>
// 						<td>$2.90</td>
// 					</tr>
// 				</tbody>
// 			</table>
// 		</td>
// 	</tr>
// </table>
