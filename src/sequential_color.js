//axis code taken from http://using-d3js.com/04_03_axis.html
var authors = [
  "Austen, Jane",
  "Twain, Mark",
  "Dickens, Charles",
  "Doyle, Arthur Conan",
  "Shakespeare, William",
  "Dostoyevsky, Fyodor",
  "Douglass, Frederick",
  "Vonnegut, Kurt",
  "Newton, Isaac, Sir",
];

author_name = "bibliography.author.name";
author_download = "metadata.downloads";

//d3 nesting => d3 groups
author_downloads = [0, 0, 0, 0, 0, 0, 0, 0, 0];
d3.csv("../data/classics.csv", function (data) {
  if (authors.includes(data[author_name])) {
    var index = authors.indexOf(data[author_name]);
    var down = data[author_download];
    author_downloads[index] += +down;
  }
}).then(() => {
  main();
});

function main() {
  const w = 1000;
  var width = 1500;
  const h = 800;
  let svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", h);

  const xScale = d3
    .scaleLinear()
    .domain([0, 65])
    .range([75, w - 100]);
  const yScale = d3
    .scaleBand()
    .domain(authors)
    .range([100, h - 300]);
  const yAxis = d3.axisLeft(yScale);
  const xAxis = d3.axisBottom(xScale).ticks(13);

  const barX = 125;

  var height = 300;

  var colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateGnBu)
    .domain([d3.min(author_downloads), d3.max(author_downloads)]);

  var legend = d3
    .legendColor()
    .title("Color Legend")
    .titleWidth(100)
    .scale(colorScale);

  svg.append("g").attr("transform", "translate(125,0)").call(yAxis.tickSize(0));
  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "translate(550,75)")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("Authors");

  svg.append("g").attr("transform", "translate(50,500)").call(xAxis);
  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "translate(550,550)")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("Number of Downloads(k)");

  svg
    .selectAll("rect")
    .data(author_downloads)
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
      return barX;
    })
    .attr("y", function (d, i) {
      return i * 45 + 110;
    })
    .attr("width", function (d) {
      return 10 + (d / 1000) * 12;
    })
    .attr("height", function (d) {
      return 25;
    })
    .attr("fill", (d, i) => colorScale(d));
  svg
    .append("g")
    .attr("transform", "translate(1000,100)")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .call(legend);
}
