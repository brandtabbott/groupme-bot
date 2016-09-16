var http = require('http');

sports = {
  name: 'sports',
  helpText: '/sports [nfl|nba|mlb|nhl] - Shows sports schedules/scores',
  defaultFunction: function(args, bot) {return sports.getSport(args, bot)}   
};

sports.getSport = function(args, bot){
  var sport = '';
  
  if(args==null || args.length < 1)
    sport = 'nfl';
  else
    sport = 'nfl nba mlb nhl'.indexOf(args[0].trim()) == -1 ? 'nfl' : args[0].trim();

  console.log('Retrieving '+sport+'...');
  sports._retrieve(sport,bot);
};

sports._retrieve = function(sport,bot){
  var options = {
    host: 'www.espn.com',
    path: '/'+sport+'/bottomline/scores',
    method: 'GET'
  };  
  
  var req = http.request(options, function(res){
    res.setEncoding('utf-8');
    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {        
      bot.message(sport.toUpperCase()+' schedules/scores:\n'+sports._parse(responseString));
    });

    res.on('error', function(error){
      console.error(error);
    });
  });
  req.end();
};

sports._parse = function(responseString){
  var parsedSearch = responseString.split('&');
  var finalText = '';
  parsedSearch.forEach(function(param){
    var text = unescape(param);
    if(text.indexOf('left')!=-1){
      text = text.replace('^', '');
      text = text.replace(/.*left.*\=/, '');
      text = text.replace(/\s\s+/g, ' ');
      finalText += text + '\n';      
    }
  });
  return finalText;  
};

module.exports = sports;
