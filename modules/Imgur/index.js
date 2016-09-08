var IMGUR_API_KEY = process.env['IMGUR_API_KEY'],
  https = require('https');
  //querystring = require('querystring');

imgur = {
  name: 'imgur',
  helpText: '/imgur [search] - Search Imgur for search term',
  defaultFunction: function(args, bot) {return imgur.search(args, bot)} 
};

imgur.search = function(args, bot){
  console.log('module imgur.search '+args);

  var options = {
    host: 'api.imgur.com',
    path: '/3/gallery/search/top/all?q='+escape(args.join('+')),
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Client-ID '+IMGUR_API_KEY
    }
  };  
  
  var req = https.request(options, function(res){
    res.setEncoding('utf-8');
    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {      
      var response = JSON.parse(responseString);
      if(typeof(response.data) != 'undefined' && response.data.length > 0){
        var randomImage = response.data[Math.floor(Math.random()*response.data.length)];        
        bot.message(randomImage.link);
      }
    });

    res.on('error', function(error){
      console.error(error);
    });
  });
  req.end();
}

module.exports = imgur;