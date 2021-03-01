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
    // console.log(index);
    var down = data[author_download];
    // console.log("Array", author_downloads[index]);
    author_downloads[index] += +down;
    // console.log(index, down);
  }
}).then(() => {
  main();
});

function main() {
  var w = 1000;
  var h = 800;
  var barPadding = 10;
  let svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

  var xScale = d3
    .scaleLinear()
    .domain([0, 66])
    .range([75, w - 100]);
  var yScale = d3
    .scaleBand()
    .domain(authors)
    .range([100, h - 300]);
  var yAxis = d3.axisLeft(yScale);
  var xAxis = d3.axisBottom(xScale).ticks(33);

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
      // return h - i + 50;
      return 125;
    })
    .attr("y", function (d, i) {
      return i * 45 + 110;
    })
    .attr("width", function (d) {
      //controlled by num downloads
      return 10;
    })
    .attr("height", function (d) {
      // return w / author_downloads.length - barPadding;
      return 25;
    })
    .attr("fill", function (d) {
      return "rgb(0, 0, " + Math.round(d * 10) + ")";
    });
  // console.log(author_downloads);
}
