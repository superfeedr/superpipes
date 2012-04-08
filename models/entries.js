var _ = require('underscore');
var flattener = require('../lib/flattener.js');
var feeds = require('../config/feeds.js').feeds;

var rtg   = require("url").parse(process.env.REDISTOGO_URL);
var redis = require("redis").createClient(rtg.port, rtg.hostname);
if(rtg.auth) {
    redis.auth(rtg.auth.split(":")[1]); // Auth.
}

module.exports = {
    save: function(feed, entry, callback) {
        var flat = flattener.flatten(entry);
        redis.hmset("e:" + feed + ':' + entry.id, flat, function(err, result) {
            if(err) {
                callback(err, result)
            }
            else {
                redis.zadd("f:" + feed , entry.postedTime, entry.id, function(err, result) {
                    callback(err, result);
                });
            }
        });
    },
    fetch: function(feed, callback) {
        var agreg = [];
        var f = feeds[feed];
        redis.zrevrange("f:" + feed, 0, 10, function(err, ids) {
            if(err) {
                callback(err, agreg);
            }
            else {
                if(ids.length > 0) {
                    var doneWithOne = _.after(ids.length, function() {
                        callback(null, agreg);
                    });
                    for(var j = 0; j < ids.length; j++) {
                        redis.hgetall("e:" + feed + ':' + ids[j], function(err, result) {
                            var expanded = flattener.expand(result);
                            agreg.push(expanded);
                            doneWithOne();
                        });
                    }
                }
                else {
                    callback(null, agreg);
                }
            }
        });
    }
}