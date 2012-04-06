/*
 * GET Atom: serves the Atom feed
 */

exports.atom = function(req, res){
  res.render('index', { title: 'Express' })
};