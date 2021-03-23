const console_name = "Release.Console";
const sales = "Metrics.Sales";

var consoles = [
  "X360",
  "Nintendo DS",
  "Nintendo Wii",
  "PlayStation 3",
  "Sony PSP",
];

let margin = { top: 20, right: 30, bottom: 120, left: 40 };
const width = 900 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

let svg = d3
  .select("body")
  .append("svg")
  .attr("width", 200 + width + margin.left + margin.right)
  .attr("height", 200 + width + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var console_sales = {
  X360: 0,
  "Nintendo DS": 0,
  "Nintendo Wii": 0,
  "PlayStation 3": 0,
  "Sony PSP": 0,
};
var sales_tracker = [0, 0, 0, 0, 0];

d3.csv("../data/video_games.csv", function (data) {
  if (consoles.includes(data[console_name])) {
    tmp = consoles.indexOf(data[console_name]);
    console_sales[data[console_name]] += +data[sales];
    sales_tracker[tmp] += +data[sales];
  }
}).then(() => {
  main();
});

function main() {
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(sales_tracker)])
    .range([25, 650]);
  const yScale = d3
    .scaleBand()
    .domain(consoles)
    .range([25, height - 275]);

  const yAxis = d3.axisLeft(yScale).ticks(8);
  const xAxis = d3.axisBottom(xScale);
  const barX = 285;

  var colorScale = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain([d3.min(sales_tracker), d3.max(sales_tracker)]);

  var legend = d3
    .legendColor()
    .title("Color Legend")
    .titleWidth(100)
    .scale(colorScale);

  svg.append("g").attr("transform", "translate(95,450)").call(xAxis);
  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "translate(450,500)")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("Console Sales");
  svg
    .append("g")
    .attr("transform", "translate(120,65)")
    .call(yAxis.tickSize(0));
  svg
    .selectAll("rect")
    .data(consoles)
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
      return 120;
    })
    .attr("y", function (d, i) {
      return 75 * i + 100;
    })
    .attr("width", function (d) {
      return 5 * console_sales[d] - 200;
    })
    .attr("height", function (d) {
      return 40;
    })
    .attr("fill", function (d) {
      return colorScale(console_sales[d]);
    });
  svg
    .append("g")
    .attr("transform", "translate(800,300)")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .call(legend);
}
