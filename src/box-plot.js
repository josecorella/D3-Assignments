// inspiration taken from
// https://www.d3-graph-gallery.com/graph/boxplot_basic.html
const book_name = "bibliography.title";
const book_downloads = "metadata.downloads";
const book_author = "bibliography.author.name";
const author = "Shakespeare, William";

let downloads = [];

d3.csv("../data/classics.csv", function (data) {
  if (data[book_author] == author) {
    downloads.push(+data[book_downloads]);
  }
}).then(() => {
  main();
});

function main() {
  let margin = { top: 20, right: 30, bottom: 120, left: 40 };
  const w = 400 - margin.left - margin.right;
  const h = 400 - margin.top - margin.bottom;
  let svg = d3
    .select("body")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom);

  //find the q1, median, q3, inter range, min, and max
  const q1 = d3.quantile(downloads, 0.25);
  const median = d3.quantile(downloads, 0.5);
  const q3 = d3.quantile(downloads, 0.75);
  const min = downloads[downloads.length - 1];
  const max = downloads[0];

  // Show the Y scale
  var yScale = d3.scaleLinear().domain([0, 4500]).range([h, 0]);
  const yAxis = d3.axisLeft(yScale).ticks(9);

  svg.append("g").attr("transform", "translate(125,100)").call(yAxis);
  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("y", 50)
    .attr("x", 200)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("Breakdown of Shakespeare's Works");

  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "rotate(-90)")
    .attr("y", 40)
    .attr("x", 0 - 225)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("Number of Downloads(k)");

  // Show the main vertical line
  svg
    .append("line")
    .attr("x1", 187.5)
    .attr("x2", 187.5)
    .attr("y1", min - 60)
    .attr("y2", (max % 1000) + 45)
    .attr("stroke", "black");

  svg
    .append("rect")
    .attr("x", 200 - 100 / 2)
    .attr("y", (q3 % 1000) + 60)
    .attr("height", (q3 % 10) + 40)
    .attr("width", 75)
    .attr("stroke", "black")
    .style("fill", "rgb(110, 165, 255)");
  svg
    .selectAll("toto")
    .data([min, median, max])
    .enter()
    .append("line")
    .attr("x1", 200 - 100 / 2)
    .attr("x2", 200 + 100 / 2 - 25)
    .attr("y1", function (d, i) {
      if (i == 0) {
        return d - 60;
      }
      if (i == 1) {
        return d - 400;
      }
      if (i == 2) {
        return (d % 1000) + 45;
      }
    })
    .attr("y2", function (d, i) {
      if (i == 0) {
        return d - 60;
      }
      if (i == 1) {
        return d - 400;
      }
      if (i == 2) {
        return (d % 1000) + 45;
      }
    })
    .attr("stroke", "black");

  //   console.log(min);
}
