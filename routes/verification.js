/*
 * GET /feed/:id Verified the intent for a feed.
 */
var feeds = require('../config/feeds.js').feeds;

exports.verification = function(req, res) {
    var feed = feeds[req.params.id];
    if(req.query['hub.mode'] === "subscribe" && feed && req.params.feedId === new Buffer(req.query['hub.topic']).toString('base64')) {
        res.send(req.query['hub.challenge']);
    }
    else {
        res.send("Nope, can't confirm that");
    }
};