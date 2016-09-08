var BUNGIE_API_KEY = process.env['BUNGIE_API_KEY'];

var destinyClient = require('destiny-client')({
  apiKey:BUNGIE_API_KEY
});

destiny = {
  name: 'destiny',
  helpText: '/destiny [gamertag] - Shows Destiny stats for gamertag',
  defaultFunction: function(args, bot) {return destiny.stats(args, bot)} 
}

destiny.stats = function(args, bot){
  console.log('module destiny.stats '+args);
  var name = args.join('');

  destinyClient.Search({
    membershipType: 1,
    name: name
  }).then(function(membership) {
    //console.log('membership:',membership);
    if(membership && membership.length < 1){      
      bot.message('No Destiny user found with name: '+name);
    }
    
    var membershipId = membership[0].membershipId;

    destinyClient.Account({    
      membershipType: 1,
      membershipId: membershipId
    }).then(function(account){
      //console.log('account:',account);
      if(account && account.characters.length < 1){
        bot.message('No Destiny characters found for member: '+membershipId);
      }

      account.characters.forEach(function(character){ 
        //console.log('character:'+character);           
        var characterId = character.characterBase.characterId;

        destinyClient.Character({
          membershipType: 1,
          membershipId: membershipId,
          characterId: characterId
        }).then(function(character){
          bot.message('Player: '+name+'\n'+'Character Level: '+character.characterLevel+'\n'+
          'Character Light Level: '+character.characterBase.powerLevel+'\n'+
          'Last Played: '+character.characterBase.dateLastPlayed+'\n'+
          'Time Played: '+Math.round(character.characterBase.minutesPlayedTotal/60)+' hours');
        });      
      });            
    });    
  }).catch(function(err){
    console.error('Destiny API Error: ',err);
  });      
}

module.exports = destiny;