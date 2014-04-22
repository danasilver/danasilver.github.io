---
layout: post
title: Last Letter of First Names
date: 2014-04-17 23:48:00 EST
---

<style>
form {
  font-weight: 300;
}
input[name='male'] {
  margin-left: 60px;
}
input[name='inyear'] {
  width: 590px;
}
output {
  font-size: 25px;
}
svg {
  font-size: 10px;
}
.bar {
  fill: steelblue;
}
.bar text {
  fill: #fff;
}
.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}
</style>

<form>
  <label>
    <input name="male" type="checkbox" checked disabled> Male
  </label>
  <label>
    <input name="female" type="checkbox" disabled> Female
  </label>
  <input name="inyear" type="range" value="1880" min="1880" max="2012" disabled>
  <output name="outyear">1880</output>
</form>
<svg></svg>

A D3 recreation of David Taylor's visualization [The meteoric rise of boys' names ending in 'n'](http://www.prooffreader.com/2014/04/baby-names-rise-of-n.html).

The chart shows the number of children born with names ending in each letter.  Adjust the slider to change the year.  Toggle the checkboxes to show boys, girls, or both.

### Data

The original dataset is the same used in the [Compare Historically Popular Names](/popular-names) visualization.  Of course, this visualization doesn't require every name &mdash; just the last letter of each name and its aggregate count.  The 28 MB [names dataset](/static/assets/historically-popular-names/names1880-2012.json) can be whittled down to a mere 80 KB [JSON file](/static/assets/last-letter/last-letter.json).

```py
import csv
import json

def main():
    output = {}

    # Initialize output
    for year in range(1880, 2013):
        output[year] = {'F': {}, 'M': {}}
        for letter in list(map(chr, range(97, 123))):
            output[year]['F'][letter] = 0
            output[year]['M'][letter] = 0

    reader = csv.reader(open('names1880-2012.csv', 'r'))
    reader.next()
    for row in reader:
        last_letter = row[0][-1]
        gender      = row[1]
        count       = int(row[2])
        year        = int(row[3])
        output[year][gender][last_letter] += count

    writer = open('last-letter.json', 'w')
    json.dump(output, writer)
    writer.close()
```

### Visualization

```js
var margin = {top: 10, right: 20, bottom: 40, left: 60},
    width = 840 - margin.left - margin.right,
    height = 470 - margin.top - margin.bottom,
    lettersArray = "abcdefghijklmnopqrstuvwxyz".split("");

var x = d3.scale.ordinal()
    .domain(lettersArray)
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var chart = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("/static/assets/last-letter/last-letter.json", function(letters) {
  y.domain(d3.extent(d3.entries(letters["1880"].M), function(d) { return d.value; }));

  var bar = chart.selectAll(".bar")
      .data(d3.entries(letters["1880"].M))
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(" + x(d.key) + ",0)"})
    .append("rect")    
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  var yAxisGroup = chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  chart.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".5em")
    .attr("transform", "rotate(-90)")
    .text("# Names");

  var input = d3.select("input[name='inyear']"),
      output = d3.select("output"),
      maleInput = d3.select("input[name='male']")
      femaleInput = d3.select("input[name='female']");

  input.on("input", function() { updateYear(input.node().value); });
  maleInput.on("change", function() { updateYear(input.node().value); });
  femaleInput.on("change", function() { updateYear(input.node().value); });

  function updateYear(year) {
    var data = {};
    if (maleInput.property("checked") && femaleInput.property("checked")) {
      for (key in letters[year].M) data[key] = letters[year].M[key] + letters[year].F[key];
    }
    else if (maleInput.property("checked")) data = letters[year].M;
    else if (femaleInput.property("checked")) data = letters[year].F;
    else for (key in lettersArray) data[key] = 0;

    output.text(year);
    y.domain(d3.extent(d3.entries(data), function(d) { return d.value; }));
    yAxis.scale(y);
    yAxisGroup.transition().duration(100).call(yAxis);
    bar.data(d3.entries(data)).transition().duration(100).call(resize);
  }

  function resize(bar) {
    bar .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });
  }

  var demo = setInterval(function() {
    var year = incrementYear();
    if (year >= 2012) {
      clearInterval(demo);
      d3.selectAll("input").attr("disabled", null);
    }
    input.node().value = year;
    updateYear(year);
  }, 100);

  var incrementYear = (function() { var x = 1880; return function() { return x++; }})();
});
```

<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script>
var margin = {top: 10, right: 20, bottom: 40, left: 60},
    width = 840 - margin.left - margin.right,
    height = 470 - margin.top - margin.bottom,
    lettersArray = "abcdefghijklmnopqrstuvwxyz".split("");

var x = d3.scale.ordinal()
    .domain(lettersArray)
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var chart = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("/static/assets/last-letter/last-letter.json", function(letters) {
  y.domain(d3.extent(d3.entries(letters["1880"].M), function(d) { return d.value; }));

  var bar = chart.selectAll(".bar")
      .data(d3.entries(letters["1880"].M))
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(" + x(d.key) + ",0)"})
    .append("rect")    
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  var yAxisGroup = chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  chart.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".5em")
    .attr("transform", "rotate(-90)")
    .text("# Names");

  var input = d3.select("input[name='inyear']"),
      output = d3.select("output"),
      maleInput = d3.select("input[name='male']")
      femaleInput = d3.select("input[name='female']");

  input.on("input", function() { updateYear(input.node().value); });
  maleInput.on("change", function() { updateYear(input.node().value); });
  femaleInput.on("change", function() { updateYear(input.node().value); });

  function updateYear(year) {
    var data = {};
    if (maleInput.property("checked") && femaleInput.property("checked")) {
      for (key in letters[year].M) data[key] = letters[year].M[key] + letters[year].F[key];
    }
    else if (maleInput.property("checked")) data = letters[year].M;
    else if (femaleInput.property("checked")) data = letters[year].F;
    else for (key in lettersArray) data[key] = 0;

    output.text(year);
    y.domain(d3.extent(d3.entries(data), function(d) { return d.value; }));
    yAxis.scale(y);
    yAxisGroup.transition().duration(100).call(yAxis);
    bar.data(d3.entries(data)).transition().duration(100).call(resize);
  }

  function resize(bar) {
    bar .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });
  }

  var demo = setInterval(function() {
    var year = incrementYear();
    if (year >= 2012) {
      clearInterval(demo);
      d3.selectAll("input").attr("disabled", null);
    }
    input.node().value = year;
    updateYear(year);
  }, 100);

  var incrementYear = (function() { var x = 1880; return function() { return x++; }})();
});
</script>
<img src="/static/assets/last-letter/last-letter.png" style="display:none;">