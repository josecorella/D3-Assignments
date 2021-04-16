var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

var migration = new Map();
var county_names = new Map();

var path = d3.geoPath();

var x = d3.scaleLinear().domain([1, 10]).rangeRound([600, 860]);

var color = d3
  .scaleThreshold()
  .domain(d3.range(0, 10))
  .range(d3.schemeBlues[9]);

var g = svg
  .append("g")
  .attr("class", "key")
  .attr("transform", "translate(0,40)");

g.selectAll("rect")
  .data(
    color.range().map(function (d) {
      d = color.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    })
  )
  .enter()
  .append("rect")
  .attr("height", 8)
  .attr("x", function (d) {
    return x(d[0]);
  })
  .attr("width", function (d) {
    return x(d[1]) - x(d[0]);
  })
  .attr("fill", function (d) {
    return color(d[0]);
  });

g.append("text")
  .attr("class", "caption")
  .attr("x", x.range()[0])
  .attr("y", -6)
  .attr("fill", "#000")
  .attr("text-anchor", "start")
  .attr("font-weight", "bold")
  .text("Migration Rate");

g.call(
  d3
    .axisBottom(x)
    .tickSize(13)
    .tickFormat(function (x, i) {
      return i ? x : x + "%";
    })
    .tickValues(color.domain())
)
  .select(".domain")
  .remove();

var promises = [
  d3.json("https://d3js.org/us-10m.v1.json"),
  d3.csv("../data/net_migration.csv", function (d) {
    migration.set(d.code, +d.net_migration);
    county_names.set(d.code, d.county_name);
  }),
];

Promise.all(promises).then(ready);

function ready([us]) {
  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "translate(450,30)")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .text("2019 Migration Rate per US County");
  svg
    .append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append("path")
    .attr("fill", function (d) {
      console.log(migration.get(d.id));
      return color(migration.get(d.id));
    })
    .attr("d", path)
    .append("title")
    .text(function (d) {
      return county_names.get(d.id) + "\n" + migration.get(d.id) + "%";
    });

  svg
    .append("path")
    .datum(
      topojson.mesh(us, us.objects.states, function (a, b) {
        return a !== b;
      })
    )
    .attr("class", "states")
    .attr("d", path);
}
