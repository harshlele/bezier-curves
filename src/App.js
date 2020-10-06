import React, {useEffect, useState} from 'react';
import './App.css';


function App() {

  const [ctrlPoints,setCtrlPoints] = useState([[1,1],[3.5,6],[6,1],[4,5]]);
  /*
  const genPt = (p1,p2,t) => {
    return [
      p1[0] + (p2[0] - p1[0]) * t,
      p1[1] + (p2[1] - p1[1]) * t,
    ]
  }


  const genCurvePts = (ctrlPts,t) => {
    if(ctrlPts.length == 1) return ctrlPts;
    else{
      let p = []
      let i = 0;
      while(i < ctrlPts.length - 1){
        p.push(genPt(ctrlPts[i],ctrlPts[i+1],t));
        i++;
      }
      return genCurvePts(p,t);
    }
  }

  useEffect(() => {
    let points = [];
    i = 0;
    while(i < 1.01){
        points.push(genCurvePts(ctrlPoints,i));
        i+=t;
    }

    let aCurve = {
        x: points.map(p => p[0][0]),
        y: points.map(p => p[0][1]),
        mode: "lines",
        name: "Curve"
    }

    Plotly.newPlot( document.querySelector("#plot-cont"), [aCurve,controls], {
    margin: { t: 0 } } );

  });
*/
  return (
    <div className="App">
      <div className="container">
        <div id="plot-cont">
        </div>
        <div className="ctrl-pts"></div>
      </div>
    </div>
  );
}

export default App;
