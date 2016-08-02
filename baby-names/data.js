var serviceUrl = location.hostname === 'localhost'
  ? 'http://localhost:3000/'
  : 'http://baby-names-service.danasilver.org/';

var data = {
  names: d3.map(),

  active: d3.set(),

  index: null,

  workingSet: function() {
    return this.active.values().map(function(key) {
      return this.names.get(key)
    }.bind(this));
  },

  add: function(names, m, f, cb) {
    var urls = this.urls(names, m, f),
        q = d3.queue();

    urls.forEach(function(url) {
      q.defer(d3.json, url);
    });

    q.awaitAll(function(error, results) {
      if (error) throw error;

      results = [].concat.apply([], results).map(type);

      var nest = d3.nest()
          .key(function(d) { return d.key; })
          .map(results, d3.map);

      nest.forEach(function(k, v) { this.names.set(k, v); }.bind(this));
      results.forEach(function(d) { this.active.add(d.key); }.bind(this));

      cb(this.workingSet());
    }.bind(this));
  },

  urls: function(names, m, f) {
    var urls = [];
    for (var i = 0; i < names.length; i++) {
      if (m) urls.push(serviceUrl + names[i] + '/M');
      if (f) urls.push(serviceUrl + names[i] + '/F');
    }

    return urls.filter(function(url) {
      var parts = url.split('/'),
          name = parts[3],
          gender = parts[4];

      return this.index.get(name).get(gender);
    }.bind(this));
  },

  cleanInput: function(input) {
    return input.split(/[,\s]+/)
    .map(function(name) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    })
    .filter(function(name) {
      return this.index.get(name);
    }.bind(this));
  },

  getIndex: function() {
    return d3.json(serviceUrl + 'index')
    .get()
    .on('load.index', function(index) {
      var nested = d3.nest()
          .key(function(d) { return d.name; })
          .key(function(d) { return d.gender; })
          .map(index, d3.map);

      this.index = nested;
    }.bind(this));
  }
};

function type(d) {
  return {
    year: new Date(+d.year, 0, 1),
    count: +d.count,
    name: d.name,
    gender: d.gender,
    key: d.gender + d.name
  };
}
