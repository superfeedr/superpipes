
/**
 * Module dependencies.
 */

var express     = require('express'),
    socketio    = require('socket.io'),
    subscribe   = require('./lib/subscriber.js').subscribe;
    feeds       = require('./config/feeds.js').feeds;

var app = module.exports = express.createServer();
var io = socketio.listen(app);


// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/',                    require('./routes/index.js').index);
app.get('/:id/atom',            require('./routes/atom.js').atom); // Serves the agregated feed as Atom
app.get('/:id/json',            require('./routes/json.js').json); // Serves the agregated feed as json. Supports the optional jsonp argument
app.get('/:id',                 require('./routes/html.js').html); // Serves the agregated feed as html. 
app.get('/feed/:id/:feedId',    require('./routes/verification.js').verification); // PubSubhubbub verification mechanism
app.post('/feed/:id/:feedId',   require('./routes/notification.js').notification); // PubSubHubbub notification mechanism

// Socket.io
io.sockets.on('connection', function (socket) {
    var notif = function(obj) {
        socket.emit('notification', obj);
    }
    process.on('notification', notif);
    
    socket.on('disconnect', function () {
        process.removeListener('notification', notif);
    });
});




app.listen(process.env.PORT);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// When starting, we need to subscribe to all the feeds in the configuration.
for (var i in feeds) {
    for(var j = 0; j < feeds[i].sources.length; j++) {
        var url = feeds[i].sources[j];
        subscribe(url, i, feeds[i], function(err, url) {
            if(err) {
                console.error(err);
            }
            else {
                console.log("Subscribed to", url);
            }
        });
    }
}