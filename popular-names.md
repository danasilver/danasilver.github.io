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

input#namesInput {
  width: calc(100% - 14px);
  height: 34px;
  border: 1px solid #999;
  padding: 3px 6px;
  outline: none;
  font-size: 18px;
}

input#chartUrl {
  width: calc(100% - 14px);
  height: 28px;
  border: 1px solid #999;
  outline: none;
  padding: 3px 6px;
  font-size: 14px;
  color: #666;
}

input:active, 
input:focus {
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

<input id="namesInput" type="text" placeholder="Enter comma separated names then press enter">

<div id="loading">
<div style="text-align:center;">Loading the data...</div>
<progress value="10" max="100"></progress>
</div>

<svg id="names"></svg>

<div class="chartUrlText">Share this chart: </div><input id="chartUrl" type="text" value="" readonly="readonly" onclick="this.select();">

<script>
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

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
d3.csv("/static/assets/historically-popular-names/names1880-2012.json", function(d) {
  return {
    year: new Date(+d.Year, 0, 1),
    count: +d.Count,
    name: d.Name + ", " + d.Gender,
  };
}, function(data) {
  allData = data;
  document.querySelector("#loading").innerHTML = "";

  paramNames = getParameterByName("names");
  if (paramNames === "") {
    makeChart("Jim, Pam, Stanley");
  } else {
    makeChart(paramNames);
  }
  
}).on("progress", function(e) {
  console.log(d3.event);
  if (d3.event.lengthComputable) {
    percent = (d3.event.loaded / d3.event.totalSize) * 100;
    document.querySelector("progress").value = percent;
  }
});

function makeChart(names) {
  var elToClear = document.querySelector("#names g");
  d3.selectAll("#names g g").remove();

  var namesArray = names.split(",").map(function(n) { return n.trim().toLowerCase(); }),
      namesArrayM = namesArray.map(function(n) { return n + ", m"}),
      namesArrayF = namesArray.map(function(n) { return n + ", f"}),

      namesSearchArray = namesArrayM.concat(namesArrayF);

  // replace the url
  var baseURL = window.location.protocol + "//" + window.location.host + window.location.pathname,
      newUrl = baseURL + "?names=" + namesArray.join(",");
  document.getElementById("chartUrl").value = newUrl;

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

### Making the Chart

#### Preparation

Margins, width, and height are standard.  Years are on the x-axis, so a [d3.time.scale](https://github.com/mbostock/d3/wiki/Time-Scales#wiki-scale) is appropriate.  Similarly, a [linear scale](https://github.com/mbostock/d3/wiki/Quantitative-Scales#wiki-linear) is appropriate for the number of names on the y-axis.  The [category10](https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-category10) ordinal scale will assign a color to each line.

The axes need minimal setup.  Each is scaled based on its respective x or y scale.  Each line is created by assigning its x values to the years of the individual data points and the y values to the number of names (count) of the individual data points.  Using a cardinal [interpolation](https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-line_interpolate) removes sharp tangents on the lines using a [cardinal spline](http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Cardinal_spline).

Finally, the svg element is given its height, width, and a inner group element to contain the actual chart.

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
```

#### Data

The data is hosted at [danasilver.org/static/assets/historically-popular-names/names1880-2012.json](http://danasilver.org/static/assets/historically-popular-names/names1880-2012.json).  (The CSV has a JSON extension so Github Pages will gzip it.)  I obtained it from my Computer Science Information Visualization course.  I request the data with [d3.csv](https://github.com/mbostock/d3/wiki/CSV), use an accessor method to format each data point, and use a callback to manipulate the data.

Saving all the loaded data to the variable `allData` makes it easy to make other charts based on user input without requesting the data each time.  The first time the data is loaded, I check if there is a `names` URL parameter from which to create the initial chart.  If `names` is empty, I use the placeholder "Jim, Pam, Stanley" to create the chart.

The `.on("progress")` listens for `d3.csv`'s [progress event](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent) and updates the progress bar.

```javascript
var allData;
d3.csv("/static/assets/historically-popular-names/names1880-2012.json", function(d) {
  return {
    year: new Date(+d.Year, 0, 1),
    count: +d.Count,
    name: d.Name + ", " + d.Gender,
  };
}, function(data) {
  allData = data;
  document.querySelector("#loading").innerHTML = "";

  paramNames = getParameterByName("names");
  if (paramNames === "") {
    makeChart("Jim, Pam, Stanley");
  } else {
    makeChart(paramNames);
  }
  
}).on("progress", function(e) {
  if (d3.event.lengthComputable) {
    percent = (d3.event.loaded / d3.event.totalSize) * 100;
    document.querySelector("progress").value = percent;
  }
});
```

#### Chart

For this application, it's useful to keep the chart logic in a separate function so it can be called each time the user enters some names.  This function takes a list of comma separated names as its only parameter.  It makes sense to annotate the source for this complicated and integral function rather than provide a high level overview.  The commented code is below.

```javascript
function makeChart(names) {

  // Crudely empty the contents of the chart
  document.querySelector("#names g").innerHTML = "";

  // Create an array from the string of comma separated names
  // One array is created with ', m' postpended to each name, the other
  // with ', f' to chart male and female names.
  // The male and female arrays are then concatenated.
  var namesArray = names.split(",").map(function(n) { return n.trim().toLowerCase(); }),
      namesArrayM = namesArray.map(function(n) { return n + ", m"}),
      namesArrayF = namesArray.map(function(n) { return n + ", f"}),
      namesSearchArray = namesArrayM.concat(namesArrayF);

  // Replace the share url with the new string of names
  var baseURL = window.location.protocol + "//" + window.location.host + window.location.pathname,
      newUrl = baseURL + "?names=" + namesArray.join(",");
  document.getElementById("chartUrl").value = newUrl;

  // Filter all the raw data using the names in name search array
  data = allData.filter(function(key) { return (namesSearchArray.indexOf(key.name.toLowerCase()) > -1) });

  // Nest the data based on name
  // This works similarly to SQL's GROUP BY, grouping all the elements with
  // the same key and listing the values for each distinct key.
  // More on nesting: https://github.com/mbostock/d3/wiki/Arrays#wiki-d3_nest
  data = d3.nest()
            .key(function(d) { return d.name; })
            .entries(data);

  // Sort the data by descending number of names (count)
  // The comparison keys (a and b) are names with associated data.
  // Sum all the counts for each name to obtain the total count for that name.
  // Though it has no bearing on the placement of the lines, this ensures the
  // names in the legend appear in order of decreasing total count.
  data.sort(function(a,b) {
    return d3.sum(b.values, function(d) { return d.count }) - d3.sum(a.values, function(d) { return d.count });
  });

  // Assign the domain of the colors ordinal scale to the 'name' key of each data group
  // Now each name will map to a color
  color.domain(d3.keys(data[0]).filter(function(key) { return key === "name"; }));

  // Assign the x domain using the minimum and maximum years for each line
  // This means the chart may not show all years, but will probably be easier to read
  x.domain([
    d3.min(data, function(d) { return d3.min(d.values, function(d) { return d.year }); }),
    d3.max(data, function(d) { return d3.max(d.values, function(d) { return d.year }); })
  ]);

  // Assign the y domain from 0 to the maximum count value of all the data points
  y.domain([0, d3.max(data, function(d) { return d3.max(d.values, function(d) { return d.count }); })]);

  // Create the visual x-axis at the bottom of the chart
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  // Create the visual y-axis at the bottom of the chart and append a label
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("# Names");

  // Create g element for each dataset
  // Each of these elements will contain a line
  var name = svg.selectAll(".name")
      .data(data, function(d) { return d.key; })
    .enter().append("g")
      .attr("class", "name");

  // Create the lines
  // The d attribute makes the actual line shape,
  // which comes from the line defined in the preparation
  // and is passed in the values from a particular line's dataset
  name.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values) })
      .style("stroke", function(d) { return color(d.key) })

  // Append a g element for the legend
  var legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(10,-10)");

  // Create a legend using the data
  // Each text element's offset is computed on the fly using 
  // the previous siblings' widths.
  // Text colors are obtained using the color ordinal scale.
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
```

