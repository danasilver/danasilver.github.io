---
layout: post
title: First Ionization Energies
date: 2014-03-10 21:34:00 EST
---

<style>
svg {
  font: 10px sans-serif;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.line {
  fill: none;
  stroke: purple;
  stroke-width: 1.5px;
}

.overlay {
  fill: none;
  pointer-events: all;
}

.focus circle {
  fill: none;
  stroke: black;
}

.focus text {
  font: 13px sans-serif;
}
</style>

The first ionization energy is the energy required to remove one electron from an atom in its gaseous state.  This energy is measured in kJ/mol.  From the chart we can observe periodic trends and inconsistencies.  Mouseover the chart to view individual elements.

<svg></svg>

### Data

I retrieved the data from Wikipedia's [Molar ionization energies of the elements](http://en.wikipedia.org/wiki/Molar_ionization_energies_of_the_elements) article, which lists the 1st through 30th ionization energies for the applicable elements.  The first ionization energy is the only one that is applicable to all the elements.  I scraped the data in the browser console using jQuery already running on the page and copied the result to a [JSON file](/static/assets/first-ionization-energies/i1.json).

```js
var tds = [];

$(".wikitable.sortable.jquery-tablesorter tr").each(function(i) {
  if (i !== 0) {
    tds.push({"number": $(this).find("td")[0].innerText, 
              "symbol": $(this).find("td")[1].innerText, 
              "name": $(this).find("td")[2].innerText, 
              "i1": $(this).find("td")[3].innerText });
  }
});

JSON.stringify(tds);
```

### Visualization

The chart setup is standard, with the exception of a wide right margin to accomodate the mouseover text for the last few elements.  The x and y scales are linear.  The y axis maps the first ionization energy as a dependent factor of the atomic number on the x axis.

After requesting the data, mapping it to the x and y scales, and drawing the line, I create the mouseover components using two [g elements](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g): one for the element details in the upper right corner and one for the text that follows the line.  I detect the data point that corresponds to the mouse position using a [D3 bisector](https://github.com/mbostock/d3/wiki/Arrays#wiki-d3_bisector) then add the associated text.

```js
var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 840 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.number); })
    .y(function(d) { return y(d.i1); });

var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("/static/assets/first-ionization-energies/i1.json", function(error, data) {
  data.forEach(function(d) {
    d.number = +d.number;
    d.i1 = +d.i1;
    d.name = d.name.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  });

  x.domain(d3.extent(data, function(d) { return d.number; }));
  y.domain(d3.extent(data, function(d) { return d.i1; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .text("Atomic #");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2 + 60)
      .attr("y", -50)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("First Ionization Energy (kJ/mol)");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus.append("circle")
      .attr("r", 4.5);

  focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

  var element = svg.append("g")
      .attr("transform", "translate(" + (width - 10) + ",0)")
  
  element.append("text")
      .attr("class", "symbol")
      .style("font", "24px sans-serif")
      .attr("transform", "translate(0, 12)");

  element.append("text")
      .attr("class", "name")
      .attr("transform", "translate(0, 27)")
      .style("font", "12px sans-serif");

  element.append("text")
      .attr("class", "i1")
      .attr("transform", "translate(0, 42)")
      .style("font", "12px sans-serif");

  svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { focus.style("display", null); element.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); element.style("display", "none"); })
      .on("mousemove", mousemove);

  function mousemove() {
    var bisect = d3.bisector(function(d) { return d.number }).left,
        x0 = x.invert(d3.mouse(this)[0]),
        i = bisect(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i];
        d = x0 - d0.number > d1.number - x0 ? d1 : d0;

    focus.attr("transform", "translate(" + x(d.number) + "," + y(d.i1) + ")");
    focus.select("text").text(d.symbol + ", " + d.i1);

    element.select(".symbol").text(d.symbol);
    element.select(".name").text(d.name);
    element.select(".i1").text(d.i1 + " kJ/mol");
  }
});
```


<img style="display:none;" src="/static/assets/first-ionization-energies/i1.png">

<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>

<script>
var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 840 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.number); })
    .y(function(d) { return y(d.i1); });

var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("/static/assets/first-ionization-energies/i1.json", function(error, data) {
  data.forEach(function(d) {
    d.number = +d.number;
    d.i1 = +d.i1;
    d.name = d.name.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  });

  x.domain(d3.extent(data, function(d) { return d.number; }));
  y.domain(d3.extent(data, function(d) { return d.i1; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .text("Atomic #");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2 + 60)
      .attr("y", -50)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("First Ionization Energy (kJ/mol)");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus.append("circle")
      .attr("r", 4.5);

  focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

  var element = svg.append("g")
      .attr("transform", "translate(" + (width - 10) + ",0)")
  
  element.append("text")
      .attr("class", "symbol")
      .style("font", "24px sans-serif")
      .attr("transform", "translate(0, 12)");

  element.append("text")
      .attr("class", "name")
      .attr("transform", "translate(0, 27)")
      .style("font", "12px sans-serif");

  element.append("text")
      .attr("class", "i1")
      .attr("transform", "translate(0, 42)")
      .style("font", "12px sans-serif");

  svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { focus.style("display", null); element.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); element.style("display", "none"); })
      .on("mousemove", mousemove);

  function mousemove() {
    var bisect = d3.bisector(function(d) { return d.number }).left,
        x0 = x.invert(d3.mouse(this)[0]),
        i = bisect(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i];
        d = x0 - d0.number > d1.number - x0 ? d1 : d0;

    focus.attr("transform", "translate(" + x(d.number) + "," + y(d.i1) + ")");
    focus.select("text").text(d.symbol + ", " + d.i1);

    element.select(".symbol").text(d.symbol);
    element.select(".name").text(d.name);
    element.select(".i1").text(d.i1 + " kJ/mol");
  }
});
</script>