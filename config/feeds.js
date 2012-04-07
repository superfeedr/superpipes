exports.feeds = {
    'first': { // Each feed needs to have an unique key.
        secret: 'this is the secret for my first agregate', // Optional but you should put a random sentence here to make things secure.
        name: "My very first agregate feed",
        sources: [
            "http://push-pub.appspot.com/feed",
            "http://techcrunch.com/feed/",
            "http://feeds.feedburner.com/ommalik",
            "http://feeds2.feedburner.com/thenextweb",
            "http://pandodaily.com/feed",
            "http://news.ycombinator.com/rss"
        ]
    },
    'profiles': {
        secret: 'another secret for my profiles feed', // Optional but you should put a random sentence here to make things secure.
        name: "This feed agregates some of my known profiles on the web.",
        sources: [
            "https://github.com/superfeedr.atom",
            "http://blog.msgboy.com/rss",
            "http://blog.superfeedr.com/atom",
            "http://superfeedr.tumblr.com/",
        ]
    }
}
