var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

var pollution = new Map();
var pollution_values = [];
var pollutant_countries = [];

var promises = [
  d3.csv("../data/emissions.csv", function (d) {
    pollution.set(d.Country, +d.Emissions);
    pollution_values.push(+d.Emissions);
    pollutant_countries.push(d.Country);
  }),
];

Promise.all(promises).then(ready);

function ready() {
  console.log(pollution);
  const barX = 125;
  const xScale = d3
    .scaleLinear()
    .domain([1000, 522000])
    .range([75, width - 200]);
  const yScale = d3
    .scaleBand()
    .domain(pollutant_countries)
    .range([100, height - 100]);
  const yAxis = d3.axisLeft(yScale);
  const xAxis = d3.axisBottom(xScale).ticks(1);

  svg.append("g").attr("transform", "translate(125,0)").call(yAxis.tickSize(0));
  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "translate(500,50)")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("Countries");

  svg.append("g").attr("transform", "translate(50,500)").call(xAxis);
  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "translate(500,550)")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("Pollution");

  svg
    .selectAll("rect")
    .data(pollution)
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
      return barX;
    })
    .attr("y", function (d, i) {
      return 50 * i + 110;
    })
    .attr("width", function (d) {
      return pollution.get(d[0]) / 750;
    })
    .attr("height", function (d) {
      return 25;
    })
    .attr("fill", "rgb(30, 255, 0)");
}
