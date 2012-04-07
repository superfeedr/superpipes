# Superpipes

This is a [Yahoo! Pipes](http://pipes.yahoo.com/pipes/) equivalent built with [Superfeedr](http://superfeedr.com/), hosted on [Heroku](http://www.heroku.com/). We built that just in case Y! decides to "sunset" pipes as well...
Also, it's realtime, and can be tweaked in any way you want to fit your needs!

## Deploying

You need:
* One Heroku account
* To configure the "Redis To Go Addon":https://addons.heroku.com/redistogo
* To configure the "Superfeedr Addon":https://addons.heroku.com/superfeedr


## TODO

* Use https to susbcribe
* Implement signatures to verify origin of content (we can use a secret set in the heroku:config for example.)