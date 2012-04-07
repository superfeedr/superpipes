/*
 * GET Atom: serves the Atom feed
 */
var entries = require("../models/entries.js");

exports.atom = function(req, res){
    entries.fetch(req.params.id, function(err, entries) {
        var feed = {};
        feed.title = "Aggregate feed built using superpipes";
        feed.entries = entries;
        res.header('Content-Type', 'application/atom+xml'); 
        res.render('atom', {id: req.params.id, feed: feed, layout: false})
    });
};