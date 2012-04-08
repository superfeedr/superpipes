/*
 * GET Atom: serves the Atom feed
 */
var entries = require("../models/entries.js");
var feeds = require("../config/feeds.js").feeds;

exports.html = function(req, res){
    var feed = feeds[req.params.id];
    if(!feed) {
        res.send('Not Found', 404);
    }
    else {
        entries.fetch(req.params.id, function(err, entries) {
            feed.title = [feed.name, "Aggregate feed built using superpipes"].join(" - ");
            feed.entries = entries;
            res.render('html', {id: req.params.id, feed: feed, layout: false})
        });
    }
};