/*
 * GET JSON: serves the Atom feed
 */
var entries = require("../models/entries.js");

exports.json = function(req, res){
    entries.fetch(req.params.id, function(err, entries) {
        // Here, we may want to sort, filter the feed based on what we want!
        res.header('Content-Type', 'application/json'); 
        res.send(entries);
    });
};