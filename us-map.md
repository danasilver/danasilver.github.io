---
layout: post
title: Map of the U.S.
date: 2014-03-11 13:30:00 EST
---

<style>
.state {
  fill: lightgrey;
  stroke: white;
  stroke-width: 1px;
  transition: fill .1s linear;
}

.state:hover {
  fill: coral;
  transition: fill .1s linear;
}

.overlay {
  fill: none;
}

.focus text {
  fill: black;
  font-weight: 600;
}
</style>

<svg></svg>

A simple demonstration of [TopoJSON](https://github.com/mbostock/topojson) and interactivity.  Mouseover to show the state's abbreviation and the latitude and longitude of the point.

### Visualization

In addition to [D3](http://d3js.org/d3.v3.min.js), this visualization relies on [TopoJSON](http://d3js.org/topojson.v1.min.js).  The map uses an [Albers USA](https://github.com/mbostock/d3/wiki/Geo-Projections#wiki-albersUsa) projection, for which Alaska is scaled by 0.35x, giving it a [lie factor](http://www.infovis-wiki.net/index.php?title=Lie_Factor) of 3.  On mousemoves, the corresponding state abbreviation in the data is shown, and the latitude and longitude is computed by [inverting](https://github.com/mbostock/d3/wiki/Geo-Projections#wiki-invert) the mouse position.

```js
var width = 840,
    height = 500;

var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("/static/assets/us-map/us2.json", function(error, us) {
  svg.selectAll(".state")
      .data(topojson.feature(us, us.objects.usStates).features)
    .enter()
      .append("path")
      .attr("class", "state")
      .attr("d", path)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", function(d) { 
        var pos = d3.mouse(this),
            latlng = projection.invert(pos);
        focus.select(".abbr").text(d.properties.STATE_ABBR);
        focus.select(".latlng").text("(" + d3.round(latlng[0], 2) + "\u00B0, "
                                         + d3.round(latlng[1], 2) + "\u00B0)");
        focus.attr("transform", "translate(" + pos[0] + "," + pos[1] + ")");
      });

  var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");
  
  focus.append("text")
      .attr("class", "abbr")
      .attr("x", -10)
      .attr("y", -30)
      .attr("dy", ".35em");

  focus.append("text")
      .attr("class", "latlng")
      .attr("x", -10)
      .attr("y", -13)
      .attr("dy", ".35em");
});
```

<img style="display:none;" src="/static/assets/us-map/us-map.png">

<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="http://d3js.org/topojson.v1.min.js"></script>

<script>

var width = 840,
    height = 500;

var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("/static/assets/us-map/us2.json", function(error, us) {
  svg.selectAll(".state")
      .data(topojson.feature(us, us.objects.usStates).features)
    .enter()
      .append("path")
      .attr("class", "state")
      .attr("d", path)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", function(d) { 
        var pos = d3.mouse(this),
            latlng = projection.invert(pos);
        focus.select(".abbr").text(d.properties.STATE_ABBR);
        focus.select(".latlng").text("(" + d3.round(latlng[0], 2) + "\u00B0, "
                                         + d3.round(latlng[1], 2) + "\u00B0)");
        focus.attr("transform", "translate(" + pos[0] + "," + pos[1] + ")");
      });

  var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");
  
  focus.append("text")
      .attr("class", "abbr")
      .attr("x", -10)
      .attr("y", -30)
      .attr("dy", ".35em");

  focus.append("text")
      .attr("class", "latlng")
      .attr("x", -10)
      .attr("y", -13)
      .attr("dy", ".35em");
});
</script>