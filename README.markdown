# Superpipes

This is a [Yahoo! Pipes](http://pipes.yahoo.com/pipes/) equivalent built with [Superfeedr](http://superfeedr.com/), hosted on [Heroku](http://www.heroku.com/). We built that just in case Y! decides to "sunset" pipes as well...
Also, it's realtime, and can be tweaked in any way you want to fit your needs!


## Deploying

You need:

* One [Heroku](http://www.heroku.com/) account
* To configure the [Redis To Go Addon](https://addons.heroku.com/redistogo)
* To configure the [Superfeedr Addon](https://addons.heroku.com/superfeedr). *Only available to beta testers*

### Clone

### Configure

### Deploy

### Profit


## TODO

* Use https to susbcribe
* Implement signatures to verify origin of content (we can use a secret set in the heroku:config for example.)
* Support for multiple agregates
* Make sure we do not depend on the feed's order in the config file!
* Add an HTML view (with a socket.io backend?)
* Make sure the generated feeds are PubSubHubbub enabled as well
* Allow for an XMPP retrieval if an XMPP server is provided to connect to