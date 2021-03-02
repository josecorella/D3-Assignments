const book_name = "bibliography.title";
const book_rank = "metadata.rank";
const book_downloads = "metadata.downloads";

let books = [
  "The Tragedy of Romeo and Juliet",
  "Hamlet, Prince of Denmark",
  "Macbeth",
  "Hamlet",
  "Beautiful Stories from Shakespeare",
  "Othello",
  "Shakespeare's Sonnets",
  "The Tragedy of Macbeth",
  "A Midsummer Night's Dream",
  "The Tragedy of Julius Caesar",
  "Romeo and Juliet",
  "The Tragedy of King Lear",
  "The Taming of the Shrew",
  "The Merchant of Venice",
  "Hamlet, Prince of Denmark",
  "King Richard III",
  "As You Like It",
];

let downloads_x_rank = [];
d3.csv("../data/classics.csv", function (data) {
  if (books.includes(data[book_name])) {
    console.log(data[book_name]);
    downloads_x_rank.push([+data[book_rank], +data[book_downloads]]);
  }
}).then(() => {
  main();
});

function main() {
  console.log(downloads_x_rank);
  const w = 1000;
  const h = 800;
  let svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

  const xScale = d3
    .scaleLinear()
    .domain([0, 1000])
    .range([75, w - 100]);
  const yScale = d3
    .scaleLinear()
    .domain([0, 3000])
    .range([h - 300, 100]);

  const yAxis = d3.axisLeft(yScale).ticks(15);
  const xAxis = d3.axisBottom(xScale).ticks(13);

  svg.append("g").attr("transform", "translate(125,0)").call(yAxis);
  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "translate(550,75)")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("Number of Downloads based on Book Rank (William Shakespeare)");

  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "rotate(-90)")
    .attr("y", 40)
    .attr("x", 0 - 300)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("Number of Downloads(k)");

  svg.append("g").attr("transform", "translate(50,500)").call(xAxis);
  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "translate(550,550)")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("Book Rank");

  svg
    .selectAll("circle")
    .data(downloads_x_rank)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return d[0] + 100;
    })
    .attr("cy", function (d) {
      return 500 - d[1] / 8;
    })
    .attr("r", 8)
    .attr("fill", "rgb(0, 50, 255)");
}
