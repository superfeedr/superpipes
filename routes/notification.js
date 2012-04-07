/*
 * POST /feed/:id Notification for a feed
 */

exports.notification = function(req, res){
    console.log(req.params.id);
    req.on('data', function (chunk) {
        console.log(chunk.toString());
    });
    res.send("Thanks");
};