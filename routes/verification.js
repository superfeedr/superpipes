/*
 * GET /feed/:id Verified the intent for a feed.
 */
var feeds = require('../config/feeds.js').feeds;

exports.verification = function(req, res){
    if(req.query['hub.mode'] === "subscribe" && feeds[req.params.id] === req.query['hub.topic']) {
        res.send(req.query['hub.challenge']);
    }
    else {
        res.send("Nope, can't confirm that");
    }
};