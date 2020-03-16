// @TODO: YOUR CODE HERE!
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

d3.csv("assets/data/data.csv").then(function(data){
    data.forEach(function(data){
        data.poverty=+data.poverty;
        data.healthcare=+data.healthcare;
    })

    var xLinearScale= d3.scaleLinear()
        .domain([d3.min(data, d=> d.poverty)*0.9,d3.max(data, d=> d.poverty)*1.1])
        .range([0, width]);
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d=> d.healthcare)*0.9,d3.max(data, d => d.healthcare)*1.1])
        .range([height,0]);
    
    var xAxis = d3.axisBottom(xLinearScale)
    var yAxis = d3.axisLeft(yLinearScale)

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    chartGroup.append("g")
        .call(yAxis);
    var circlesGroup =chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d =>yLinearScale(d.healthcare))
        .attr("r",13)
        .attr("class","stateCircle" )

    var textGroup = chartGroup.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x",d=>xLinearScale(d.poverty))
        .attr("y",d=>(yLinearScale(d.healthcare)+5))
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
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("% Without Healthcare");
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("% Poverty");
}).catch(function(error) {
    console.log(error);
  });