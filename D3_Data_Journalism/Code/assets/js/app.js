// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from forcepoints.csv
d3.csv("assets/data/data.csv").then(function(health) {


  // Cast to a number
  health.forEach(function(data) {
    data.age = +data.age;
    data.poverty = +data.poverty;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
    console.log(data.abbr[1]);
  });

  // d3.extent returns the an array containing the min and max values for the property specified
  var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(health, data => data.poverty))
    .range([0, chartWidth]);

  // Configure a linear scale with a range between the chartHeight and 0
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(health, data => data.obesity)])
    .range([chartHeight, 0]);

  // create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
    .call(leftAxis);

  // append circles
  chartGroup.selectAll("circle")
    .data(health)
    .enter()
    .append("circle")
    .classed('stateCircle',true)
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", 20)
    .attr("opacity", ".5");

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
 
    for (var i=0; i < health.length; i++){
        var xpoint = health[i].poverty;
        var ypoint = health[i].obesity;
        var stateabbr = health[i].abbr; 
    chartGroup.append("text")
    // .data(health)
    .attr("x", d => xLinearScale(xpoint))
    .attr("y", d => yLinearScale(ypoint))
    .text(stateabbr)
    .classed("stateText", true);
    };

    labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("dy", "1em")
    .classed('aText', true)
    .text("Poverty Level");

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .classed("aText", true)
    .text("Obesity Level");
});
