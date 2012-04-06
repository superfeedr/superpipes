var http = require('http'),
    querystring = require('querystring');

// Make sure you installed the Superfeedr plugin!
// $ heroku addons:add superfeedr
var auth = 'Basic ' + new Buffer(process.env.SUPERFEEDR_LOGIN + ':' + process.env.SUPERFEEDR_PASSWORD).toString('base64');

var options = {
  host: 'superfeedr.com',
  path: '/hubbub',
  method: 'POST',
  headers: {
      'Authorization': auth
  }
};

exports.subscribe = function(url, done) {
    
    if(typeof(process.env.APP_NAME) === "undefined") {
        console.error("Please set your application's name as an environment variable: heroku config:add APP_NAME=weird-name-1337");
    }
    
    
    var params = querystring.stringify({
        'hub.mode': 'subscribe',
        'hub.callback': 'http://mycallback.com/',
        'hub.topic': url
    })
    
    options.headers['Content-Length'] = params.length;
    
    var req = http.request(options, function(res) {
        if(res.statusCode === 401) {
            console.error("Make sure you have installed the Superfeedr plugin: $ heroku addons:add superfeedr");
        }
        else if(res.statusCode === 422) {
            res.on('data', function (chunk) {
                console.error(chunk.toString());    
            });
        }
        else if(res.statusCode === 204) {
            done(true);
        }
    });
    
    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });
    
    req.write(params);
    req.end();
};