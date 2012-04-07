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
      'Accept': 'application/json',
      'Authorization': auth
  }
};

exports.subscribe = function(url, done) {
    
    if(typeof(process.env.APP_NAME) === "undefined") {
        done("Please set your application's name as an environment variable: heroku config:add APP_NAME=weird-name-1337", url);
    } 
    
    var params = querystring.stringify({
        'hub.mode': 'subscribe',
        'hub.callback': 'http://' + process.env.APP_NAME + '/feed/' + new Buffer(url).toString('base64'),
        'hub.topic': url
    })
    
    options.headers['Content-Length'] = params.length;
    
    var req = http.request(options, function(res) {
        if(res.statusCode === 401) {
            done("Make sure you have installed the Superfeedr plugin: $ heroku addons:add superfeedr", url);
        }
        else if(res.statusCode === 422) {
            res.on('data', function (chunk) {
                done(chunk.toString(), url);
            });
        }
        else if(res.statusCode === 204) {
            done(null, url);
        }
    });
    
    req.on('error', function(e) {
      done(e.message, url);
    });
    
    req.write(params);
    req.end();
};