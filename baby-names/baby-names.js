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

  var names = chart.selectAll('.name')
      .data(subset, function(d) { return d[0].key; });

  names
      .select('path')
      .transition()
      .style('stroke', function(d) { return color(d[0].key)})
      .attr('d', line);

  names.enter().append('g')
      .attr('class', 'name')
      .append('path')
      .transition().delay(500).duration(0)
      .attr('d', line)
      .style('stroke', function(d) { return color(d[0].key); });

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

function flashCheckboxes() {
  d3.selectAll('.sex')
    .transition().duration(300)
    .style('border-color', 'rgb(221, 46, 0)')
    .transition().duration(500).delay(300)
    .style('border-color', 'rgb(230, 230, 230)')
    .transition()
    .style('border-color', null);
}
