const country = "Country";
const lexp = "Data.Health.Life Expectancy at Birth, Total";
const pop = "Data.Health.Total Population";
const popGrowth = "Data.Health.Population Growth";
const year = 2013;

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

targetCountries = [
  "United States",
  "China",
  "South Africa",
  "European Union",
  "Latin America & Caribbean (all income levels)",
];

countries = {};

d3.csv("../data/global_development.csv", function (data) {
  if (data.Year == 2013) {
    if (targetCountries.includes(data[country])) {
      countries[data[country]] = {
        population: +data[pop],
        life_expectancy: +data[lexp],
        population_growth: +data[popGrowth],
      };
    }
  }
}).then(() => {
  main();
});

function main() {
  const xScale = d3
    .scaleLinear()
    .domain([50, 85])
    .range([25, width - 50]);
  const yScale = d3
    .scaleLinear()
    .domain([-1, 2])
    .range([height - 275, 25]);
  const yAxis = d3.axisLeft(yScale);
  const xAxis = d3.axisBottom(xScale);
  svg.append("g").attr("transform", "translate(50,450)").call(xAxis);
  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "translate(400,500)")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("Life Expectancy");
  svg.append("g").attr("transform", "translate(75,65)").call(yAxis);
  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "rotate(-90)")
    .attr("y", 15)
    .attr("x", 0 - 275)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("Population Growth (%)");
  svg
    .selectAll("circle")
    .data(Object.keys(countries))
    .enter()
    .append("circle")
    .attr("cx", 800)
    .attr("cy", function (d, i) {
      return 100 + 30 * i;
    })
    .attr("r", function (d, i) {
      return 8 + i;
    })
    .style("fill", function (d, i) {
      return "rgb(255, " + Math.round(i * 50) + ", 0)";
    })
    .style("opacity", "0.7");
  svg
    .append("text")
    .attr("x", 820)
    .attr("y", 100)
    .text("China")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  svg
    .append("text")
    .attr("x", 820)
    .attr("y", 130)
    .text("European Union")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  svg
    .append("text")
    .attr("x", 820)
    .attr("y", 160)
    .text("Latin America")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  svg
    .append("text")
    .attr("x", 820)
    .attr("y", 190)
    .text("South Africa")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  svg
    .append("text")
    .attr("x", 820)
    .attr("y", 220)
    .text("United States")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  // Add dots
  svg
    .append("g")
    .selectAll("dot")
    .data(Object.keys(countries))
    .enter()
    .append("circle")
    .attr("cx", function (d, i) {
      return 200 + countries[d].life_expectancy * i + 40;
    })
    .attr("cy", function (d, i) {
      return 325 - countries[d].population_growth * 100;
    })
    .attr("r", function (d) {
      return countries[d].population / 10000000;
    })
    .style("fill", function (d, i) {
      return "rgb(255, " + Math.round(i * 50) + ", 0)";
    })
    .style("opacity", "0.7")
    .attr("stroke", "black");
}
