var _ = require('underscore');
var flattener = require('../lib/flattener.js');
var feeds = require('../config/feeds.js').feeds;


var redis = require("redis").createClient();
var rtg   = require("url").parse(process.env.REDISTOGO_URL);
var redis = require("redis").createClient(rtg.port, rtg.hostname);
if(rtg.auth) {
    redis.auth(rtg.auth.split(":")[1]); // Auth.
}

module.exports = {
    save: function(entry, callback) {
        var flat = flattener.flatten(entry);
        redis.hmset("e:" + entry.id, flat, function(err, result) {
            if(err) {
                callback(err, result)
            }
            else {
                redis.zadd("f:" + entry.source.id, entry.postedTime, entry.id, function(err, result) {
                    callback(err, result);
                });
            }
        });
    },
    fetch: function(callback) {
        var agreg = [];
        var done = _.after(feeds.length, function() {
            callback(null, agreg);
        })  

        for(var i=0; i<feeds.length; i++) {
            var feed = new Buffer(feeds[i]).toString('base64');
            redis.zrange("f:" + feed, 0, 10, function(err, ids) {
                if(err) {
                    done(); // Unsuccessul!
                }
                else {
                    if(ids.length > 0) {
                        var doneWithOne = _.after(ids.length, function() {
                            done();
                        });
                        for(var j = 0; j < ids.length; j++) {
                            redis.hgetall("e:" + ids[j], function(err, result) {
                                var expanded = flattener.expand(result);
                                agreg.push(expanded);
                                doneWithOne();
                            });
                        }
                    }
                    else {
                        done();
                    }
                }
            });
        }
    }
}