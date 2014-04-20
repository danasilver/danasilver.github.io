---
layout: post
title: Github Language Stats with d3.js
date: 2013-12-31 15:00:00 EST
---
## The [d3.js](http://d3js.org/) Bar Chart Tutorials with Github Data

These charts are largely based on the charts in Mike Bostock's [Let's Make a Bar Chart tutorial](http://bost.ocks.org/mike/bar/) with some modifications to use git repository language data from the Github API.

<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>

### Fetching the Data
I am using the language data from my [Github repository for this website](https://github.com/danasilver/danasilver.github.io). The Github API returns an object containing each language and the number of bytes of that language in the repository. I request the data using `d3.json` and call `makeChart(languageJSON)` on the response.  The code for the examples below is contained in `makeChart`.

```js
var url = "https://api.github.com/repos/danasilver/danasilver.github.io/languages";
d3.json(url, makeChart);

function makeChart(languageJSON) {

  // Format the data to work with D3
  var dataArray = [],
      dataKeyVal = [];

  for (lang in languageJSON) {
    dataArray.push(languageJSON[lang]);
  }

  for (lang in languageJSON) {
    dataKeyVal.push({"lang": lang, "bytes": languageJSON[lang]});
  }

  // Render charts

}
```

### Bar Chart

The value in each bar is the number of bytes of each language in the repository.  This chart, though rendered with D3, is pure HTML.  Each bar is a div element.

<style>
  .bar-chart div {
    background-color: #0086b3;
    text-align: right;
    padding: 3px;
    margin: 1px !important;
    color: white;
    font-size: 10px;
  }
</style>
<div class="bar-chart"></div>

```js
x = d3.scale.linear()
  .domain([0, d3.max(dataArray)])
  .range([0, 834]);

d3.select(".bar-chart")
  .selectAll("div")
    .data(dataArray)
  .enter().append("div")
    .style("width", function(d) { return x(d) + "px"; })
    .text(function(d) { return d; });
```

### SVG Bar Chart

> Scalable Vector Graphics (SVG) is an XML markup language for describing two-dimensional vector graphics. SVG is essentially to graphics what XHTML is to text.

[Mozilla Developer Network - SVG](https://developer.mozilla.org/en-US/docs/Web/SVG)

This chart looks identical but uses SVG instead of plain HTML.  Each bar is a [g (group) element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g), containing a [rect](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/rect) and a [text](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text) element.

<style>
  .bar-chart-svg rect {
    fill: #0086b3;
  }

  .bar-chart-svg text {
    fill: white;
    font-size: 10px;
    text-anchor: end;
  }
</style>

<svg class="bar-chart-svg"></svg>

```js
var width = 840,
    barHeight = 20;

var x = d3.scale.linear()
    .domain([0, d3.max(dataArray)])
    .range([0, width]);

var chart = d3.select(".bar-chart-svg")
    .attr("width", width)
    .attr("height", barHeight * dataArray.length);

var bar = chart.selectAll("g")
    .data(dataArray)
  .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

bar.append("rect")
    .attr("width", x)
    .attr("height", barHeight - 1);

bar.append("text")
    .attr("x", function(d) { return x(d) - 3; })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return d; });
```

### Vertical SVG Bar Chart

This chart, besides vertical orientation, features axes and labels to give the data context. I also did not hard code the bar widths this time, instead using D3's [ordinal.rangeRoundBands](https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal_rangeRoundBands) to compute the output range given minimum and maximum values.  `ordinal.rangeRoundBands` divides the range into _n_ evenly spaced bands, where _n_ is the number of unique values in the input domain (the number of languages, in this case).

<center>
<figure>
    <img src='/static/assets/d3-github-language-stats/range-bands.png' alt='ordinal.rangeBands illustration' />
    <figcaption>`ordinal.rangeBands` illustration from the d3.js wiki</figcaption>
</figure>
</center>

D3 provides [ordinal.rangeBands](https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal_rangeBands) and [ordinal.rangeRoundBands](https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal_rangeRoundBands). The two do the same, however `ordinal.rangeRoundBands` sets the width and offset values of each band to integers to avoid antialiasing artifacts.

<style>
  .vertical-bar-chart rect {
    fill: #0086b3;
  }
  .vertical-bar-chart rect:hover {
    fill: brown;
  }
  .vertical-bar-chart text {
    font-size: 10px;
    text-anchor: middle;
  }
  .vertical-bar-chart .bar text {
    fill: #FFF;
  }
  .axis text {
    font-size: 10px;
  }
  .axis path,
  .axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
  }
</style>
<svg class="vertical-bar-chart"></svg>

```js
var margin = {top: 10, right: 20, bottom: 20, left: 60},
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .domain(dataKeyVal.map(function(d) { return d.lang; } ))
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .domain([0, d3.max(dataKeyVal, function(d) { return d.bytes })])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var chart = d3.select(".vertical-bar-chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

chart.append("g")
    .attr("class", "y axis")
    .call(yAxis)

d3.select(".vertical-bar-chart").append("text")
    .style("text-anchor", "end")
    .attr("transform", "translate(15," + height / 2 + "), rotate(-90)")
    .text("Bytes");

var bar = chart.selectAll(".bar")
    .data(dataKeyVal)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.lang) + ",0)"; })
  
bar.append("rect")
    .attr("class", "bar")
    .attr("y", function(d) { return y(d.bytes); })
    .attr("height", function(d) { return height - y(d.bytes); })
    .attr("width", x.rangeBand())

bar.append("text")
    .attr("x", x.rangeBand() / 2)
    .attr("y", function(d) { return y(d.bytes) + 3; })
    .attr("dy", ".75em")
    .text(function(d) { return d.bytes; });
```

<script>
var url = "https://api.github.com/repos/danasilver/danasilver.github.io/languages";
d3.json(url, makeChart);

function makeChart(languageJSON) {
  var dataArray = [],
      dataKeyVal = [];

  for (lang in languageJSON) {
    dataArray.push(languageJSON[lang]);
  }

  for (lang in languageJSON) {
    dataKeyVal.push({"lang": lang, "bytes": languageJSON[lang]});
  }

  // Bar Chart

  x = d3.scale.linear()
    .domain([0, d3.max(dataArray)])
    .range([0, 834]);

  d3.select(".bar-chart")
    .selectAll("div")
      .data(dataArray)
    .enter().append("div")
      .style("width", function(d) { return x(d) + "px"; })
      .text(function(d) { return d; });

  // Bar Chart with SVG

  var width = 840,
      barHeight = 20;

  var x = d3.scale.linear()
      .domain([0, d3.max(dataArray)])
      .range([0, width]);

  var chart = d3.select(".bar-chart-svg")
      .attr("width", width)
      .attr("height", barHeight * dataArray.length);

  var bar = chart.selectAll("g")
      .data(dataArray)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

  bar.append("rect")
      .attr("width", x)
      .attr("height", barHeight - 1);

  bar.append("text")
      .attr("x", function(d) { return x(d) - 3; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d; });

  // Vertical Bar Chart

  var margin = {top: 10, right: 20, bottom: 20, left: 60},
      width = 500 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .domain(dataKeyVal.map(function(d) { return d.lang; } ))
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .domain([0, d3.max(dataKeyVal, function(d) { return d.bytes })])
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var chart = d3.select(".vertical-bar-chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)

  d3.select(".vertical-bar-chart").append("text")
      .style("text-anchor", "end")
      .attr("transform", "translate(15," + height / 2 + "), rotate(-90)")
      .text("Bytes");

  var bar = chart.selectAll(".bar")
      .data(dataKeyVal)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(" + x(d.lang) + ",0)"; })
    
  bar.append("rect")
      .attr("class", "bar")
      .attr("y", function(d) { return y(d.bytes); })
      .attr("height", function(d) { return height - y(d.bytes); })
      .attr("width", x.rangeBand())

  bar.append("text")
      .attr("x", x.rangeBand() / 2)
      .attr("y", function(d) { return y(d.bytes) + 3; })
      .attr("dy", ".75em")
      .text(function(d) { return d.bytes; });

}
</script>
