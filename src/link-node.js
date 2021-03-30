//constants
let margin = { top: 20, right: 30, bottom: 120, left: 40 };
const width = 1000 - margin.left - margin.right;
const height = 1000 - margin.top - margin.bottom;
var connections = [];

d3.csv("../data/soc-firm-hi-tech.csv", function (d) {
  connections.push({
    source: +d.source,
    target: +d.target,
  });
}).then(() => {
  main();
});

function main() {
  var nodes = [];
  var links = [];

  connections.forEach(function (data) {
    links.push({ source: data.source });
  });

  nodes = Array.from(new Set(links.map((d) => d.source))).map((source) => {
    return {
      id: source,
    };
  });

  let colorScale = d3
    .scaleOrdinal(d3.schemeDark2)
    .domain([d3.min(nodes), d3.max(nodes)]);
  var legend = d3
    .legendColor()
    .title("Color Legend")
    .titleWidth(100)
    .scale(colorScale);

  let simulation = d3
    .forceSimulation()
    .force("charge", d3.forceManyBody().strength(-600))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force(
      "link",
      d3.forceLink().id(function (d) {
        return d.id;
      })
    );

  let svg = d3
    .select("body")
    .append("svg")
    .attr("width", 200 + width + margin.left + margin.right)
    .attr("height", 200 + width + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  svg
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("x", width / 2)
    .attr("y", 50)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font", "25px")
    .attr("fill", "black")
    .text("Force Directed Layout Node Link Diagram");

  var link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(connections)
    .enter()
    .append("line")
    .attr("stroke", "black");

  var node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 4)
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    )
    .attr("fill", function (d) {
      return colorScale(d.id);
    })
    .style("stroke-width", 2)
    .style("stroke", "black");
  // svg
  //   .append("g")
  //   .attr("transform", "translate(1000,100)")
  //   .attr("font-family", "Arial, Helvetica, sans-serif")
  //   .call(legend);

  simulation.nodes(nodes).on("tick", ticked);

  simulation.force("link").links(connections);

  function ticked() {
    link
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });

    node
      .attr("r", 8)
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });
  }

  function dragstarted(event, d) {
    if (!event.active) {
      simulation.alphaTarget(0.2).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) {
      simulation.alphaTarget(0);
    }
    d.fx = null;
    d.fy = null;
  }
}
