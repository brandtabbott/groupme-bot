var TUMBLER_API_KEY = process.env['TUMBLER_API_KEY'],
  https = require('https');
  //querystring = require('querystring');

melons = {
  name: 'melons',
  helpText: '/melons [fresh|variety|peaches|beach|yoga|fit|inked] - You guys like em',
  defaultFunction: function(args, bot) {return melons.getFeed(args, bot)}
};

melons.getFeed = function(args, bot){
  var feed = '';
  var feeds = {
    beach: 'sexyhotbeachandpoolbabes',
    fit:    'sexyhottonedbabes',
    fresh:  'sexyhotracks',
    inked:   'sexyhottats',
    melons: 'justcleavage',
    peaches:  'sexyhotbutts',
    variety: 'everythingifindsexyaboutwomen',
    yoga:   'sexyhotyogapants',
  };

  if(args==null || args.length < 1)
    feed = feeds['melons'];
  else
    feed = 'fresh variety peaches beach yoga fit inked'.indexOf(args[0].trim()) == -1 ? feeds['melons'] : feeds[args[0].trim()];

  melons._go(feed,bot);
};

melons._go = function(feed, bot){
  var options = {
    host: 'api.tumblr.com',
    path: '/v2/blog/'+feed+'.tumblr.com/posts/photo?api_key='+TUMBLER_API_KEY+'&offset='+Math.floor(Math.random()*500),
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  var req = https.request(options, function(res){
    res.setEncoding('utf-8');
    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      var response = JSON.parse(responseString).response;
      if(typeof(response.posts) != 'undefined' && response.posts.length > 0){
        var randomImage = response.posts[Math.floor(Math.random()*response.posts.length)].photos[0].original_size.url;
        bot.message(randomImage);
      }
    });

    res.on('error', function(error){
      console.error(error);
    });
  });
  req.end();
}

module.exports = melons;