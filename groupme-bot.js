var TOKEN = process.env['GROUPME_API_KEY'],
  GROUP = process.env['GROUPME_GROUP_ID'],
  NAME = process.env['GROUPME_BOT_NAME'] || '',
  URL = process.env['CALLBACK_URL'],
  AVATAR = process.env['GROUPME_AVATAR_URL'] || '',  
  CONFIG = {token:TOKEN, group:GROUP, name:NAME, url:URL, avatar_url:AVATAR};

var util = require('util');
var fancy = require('fancy-groupme-bot');
var groupMeBot = fancy(CONFIG);

BOT_NAME = NAME;

modules = [
  destinyModule = require('./modules/Destiny'),
  giphyModule = require('./modules/Giphy'),
  jokesModule = require('./modules/Jokes'),
  helpModule = require('./modules/Help'),
  imgurModule = require('./modules/Imgur'),
  plusPlusModule = require('./modules/PlusPlus'),
  xblModule = require('./modules/XBL')
],

groupMeBot.on('botRegistered', function(b) {
  console.log('Registered with GroupMe');  
});

groupMeBot.on('botMessage', function(b, message) {  
  if(message.name == b.name){
    return;
  }

  var command = null;

  //Begins with "/" followed by the full bot name
  //Ex: /foo bot command args
  if(message.text.match(new RegExp('^\/'+NAME+'\\s', 'i'))){
    command = message.text.replace(new RegExp('^\/'+NAME+'\\s', 'i'), '');
  }
  //Begins with "/" followed by the first word of the bot name
  //Ex: /foo command args
  else if(message.text.match(new RegExp('^\/'+NAME.split(' ')[0]+'\\s.*', 'i'))){
    command = message.text.replace(new RegExp('^\/'+NAME.split(' ')[0]+'\\s', 'i'), '');
  }
  //Begins with "/" followed by a command
  //Ex: /command args  
  else if(message.text.match(new RegExp('^\/', 'i'))){
    command = message.text.replace(new RegExp('^\/', 'i'), '');
  }
  else{
    return;
  }

  try{    
    commandToExec = command.split(" ")[0].toLowerCase();
    commandFunc = typeof(command.split(" ")[1]) == 'undefined' ? '' : command.split(" ")[1].toLowerCase();
    commandArgs = command.split(" ").slice(2);

    //Determine if the commandToExec is any of the modules.  If not, then return    
    var commandToExecInModules = modules.filter(function(m){      
      if (m && m.name != 'undefined') {
        return m.name===commandToExec;
      }
      return false;
    });

    if(commandToExecInModules.length < 1){
      console.error('Module '+commandToExec+' not found in modules');
      return;
    }

    //Determine if the commandFunc is a function on the module.  If not, then call the defaultFunction defined
    if(commandFunc.length <1 || !(typeof(eval(commandToExec.valueOf()+'.'+commandFunc.valueOf())) === 'function')){

      //If defaultFunction doesn't exist, then there is nothing to do, return
      if(typeof(eval(commandToExec.valueOf()+'.defaultFunction')) === 'function'){     
        commandFunc = "defaultFunction";   
        commandArgs = command.split(" ").slice(1);
      }
      else{
        console.error('defaultFunction not found on module '+commandToExec);
        return;
      }
    }

    //Execute the module
    console.log('Executing '+commandToExec+' module - '+commandFunc+' with arguments '+commandArgs);
    eval(commandToExec.valueOf()+'.'+commandFunc.valueOf()+'.call(null, commandArgs, b)');
  }
  catch(err){
    console.error('Bot Received An Invalid command: '+command);
    console.error('Exiting with error '+err);
    return;
  }  
});

console.log('Bot Initialized.');
groupMeBot.serve(process.env.PORT || 8080);