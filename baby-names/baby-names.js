d3.selectAll('input[type="checkbox"]')
  .on('click', function() {
    d3.select(this.parentElement).classed('checked', this.checked);
  });

var margin = {top: 0, right: 10, bottom: 20, left: 40},
    height = 500 - margin.top - margin.bottom,
    width = 1030 - margin.left - margin.right;

var x = d3.time.scale()
    .domain([new Date(1880, 0, 1), new Date(2012, 0, 1)])
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickFormat(d3.format('s'));

var color = d3.scale.category10();

var line = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.count); });

var area = d3.svg.area()
    .x(function(d) { return x(d.year); })
    .y0(height)
    .y1(function(d) { return y(d.count); });

var svg = d3.select('.interactive').append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)

var loader = spinner(svg);
var delay = 1000;

setTimeout(function() {
  data.getIndex().on('load.stopspin', function() {
    loader.interrupt();
    loader.remove();
    [
      function() { data.add(['Pam'], false, true, update); },
      function() { data.add(['Jim', 'Stanley'], true, false, update); },
      function() { data.add(['Phyllis'], false, true, update); },
    ].map(function(f) {
      setTimeout(f, delay);
      delay *= 2;
    });
  });
}, 3000);

var chart = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

chart.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')');

chart.append('g')
    .attr('class', 'y axis')
  .append('text')
    .attr('class', 'hidden')
    .attr('transform', 'rotate(-90)')
    .attr('dy', '1em')
    .style('text-anchor', 'end')
    .text('# names');

var linesAreas = chart.append('g');

var tooltip = chart.append('g')
    .attr('class', 'tooltip');

tooltip.append('line')
  .attr('x1', 0)
  .attr('x2', 0)
  .attr('y1', 0);

chart.append('rect')
    .attr('class', 'overlay')
    .attr('width', width)
    .attr('height', height)
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .on("mousemove", mousemove);

function mouseover() {
  tooltip.style("display", null);
}

function mouseout() {
  tooltip.style("display", "none");
}

function mousemove() {
  if (!data.workingSet().length) return;

  var years = d3.range(1880, 2013),
      bisect = d3.bisector(function(d) { return d; }).left,
      x0 = x.invert(d3.mouse(this)[0]).getFullYear(),
      i = bisect(years, x0, 1),
      d0 = years[i - 1],
      d1 = years[i],
      year = x0 - d0 > d1 - x0 ? d1 : d0 - 1;

  var tooltipNames = data.workingSet()
    .map(function(name) {
      return name.find(function(d) { return d.year.getFullYear() === year; });
    })
    .filter(function(d) { return !!d; })
    .sort(function(a, b) { return b.count - a.count; });

  if (data.tooltipped !== year) {
    data.tooltipped = year;
    updateTooltip(tooltipNames);
    update(data.workingSet());
  }
}

var key = d3.select('div.names');

d3.select('.add-name').on('submit', function() {
  var names = data.cleanInput(d3.select('.add-name .name').node().value),
      m = d3.select('.add-name .sex.male input').node().checked,
      f = d3.select('.add-name .sex.female input').node().checked;

  d3.event.preventDefault();

  if (!m && !f) return flashCheckboxes();

  data.add(names, m, f, update);
});

function update(subset) {
  y.domain([0, d3.max(subset, function(values) {
    return d3.max(values, function(d) { return d.count; });
  })]);

  var names = linesAreas.selectAll('.name')
      .data(subset, function(d) { return d[0].key; });

  names
      .select('path.line')
      .transition()
      .style('stroke', function(d) { return color(d[0].key)})
      .attr('d', line);

  names
      .select('path.area')
      .transition()
      .style('fill', function(d) { return color(d[0].key)})
      .attr('d', area);

  if (data.tooltipped && subset.length > 1) {
    function byYear(d) { return d.year.getFullYear() === data.tooltipped; }

    names = names.sort(function(a, b) {
      return (a.find(byYear) || {count: 0}).count -
             (b.find(byYear) || {count: 0}).count;
    });
  }

  var enter = names.enter()
      .append('g')
      .attr('class', 'name');

  enter
      .append('path')
      .attr('class', 'line')
      .transition().delay(500).duration(0)
      .attr('d', line)
      .style('stroke', function(d) { return color(d[0].key); });

  enter
      .append('path')
      .attr('class', 'area')
      .transition().delay(500).duration(0)
      .attr('d', area)
      .style('fill', function(d) { return color(d[0].key); });

  names.exit().remove();

  chart.select('.x.axis')
      .call(xAxis);

  if (subset.length)
    chart.select('.y.axis')
        .transition()
        .call(yAxis);

  chart.select('.y.axis text')
      .classed('hidden', !subset.length);

  var labels = key.selectAll('.name')
    .data(subset, function(d) { return d[0].key; });

  var enteringLabels = labels.enter().append('div')
      .attr('class', 'name')
      .attr('title', function(d) {
        return d[0].name + ', ' + (d[0].gender === 'M' ? 'male' : 'female');
      })
      .style('border-color', function(d) { return color(d[0].key); });

  enteringLabels.append('span')
      .attr('class', 'remove')
      .attr('title', 'Remove')
      .html('✕')
      .on('click', function() {
        data.active.remove(d3.select(this).datum()[0].key);
        return update(data.workingSet());
      });

  enteringLabels.append('span')
      .html(function(d) {
        return d[0].name + ' ' + (d[0].gender === 'M' ? '&male;' : '&female;');
      });

  labels.exit().remove();
}

function updateTooltip(data) {
  var lineHeight = 14,
      textHeight = data.length * lineHeight,
      xOffset = data.length ? x(data[0].year) : 0,
      yOffset = Math.max(0, d3.min(data, function(d) { return y(d.count); }) - textHeight);

  tooltip
      .transition().duration(50)
      .attr('transform', 'translate(' + xOffset + ',' + yOffset + ')');

  var text = tooltip.selectAll('text')
      .data(data, function(d) { return d.key; });

  text.enter().append('text')
      .attr('fill', function(d) { return color(d.key); });

  text.attr('dx', 5)
      .transition()
      .attr('y', function(d, i) { return i * lineHeight; })
      .text(function(d) { return d3.format('.2s')(d.count) + ' ' + d.name; });

  text.exit().remove();

  tooltip.select('line')
      .transition().duration(50)
      .attr('y1', -10)
      .attr('y2', height - yOffset);
}

function flashCheckboxes() {
  d3.selectAll('.sex')
    .transition().duration(300)
    .style('border-color', 'rgb(221, 46, 0)')
    .transition().duration(500).delay(300)
    .style('border-color', 'rgb(230, 230, 230)')
    .transition()
    .style('border-color', null);
}
