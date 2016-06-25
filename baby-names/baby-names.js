var data = {
  names: null,
  active: d3.set(),
  workingSet: function() {
    return this.active.values().map(function(key) {
      var sex = key.charAt(0),
          name = key.slice(1);

      return this.names.get(name).get(sex);
    }.bind(this));
  },
  cleanInput: function(input) {
    return input.split(/[,\s]+/)
    .map(function(name) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    })
    .filter(function(name) {
      return data.names.get(name);
    }.bind(this));
  }
};

d3.selectAll('input[type="checkbox"]')
  .on('click', function() {
    this.checked
      ? this.parentElement.classList.add('checked')
      : this.parentElement.classList.remove('checked');
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

var chart = d3.select('.interactive').append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
  .append('g')
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

d3.csv('names1880-2012.csv', type, function(names) {
  data.names = d3.nest()
      .key(function(d) { return d.name; })
      .key(function(d) { return d.gender; })
      .map(names, d3.map);
});

d3.select('.add-name').on('submit', function() {
  var names = data.cleanInput(d3.select('.add-name .name').node().value),
      m = d3.select('.add-name .sex.male input').node().checked,
      f = d3.select('.add-name .sex.female input').node().checked;

  d3.event.preventDefault();

  if (!m && !f) return flashCheckboxes();

  if (m) names.forEach(function(name) { data.active.add('M' + name); });
  if (f) names.forEach(function(name) { data.active.add('F' + name); });

  return update(data.workingSet());
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

function type(d) {
  return {
    year: new Date(+d.Year, 0, 1),
    count: +d.Count,
    name: d.Name,
    gender: d.Gender,
    key: d.Gender + d.Name
  };
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
