//constants
let margin = { top: 20, right: 30, bottom: 120, left: 40 };
const width = 1000 - margin.left - margin.right;
const height = 1000 - margin.top - margin.bottom;

//load data
d3.csv("../data/soc-firm-hi-tech.csv", function (d) {
  return {
    source: +d.source,
    target: +d.target,
  };
}).then(function (connect) {
  //data
  var nodes = [];
  var links = [];

  connect.forEach(function (data) {
    links.push({ source: data.source });
  });

  nodes = Array.from(new Set(links.map((d) => d.source))).map((source) => {
    return {
      id: source,
    };
  });

  //color scale
  let colorScale = d3.scaleOrdinal(d3.schemeDark2);

  //force simulation
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

  //canvas
  let svg = d3
    .select("body")
    .append("svg")
    .attr("width", 200 + width + margin.left + margin.right)
    .attr("height", 200 + width + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(connect)
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

  //simulation2
  simulation.nodes(nodes).on("tick", ticked);

  simulation.force("link").links(connect);

  //ticked
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
      .attr("r", 15)
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });
  }

  //drag
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.2).restart();
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
});
