help = {
  name: 'help',
  helpText: '/help - displays this help message',
  defaultFunction: function(args, bot) {return help.displayHelp(args, bot)}   
}

help.displayHelp = function(args, bot){
  var helpTexts = BOT_NAME+'\n';

  for(var c = 0; c<modules.length; c++){
    helpTexts+=modules.helpText=='undefined' ? '' : '*  '+modules[c].helpText+'\n'; 
  }

  bot.message(helpTexts);
}

module.exports = help;