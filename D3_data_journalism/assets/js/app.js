// @TODO: YOUR CODE HERE!
//TODO need function to move text to proper places when label is clicked
//TODO need to add one more label to both x axis and y axis
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

//creates a new x scale based on label choosen
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.9,
      d3.max(data, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);

  return xLinearScale;

}
//creates a new y scale based on label choosen
function yScale(data, chosenYAxis){

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis])*0.9,
      d3.max(data, d => d[chosenYAxis])* 1.1])
    .range([height,0]);

  return yLinearScale;
}; 
//renders a new x axis based on label choosen
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
//renders a new y axis based on label choosen
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}
//function to render circles positions on the chart
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

d3.csv("assets/data/data.csv").then(function(data, err){
  if (err) throw err;
    data.forEach(function(data){
        data.poverty=+data.poverty;
        data.healthcare=+data.healthcare;
        data.age= +data.age;
        data.income=+data.income;
        data.smokes=+data.smokes;
        data.obesity=+data.obesity;
    })
    //console.log(data)
    var xLinearScale = xScale(data, chosenXAxis);
    var yLinearScale = yScale(data, chosenYAxis);
    
    var bottomAxis = d3.axisBottom(xLinearScale)
    var leftAxis = d3.axisLeft(yLinearScale)

    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    var yAxis = chartGroup.append("g")
        .call(leftAxis);
    var circlesGroup =chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d =>yLinearScale(d[chosenYAxis]))
        .attr("r",13)
        .attr("class","stateCircle" )

    var textGroup = chartGroup.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x",d=>xLinearScale(d[chosenXAxis]))
        .attr("y",d=>(yLinearScale(d[chosenYAxis])+5))
        .text(d=>d.abbr)
        .attr("class", "stateText")
    var toolTip = d3.tip()
        .attr("class","d3-tip")
        .offset([80, -60])
        .html(function(d) {
          return (`state ${d.state}<br> %poverty ${d.poverty} <br> % without healthcare ${d.healthcare}`);
        });
    chartGroup.call(toolTip);
    circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
      })
      .on("mouseout", function(d) {
        toolTip.hide(d);
      });
      textGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
      })
      .on("mouseout", function(d) {
        toolTip.hide(d);
      });
    var yLableGroup= chartGroup.append("g")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
    var healthcareLabel=yLableGroup.append("text")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("value","healthcare")
      .classed("active",true)
      .text("Lacks Healthcare (%)");
    var smokesLabel=yLableGroup.append("text")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 2))
      .attr("value","smokes")
      .classed("inactive", true)
      .text("Smokes(%)")
    var xLableGroup=chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    var povertyLabel=xLableGroup.append("text")
      .attr("x",0)
      .attr("y",0)
      .attr("value", "poverty")
      .classed("active", true)
      .text("In Poverty (%)")
    var ageLabel=xLableGroup.append("text")
      .attr("x",0)
      .attr("y",20)
      .attr("value", "age")
      .classed("inactive", true)
      .text("Age (median)")

    //renders a transitions along the x axis on a click of a label on the x axis
    xLableGroup.selectAll("text")
      .on("click", function(){
        var value = d3.select(this).attr("value");
        if(value !==chosenXAxis){
          chosenXAxis=value;

          xLinearScale=xScale(data,chosenXAxis);

          xAxis = renderXAxes(xLinearScale,xAxis)

          circlesGroup=renderCircles(circlesGroup,xLinearScale,chosenXAxis,yLinearScale,chosenYAxis)

          if(chosenXAxis ==="poverty"){
            povertyLabel
              .classed("active", true)
              .classed("inactive",false)
            ageLabel
              .classed("active", false)
              .classed("inactive",true)
          }
          else{
            ageLabel
              .classed("active", true)
              .classed("inactive",false)
            povertyLabel
              .classed("active", false)
              .classed("inactive",true)
          }
        };
      })
      //renders a transition along the y axis on a click on a lable on the y axis
      yLableGroup.selectAll("text")
      .on("click", function(){
        var value = d3.select(this).attr("value");
        if(value !==chosenYAxis){
          chosenYAxis=value;

          yLinearScale=yScale(data,chosenYAxis);

          yAxis = renderYAxes(yLinearScale,yAxis)

          circlesGroup=renderCircles(circlesGroup,xLinearScale,chosenXAxis,yLinearScale,chosenYAxis)

          if(chosenYAxis ==="healthcare"){
            healthcareLabel
              .classed("active", true)
              .classed("inactive",false)
            smokesLabel
              .classed("active", false)
              .classed("inactive",true)
          }
          else{
            smokesLabel
              .classed("active", true)
              .classed("inactive",false)
            healthcareLabel
              .classed("active", false)
              .classed("inactive",true)
          }
        };
      })
}).catch(function(error) {
    console.log(error);
  });