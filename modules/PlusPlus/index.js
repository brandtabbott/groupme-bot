var ppStats = [];

pp = {
  name: 'pp',
  helpText: '/pp [user]++ - PlusPlus a user\n*  /pp [user]-- - MinusMinus a user\n*  /pp stats - Shows PlusPlus stats',
  defaultFunction: function(args, bot) {return pp.do(args, bot)}   
};

pp.do = function(args, bot){
  if(args.length < 1)
    return;

  if(args.indexOf('/') != -1)
    return;

  args = args.join("");

  if(args.indexOf('++') != -1){    
    var user = args.replace(/\+\+*/, '');

    if(typeof ppStats[user] == 'undefined')
      ppStats[user] = 0;

    ppStats[user]++;
    bot.message("Nice! ["+user+" now at "+ppStats[user]+" points]");
  }
  else if(args.indexOf('--') != -1){
    var user = args.replace(/\-\-*/, '');    

    if(typeof ppStats[user] == 'undefined')
      ppStats[user] = 0;

    ppStats[user]--;
    bot.message("Ouch! ["+user+" now at "+ppStats[user]+" points]");
  }
};

pp.stats = function(args, bot){
  var stats = '';
  var keys = Object.keys(ppStats);
  for(x=0; x<keys.length; x++){
    stats += (keys[x] + ': '+ppStats[keys[x]]+', ');
  }
  bot.message(stats);
};

module.exports = pp;