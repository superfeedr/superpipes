var _ = require('underscore');
var flattener = require('../lib/flattener.js');
var feeds = require('../config/feeds.js').feeds;

var rtg   = require("url").parse(process.env.REDISTOGO_URL);
var redis = require("redis").createClient(rtg.port, rtg.hostname);
if(rtg.auth) {
    redis.auth(rtg.auth.split(":")[1]); // Auth.
}

//
// This is custome to the redistogo datastore
// Entries are stored:
// - thru their key in a zset for each agregate feed
// - as a hash
// We have to setup a very late expiration key for all hashes
// since redistogo uses volatile-lru as maxmemory-policy
// this way, when we run out of memory
// We delete the entries in the very distant future first.
// By default, zset can store up to 100 entries each. 
// That should be plenty and should avoid that we bump into too many isues.
// TODO: how many agregate feeds can we store in a 5 MB datatbase?

module.exports = {
    save: function(feed, entry, callback) {
        var flat = flattener.flatten(entry);
        var entryKey = ["e", feed, entry.id].join(":");
        redis.hmset(entryKey, flat, function(err, result) {
            if(err) {
                callback(err, result)
            }
            else {
                // Stored the key successfuly. Let's put it a very late expiration (10 years). Please note that 
                // The actual expiration doesn't matter, as they will never expire, but be deleted by redis's volatile-lru 
                // policy
                redis.expire(entryKey, 60 * 60 * 24 * 365 * 10);
                // And also store the key in the feed's zset
                var feedKey = ["f", feed].join(":");
                redis.zadd(feedKey , entry.postedTime, entry.id, function(err, result) {
                    callback(err, result);
                    // We also need to truncate the zset to only store 100 entries at most.
                    // 
                    redis.zremrangebyrank(feedKey, -1000,  -101, function(err, result) {
                        // Ok done.
                    }
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