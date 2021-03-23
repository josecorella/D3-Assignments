const country = "Country";
const popGrowth = "Data.Health.Population Growth";
var countries = [
  "Mexico",
  "Argentina",
  "United States",
  "Denmark",
  "Central Europe and the Baltics",
  "Hungary",
  "Romania",
  "Bulgaria",
];

let margin = { top: 20, right: 30, bottom: 120, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

let svg = d3
  .select("body")
  .append("svg")
  .attr("width", 200 + width + margin.left + margin.right)
  .attr("height", 200 + width + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var targetCountries = {
  Mexico: 0,
  Argentina: 0,
  "United States": 0,
  Denmark: 0,
  "Central Europe and the Baltics": 0,
  Hungary: 0,
  Romania: 0,
  Bulgaria: 0,
};
pop_growth = [0, 0, 0, 0, 0, 0, 0, 0];

d3.csv("../data/global_development.csv", function (data) {
  if (data[country] in targetCountries) {
    tmp = countries.indexOf(data[country]);
    targetCountries[data[country]] += +data[popGrowth];
    pop_growth[tmp] += +data[popGrowth];
  }
}).then(() => {
  main();
});

function main() {
  const xScale = d3
    .scaleLinear()
    .domain([-20, 60])
    .range([25, width - 50]);
  const yScale = d3
    .scaleBand()
    .domain(countries)
    .range([25, height - 275]);

  const yAxis = d3.axisLeft(yScale).ticks(8);
  const xAxis = d3.axisBottom(xScale);
  const barX = 285;

  var colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateRdBu)
    .domain([d3.min(pop_growth), d3.max(pop_growth)]);
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
    .text("Population Growth");
  svg
    .append("g")
    .attr("transform", "translate(120,65)")
    .call(yAxis.tickSize(0));
  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "translate(450,75)")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("Population Growth from 1960 to 2013");
  svg
    .selectAll("rect")
    .data(countries)
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
      if (targetCountries[d] < 0) {
        return barX - Math.abs(targetCountries[d]);
      }
      return barX;
    })
    .attr("y", function (d, i) {
      return 45 * i + 100;
    })
    .attr("width", function (d) {
      if (targetCountries[d] < 0) {
        return barX - (barX - Math.abs(targetCountries[d]));
      }
      return 7 * targetCountries[d] + 50;
    })
    .attr("height", function (d) {
      return 30;
    })
    .attr("fill", function (d) {
      return colorScale(targetCountries[d]);
    });
  svg
    .append("g")
    .attr("transform", "translate(700,300)")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .call(legend);
}
