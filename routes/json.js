/*
 * GET JSON: serves the Atom feed
 */

exports.json = function(req, res){
  res.render('index', { title: 'Express' })
};