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
    .domain([0, 522000])
    .range([75, width - 200]);
  const yScale = d3
    .scaleBand()
    .domain(pollutant_countries)
    .range([100, height - 100]);
  const yAxis = d3.axisLeft(yScale);
  const xAxis = d3.axisBottom(xScale).ticks(5);

  var colorScale = d3
    .scaleSequential(["red", "yellow"])
    .domain([
      d3.min(pollution_values) / 1000,
      d3.max(pollution_values) / 1000000,
    ]);
  var legend = d3
    .legendColor()
    .title("Color Legend")
    .titleWidth(100)
    .scale(colorScale);

  svg.append("g").attr("transform", "translate(125,0)").call(yAxis.tickSize(0));
  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "translate(500,50)")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("CO2 Emittion Levels by Country in 2012");
  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "translate(500,75)")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("Data: https://corgis-edu.github.io/corgis/csv/emissions/");
  svg.append("g").attr("transform", "translate(50,500)").call(xAxis);
  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "translate(500,550)")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("Carbon Dioxide Emissions in kilo tons");

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
    .attr("fill", function (d, i) {
      return colorScale(pollution.get(d[0]) / 5000);
    })
    .append("title")
    .text(function (d, i) {
      console.log(d[0]);
      return d[0] + "\n" + pollution.get(d[0]);
    });
  svg
    .append("g")
    .attr("transform", "translate(850,200)")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .call(legend);
}
