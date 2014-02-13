---
layout: post
title: Compare Historically Popular Names
date: 2014-02-11 15:00:00 EST
---

<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>

<style>
#names {
  font: 10px sans-serif;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.axis.x path {
  display: none;
}

.line {
  fill: none;
  stroke-width: 1.5px;
}

input {
  width: 826px;
  height: 34px;
  border: 1px solid #999;
  padding: 3px 6px;
  outline: none;
  font-size: 18px;
}
input:active, input:focus {
  border-color: #0086b3;
}

.legend text {
  padding-right: 5px;
  font: 14px sans-serif;
}
progress {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
}

progress[value]::-webkit-progress-bar {
  background-color: #E5E5E5;
}

progress[value]::-webkit-progress-value {
  background-color: #0086B3;
}

</style>

<input id="namesInput" type="text" placeholder="Enter up to 5 comma separated names then press enter">

<div id="loading">
<div style="text-align:center;">Loading the data...</div>
<progress value="10" max="100"></progress>
</div>

<svg id="names"></svg>

<script>
var margin = {top: 30, right: 0, bottom: 30, left: 50},
    width = 840 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

var line = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) { return x(d.year) })
    .y(function(d) { return y(d.count) });

var svg = d3.select("#names")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var allData;
d3.csv("/static/assets/historically-popular-names/names1880-2012.csv", function(d) {
  return {
    year: new Date(+d.Year, 0, 1),
    count: +d.Count,
    name: d.Name + ", " + d.Gender,
  };
}, function(data) {
  allData = data;
  document.querySelector("#loading").innerHTML = "";
  makeChart("Jim, Pam, Stanley");
}).on("progress", function(e) {
  if (d3.event.lengthComputable) {
    percent = (d3.event.loaded / d3.event.totalSize) * 100;
    document.querySelector("progress").value = percent;
  }
});

function makeChart(names) {
  document.querySelector("#names g").innerHTML = "";

  var namesArray = names.split(",").map(function(n) { return n.trim().toLowerCase(); });
  namesArrayM = namesArray.map(function(n) { return n + ", m"});
  namesArrayF = namesArray.map(function(n) { return n + ", f"});

  namesSearchArray = namesArrayM.concat(namesArrayF);

  data = allData.filter(function(key) { return (namesSearchArray.indexOf(key.name.toLowerCase()) > -1) });

  data = d3.nest()
            .key(function(d) { return d.name; })
            // .key(function(d) { return d.gender; })
            .entries(data);

  data.sort(function(a,b) {
    return d3.sum(b.values, function(d) { return d.count }) - d3.sum(a.values, function(d) { return d.count });
  });

  color.domain(d3.keys(data[0]).filter(function(key) { return key === "name"; }));

  x.domain([
    d3.min(data, function(d) { return d3.min(d.values, function(d) { return d.year }); }),
    d3.max(data, function(d) { return d3.max(d.values, function(d) { return d.year }); })
  ]);

  y.domain([0, d3.max(data, function(d) { return d3.max(d.values, function(d) { return d.count }); })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("# Names");

  var name = svg.selectAll(".name")
      .data(data, function(d) { return d.key; })
    .enter().append("g")
      .attr("class", "name");

  name.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values) })
      .style("stroke", function(d) { return color(d.key) })

  var legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(10,-10)");

  var sumOffsets = 0;
  legend.selectAll(".label")
      .data(data)
    .enter().append("text")
      .text(function(d) { return d.key; })
      .attr("transform", function(d) { 
        var offset = this.previousSibling ? this.previousSibling.getBBox().width : 0;
        sumOffsets += offset + 10;
        return "translate(" + sumOffsets + ",0)";
      })
      .attr("fill", function(d) { return color(d.key); });
}

d3.select("#namesInput").on("keypress", function() {
  if (d3.event.keyCode === 13 || d3.event.which === 13) {
    makeChart(this.value);
    _gaq.push(['_trackEvent', 'Compare Names', 'Submit', this.value.toString()]);
  }
});

</script>

```javascript
var margin = {top: 30, right: 0, bottom: 30, left: 50},
    width = 840 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

var line = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) { return x(d.year) })
    .y(function(d) { return y(d.count) });

var svg = d3.select("#names")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var allData;
d3.csv("/static/assets/historically-popular-names/names1880-2012.csv", function(d) {
  return {
    year: new Date(+d.Year, 0, 1),
    count: +d.Count,
    name: d.Name + ", " + d.Gender,
  };
}, function(data) {
  allData = data;
  makeChart("Jim, Pam, Stanley");
});

function makeChart(names) {
  document.querySelector("#names g").innerHTML = "";

  var namesArray = names.split(",").map(function(n) { return n.trim(); });
  namesArrayM = namesArray.map(function(n) { return n + ", M"});
  namesArrayF = namesArray.map(function(n) { return n + ", F"});

  namesSearchArray = namesArrayM.concat(namesArrayF);

  data = allData.filter(function(key) { return (namesSearchArray.indexOf(key.name) > -1) });

  data = d3.nest()
            .key(function(d) { return d.name; })
            .entries(data);

  data.sort(function(a,b) {
    return d3.sum(b.values, function(d) { return d.count }) - d3.sum(a.values, function(d) { return d.count });
  });

  color.domain(d3.keys(data[0]).filter(function(key) { return key === "name"; }));

  x.domain([
    d3.min(data, function(d) { return d3.min(d.values, function(d) { return d.year }); }),
    d3.max(data, function(d) { return d3.max(d.values, function(d) { return d.year }); })
  ]);

  y.domain([0, d3.max(data, function(d) { return d3.max(d.values, function(d) { return d.count }); })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("# Names");

  var name = svg.selectAll(".name")
      .data(data, function(d) { return d.key; })
    .enter().append("g")
      .attr("class", "name");

  name.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values) })
      .style("stroke", function(d) { return color(d.key) })

  var legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(10,-10)");

  var sumOffsets = 0;
  legend.selectAll(".label")
      .data(data)
    .enter().append("text")
      .text(function(d) { return d.key; })
      .attr("transform", function(d) { 
        var offset = this.previousSibling ? this.previousSibling.getBBox().width : 0;
        sumOffsets += offset + 10;
        return "translate(" + sumOffsets + ",0)";
      })
      .attr("fill", function(d) { return color(d.key); });
}

d3.select("#namesInput").on("keypress", function() {
  if (d3.event.keyCode === 13 || d3.event.which === 13) {
    makeChart(this.value);
  }
});
```

