import React from 'react';
import './App.scss';


class App extends React.Component{
  constructor(){
    super();
    this.state = {
      points: [[1,1],[3.5,6],[6,1],[4,5]],
      inputX: 0,
      inputY: 0
    }
  }

  render(){
    return (
      <div className="container">
        <div id="graph-cont">
          <canvas id="graph" width="600" height="600"></canvas>
        </div>
        <div className="points">
          {this.state.points.map((pt,i) => 
              <div className="point" key={i}>
                x<span>{pt[0]}</span> 
                y<span>{pt[1]}</span>
                <a href="#" rel="noopener noreferrer" onClick={this.removeCtrlPoint.bind(this,pt)}>Remove</a>
              </div>
            )}
          <div className="newPt">
            <div className="point bg-dgray">
                x <input type="number" step="0.01" name="x" id="inputX" value={this.inputX} onInput={this.setInput.bind(this,'X')}/>
                y <input type="number" step="0.01" name="y" id="inputY" value={this.inputY} onInput={this.setInput.bind(this,'Y')}/>
                <a href="#" rel="noopener noreferrer" onClick={this.addCtrlPoint.bind(this)}>Add</a>
            </div>
          </div>  
        </div>
      </div>
    )
  }

  setInput(i,e){
    if(e.target.validity.valid){
      this.setState({[`input${i}`]:parseFloat(e.target.value)});
    }
  }

  addCtrlPoint(){
    if(typeof(this.state.inputX) == "number" && typeof(this.state.inputY) == "number"){
      
      let points = this.state.points;
      points.push([this.state.inputX,this.state.inputY]);
      this.setState({points, inputX: 0, inputY: 0});
    }
  }

  removeCtrlPoint(pt){
    let points = this.state.points.filter(p => (p[0] !== pt[0] || p[1] !== pt[1]) );
    this.setState({points});
  }

  genPt(p1,p2,t){
    return [
      p1[0] + (p2[0] - p1[0]) * t,
      p1[1] + (p2[1] - p1[1]) * t,
    ]
  }

  genCurvePts(ctrlPts,t){
    if(ctrlPts.length === 1) return ctrlPts;
    else{
      let p = []
      let i = 0;
      while(i < ctrlPts.length - 1){
        p.push(this.genPt(ctrlPts[i],ctrlPts[i+1],t));
        i++;
      }
      return this.genCurvePts(p,t);
    }
  }

  genGraph(){
    let arr = [];
    let i = 0;
    while(i < 1){
      arr.push(this.genCurvePts(this.state.points,i));
      i+=0.01;
    }

    console.log(arr);
  }

  componentDidMount(){
    this.genGraph();
  }
  
}
export default App;
