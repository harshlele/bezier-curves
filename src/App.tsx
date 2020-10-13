import React from 'react';
import './App.scss';
import Chart, { ChartDataSets, ChartOptions } from 'chart.js';
import 'chartjs-plugin-dragdata'

interface Props{}

interface State{
    points: number[][],
    inputX: number,
    inputY: number
}

class App extends React.Component<Props,State>{
  constructor(props:Props){
    super(props);
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
        </div>
        <div className="points">
          {this.state.points.map((pt,i) => 
              <div className="point" key={i}>
                x<span>{pt[0]}</span> 
                y<span>{pt[1]}</span>
                <button onClick={this.removeCtrlPoint.bind(this,pt)}>Remove</button>
              </div>
            )}
          <div className="newPt">
            <div className="point bg-dgray">
                x <input type="number" step="0.01" name="x" id="inputX" value={this.state.inputX} onChange={this.setInput.bind(this,'X')}/>
                y <input type="number" step="0.01" name="y" id="inputY" value={this.state.inputY} onChange={this.setInput.bind(this,'Y')}/>
                <button onClick={this.addCtrlPoint.bind(this)}>Add</button>
            </div>
          </div>  
        </div>
      </div>
    )
  }

  setInput(i: string,e: React.ChangeEvent<HTMLInputElement>){
    const target = e.target;
    
    if(e?.target?.validity?.valid){
      switch(i){
        case 'X':
          this.setState((state) => ({inputX:parseFloat(target.value)}));
          break;
        case 'Y':
          this.setState((state) => ({inputY:parseFloat(target.value)}));
          break;
        default:
          break;
      }      
    }
  }

  addCtrlPoint(){
    if(typeof(this.state.inputX) == "number" && typeof(this.state.inputY) == "number"){
      
      let points = this.state.points;
      points.push([this.state.inputX,this.state.inputY]);
      this.setState({points, inputX: 0, inputY: 0});
      this.genGraph(points);
    }
    
  }

  removeCtrlPoint(pt: number[]){
    let points = this.state.points.filter(p => (p[0] !== pt[0] || p[1] !== pt[1]) );
    this.setState({points});
    this.genGraph(points);
  }

  genPt(p1: number[],p2: number[],t: number){
    return [
      p1[0] + (p2[0] - p1[0]) * t,
      p1[1] + (p2[1] - p1[1]) * t,
    ]
  }

  genCurvePts(ctrlPts:number[][],t: number): number[][] {
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

  genGraph(pointArr: number[][]){
    let points = [];
    let i = 0;
    while(i < 1.001){
      let curvePt = this.genCurvePts(pointArr,i); 
      points.push({x: curvePt[0][0], y: curvePt[0][1]});
      i+=0.001;
    }


    let graphCont = document.querySelector("#graph-cont");

    //graphCont has only a single child
    if(graphCont?.lastChild)  graphCont.removeChild(graphCont.lastChild);

    let graph = document.createElement("canvas");
    graph.setAttribute("id",`graph${parseInt((Math.random() * 100).toString())}`);
    graph.setAttribute("width","600");
    graph.setAttribute("height","600");
    
    graphCont?.appendChild(graph);

    let _this = this;
    let context: CanvasRenderingContext2D | null = graph.getContext("2d");
    if(context){

      new Chart(context, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: "Curve",
              data: points,
              backgroundColor: "red",
              pointRadius: 0.5,
              dragData: false
            } as ChartDataSets, // dragData is not part of ChartDataSets, so has to be asserted
            {
              label: "Control Points",
              data: pointArr.map(p => ({x: p[0],y: p[1]})),
              backgroundColor: "blue",
              pointRadius: 5
            }
          ]
        },
        options:{
          dragData: true,
          dragX: true,
          dragOptions: {
            showTooltip: true 
          },
          onDrag: function (e: MouseEvent, datasetIndex: number, index: number, value: object) {
            // change cursor style to grabbing during drag action
            (e.target as HTMLElement).style.cursor = 'grabbing'; //assert as HTMLElement because the target property of MouseEvent has no style property
          },
          onDragEnd: function (e: MouseEvent, datasetIndex: number, index: number, value: {x: number, y:number}) {
            (e.target as HTMLElement).style.cursor = 'default';
            if(datasetIndex === 1){
              let points = _this.state.points;
              let val = [
                parseFloat(value.x.toFixed(2)),
                parseFloat(value.y.toFixed(2))
              ];
              if(Math.abs(val[0] -  points[index][0]) > 0.01 || Math.abs(val[1] -  points[index][1]) > 0.01){
                points[index] = val;
                _this.setState({points: points});
                _this.genGraph(points);
              }
              
            }
          },
          hover: {
            onHover: function(e: MouseEvent) {
            
              // indicate that a datapoint is draggable by showing the 'grab' cursor when hovered
              
              const point = this.getElementAtEvent(e);
              if (point.length) (e.target as HTMLElement).style.cursor = 'grab';
              else (e.target as HTMLElement).style.cursor = 'default';
              
            }
          }
        } as ChartOptions,
      });

    }
    
  }

  componentDidMount(){
    this.genGraph(this.state.points);
  }
  
}
export default App;
