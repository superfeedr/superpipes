/*
 * POST /feed/:id Notification for a feed
 */
var entries = require("../models/entries.js");

exports.notification = function(req, res){
    // Yay, expressjs is smart enough to have parsed the json by himself!
    for(var i = 0; i < req.body.items.length; i++) {
        var entry = req.body.items[i];
        entry.source = {
            id: req.params.id,
            feed: req.body.status.feed,
            title: req.body.status.title
        }
        entries.save(req.params.id, entry, function() {
            // entry saved! Yay!
            // Here we want to emit an event on the application itself!
            process.emit("notification", {feed: req.params.id, entry: entry});
        });
    }
    res.send("Thanks");
};