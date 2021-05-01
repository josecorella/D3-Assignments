var width = 1200,
  height = 500;

var radius = d3.scale.sqrt().domain([0, 1e6]).range([0, 10]);

var path = d3.geo.path();

var keys = ["Top 10 Most Expensive States", "US States"];

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);
svg
  .append("text")
  .attr("font-family", "Arial, Helvetica, sans-serif")
  .attr("transform", "translate(450,30)")
  .style("text-anchor", "middle")
  .attr("fill", "black")
  .text("Population per State vs Expensive States");

queue()
  .defer(d3.json, "../data/us-all.json")
  .defer(d3.json, "../data/us-state-centroids.json")
  .await(ready);

function ready(error, us, centroid) {
  if (error) throw error;

  svg
    .selectAll("mydots")
    .data(keys)
    .enter()
    .append("circle")
    .attr("cx", 950)
    .attr("cy", function (d, i) {
      return 100 + i * 40;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 12)
    .style("fill", function (d, i) {
      if (i === 0) {
        return "rgb(0, 224, 37)";
      } else {
        return "rgb(70, 130, 180)";
      }
    });

  svg
    .selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
    .attr("x", 975)
    .attr("y", function (d, i) {
      return 100 + i * 45;
    })
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .style("alignment-baseline", "middle");

  svg
    .append("path")
    .attr("class", "states")
    .datum(topojson.feature(us, us.objects.states))
    .attr("d", path);

  svg
    .selectAll(".symbol")
    .data(
      centroid.features.sort(function (a, b) {
        return b.properties.population - a.properties.population;
      })
    )
    .enter()
    .append("path")
    .attr("class", "symbol")
    .attr(
      "d",
      path.pointRadius(function (d) {
        return radius(d.properties.population);
      })
    )
    .style("fill", function (d) {
      if (d.properties.hasOwnProperty("cost")) {
        return "rgb(0, 224, 37)";
      }
    })
    .append("title")
    .text(function (d) {
      nfObject = new Intl.NumberFormat("en-US");
      return (
        d.properties.name +
        "\n" +
        "Population: " +
        nfObject.format(d.properties.population)
      );
    });
}
