/*
 * GET Atom: serves the Atom feed
 */
var entries = require("../models/entries.js");
var feeds = require("../config/feeds.js").feeds;

exports.atom = function(req, res){
    var feed = feeds[req.params.id];
    entries.fetch(req.params.id, function(err, entries) {
        feed.title = "Aggregate feed built using superpipes";
        feed.entries = entries;
        res.header('Content-Type', 'application/atom+xml'); 
        res.render('atom', {id: req.params.id, feed: feed, layout: false})
    });
};