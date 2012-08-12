(function() {

  require('zappa')(function() {
    var flatPlaces, places, placesC, routes, _u,
      _this = this;
    routes = require('./routes');
    placesC = require('./places/places.js');
    _u = require('underscore');
    places = placesC.collection;
    flatPlaces = function() {
      return _u.chain(places.tables).map(function(table) {
        return table.places;
      }).flatten().value();
    };
    this.use('bodyParser', 'methodOverride', this.app.router, this.express["static"](__dirname + '/public'));
    this.configure({
      development: function() {
        return _this.use({
          errorHandler: {
            dumpExceptions: true
          }
        });
      },
      production: function() {
        return _this.use('errorHandler');
      }
    });
    this.set('views', __dirname + '/views');
    this.set('view engine', 'ejs');
    this.get({
      '/': function() {
        return routes.index(this.request, this.response);
      }
    });
    this.get({
      '/recepcao': function() {
        return this.render('reception.ejs');
      }
    });
    this.get({
      '/salao1': function() {
        return this.render('blocks.ejs');
      }
    });
    this.get({
      '/lugares.json': function() {
        return this.response.send(places);
      }
    });
    this.get({
      '/livres.json': function() {
        return this.response.send(_u.chain(flatPlaces()).filter(function(place) {
          return place.occupied === false;
        }).value());
      }
    });
    this.get({
      '/ocupados.json': function() {
        return this.response.send(_u.chain(flatPlaces()).flatten().filter(function(place) {
          return place.occupied === true;
        }).value());
      }
    });
    this.post({
      '/ocupar': function() {
        var occupiedPlaces;
        occupiedPlaces = this.request.param('places', 'null');
        console.log(occupiedPlaces);
        _u.each(occupiedPlaces, function(id) {
          var place;
          place = _u.find(flatPlaces(), function(place) {
            return place.id * 1 === id * 1;
          });
          return place.occupied = true;
        });
        return this.response.send('ok');
      }
    });
    return this.post({
      '/liberar': function() {
        var freePlaces;
        freePlaces = this.request.param('places', 'null');
        console.log(freePlaces);
        _u.each(freePlaces, function(id) {
          var place;
          place = _u.find(flatPlaces(), function(place) {
            return place.id * 1 === id * 1;
          });
          return place.occupied = false;
        });
        return this.response.send('ok');
      }
    });
  });

}).call(this);