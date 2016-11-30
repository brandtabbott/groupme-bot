var TUMBLER_API_KEY = process.env['TUMBLER_API_KEY'],
  https = require('https');
  //querystring = require('querystring');

melons = {
  name: 'melons',
  helpText: '/melons - You guys like em',
  defaultFunction: function(args, bot) {return melons.go(args, bot)} 
};

melons.go = function(args, bot){  
  var options = {
    host: 'api.tumblr.com',
    path: '/v2/blog/justcleavage.tumblr.com/posts/photo?api_key='+TUMBLER_API_KEY+'&offset='+Math.floor(Math.random()*500),
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