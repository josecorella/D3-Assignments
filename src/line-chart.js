// Using this website as a guideline for the line chart
// https://www.d3-graph-gallery.com/graph/line_basic.html
let margin = { top: 20, right: 30, bottom: 120, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;
const Year = "Year";
const CellSubs = "Data.Infrastructure.Mobile Cellular Subscriptions";

let svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", width + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

yearStats = {};
d3.csv("../data/global_development.csv", function (d) {
  yearStats[+d.Year] = +d[CellSubs];
}).then(() => {
  main();
});

function main() {
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(Object.keys(yearStats)), d3.max(Object.keys(yearStats))])
    .range([25, width - 50]);
  const yScale = d3
    .scaleLinear()
    .domain([0, 40])
    .range([height - 275, 25]);

  const yAxis = d3.axisLeft(yScale).tickFormat((d) => d + "b");
  const xAxis = d3.axisBottom(xScale).tickFormat((d) => d);
  svg.append("g").attr("transform", "translate(50,450)").call(xAxis);
  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "translate(400,500)")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("Year");
  svg.append("g").attr("transform", "translate(75,65)").call(yAxis);
  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "translate(475,70)")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("Cellular Subscriptions from 1960 - 2013");
  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "rotate(-90)")
    .attr("y", 15)
    .attr("x", 0 - 275)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("Number of Cellular Devices (Billions)");

  var lineGenerator = d3.line();
  var points = [];
  i = 1;
  for (const key in yearStats) {
    points.push([71 + 5 * i, 450 - yearStats[key] / 1000000]);
    i += 2.4;
  }
  svg
    .append("path")
    .datum(yearStats)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", lineGenerator(points));
}
