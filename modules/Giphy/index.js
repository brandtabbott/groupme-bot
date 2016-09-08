var GIPHY_API_KEY = process.env['GIPHY_API_KEY'];

var giphyWrapper = require('giphy-wrapper')(GIPHY_API_KEY),
    util = require('util'),
    _ = require('underscore');

giphy = {
  name: 'giphy',
  helpText: '/giphy [search] - Search Giphy for search term',
  defaultFunction: function(args, bot) {return giphy.search(args, bot)} 
};

giphy.search = function(args, bot){
  console.log('module giphy.search '+args);
  giphyWrapper.search(escape(args.join('+')), 20, 0, function(err, data) {
    if(err) {
      console.error(err);
    }

    if(data.data.length) {
      data = _.shuffle(data.data);
      var id = data[0].id;
      var imageUrl = "http://media3.giphy.com/media/"+id+"/giphy.gif";      
      bot.message(imageUrl);
    }    
  });
}

module.exports = giphy;