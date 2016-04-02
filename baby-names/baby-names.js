d3.selectAll('input[type="checkbox"]')
  .on('click', function() {
    this.checked
      ? this.parentElement.classList.add('checked')
      : this.parentElement.classList.remove('checked');
  });

var margin = {top: 0, right: 0, bottom: 0, left: 0},
    height = 600 - margin.top - margin.bottom,
    width = 1030 - margin.left - margin.right;

var x = d3.time.scale()
    .domain([new Date(1880, 0, 1), new Date(2012, 0, 1)])
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var line = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.count); });

var chart = d3.select('.interactive').append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.csv('//files.danasilver.org/names1880-2012.csv', type, function(names) {
  names = d3.nest()
      .key(function(d) { return d.name; })
      .key(function(d) { return d.gender; })
      .map(names, d3.map);

  update([names.get('Pam').get('F'), names.get('Jim').get('M')]);

  setTimeout(function() {
    update([names.get('Pam').get('F'), names.get('Jim').get('M'), names.get('Michael').get('M'), names.get('Toby').get('M')])
  }, 2000);
});

function update(subset) {
  y.domain([0, d3.max(subset, function(values) {
    return d3.max(values, function(d) { return d.count; });
  })]);

  color.domain(d3.map(subset, function(d) { return d[0].key; }));

  var names = chart.selectAll('.name')
      .data(subset, function(d) { return d[0].key; });

  names
      .select('path')
      .transition()
      .attr('d', line)
      .style('stroke', function(d) { return color(d[0].key); });

  names.enter().append('g')
      .attr('class', 'name')
      .append('path')
      .transition().delay(500).duration(0)
      .attr('d', line)
      .style('stroke', function(d) { return color(d[0].key); });

  names.exit().remove();
}

function type(d) {
  return {
    year: new Date(+d.Year, 0, 1),
    count: +d.Count,
    name: d.Name,
    gender: d.Gender,
    key: d.Name + d.Gender
  };
}
