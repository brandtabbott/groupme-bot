var XBOX_API_KEY = process.env['XBOX_API_KEY'];
var GROUP_GAMERTAGS = process.env['GROUP_GAMERTAGS'];
var OWNER_XUID = process.env['OWNER_XUID'];

var xbox = require('node-xbox')(XBOX_API_KEY);

xbl = {
  name: 'xbl',
  helpText: '/xbl [gamertag] - Shows XBL info for gamertag\n*  /xbl status - Shows members online',
  defaultFunction: function(args, bot) {return xbl.do(args, bot)}   
};

xbl.do = function(args, bot){
  if(args.length < 1)
    return;
  
  var gtag = args.join(" ");
  var self = this;

  xbox.profile.xuid(gtag, function(err, xuid){
    if(err){
      bot.message("Bad gamertag: "+gtag+" fool.");
      return;
    }

    xbox.profile.presence(xuid, function(err, presence){
      if(presence){
        console.log(presence);
        var p = JSON.parse(presence);                
        var playing = xbl._getPlaying(p);

        if(playing != ''){
          bot.message(gtag+" -\nStatus: Online\nPlaying: "+playing);          
        }
        //Offline/Unknown
        else{
          var played = ((typeof p.lastSeen == 'undefined') || (typeof p.lastSeen.titleName == 'undefined')) ? 'Unknown' : p.lastSeen.titleName;
          var last = ((typeof p.lastSeen == 'undefined') || (typeof p.lastSeen.timestamp == 'undefined')) ? 'Unknown' : p.lastSeen.timestamp;
          bot.message(gtag+" -\nStatus: Offline\nLast played: "+played+"\nLast online: "+last);
        }
      }
    });
  });    
};

xbl.status = function(args, bot){  
  //["PeepshowJanitor", "TDG BullDog", "Boog1eMan X", "CataclysmicFate", "ColtCowboy", "Ghost TDG", "GiantLakeOfire", "Jawgoosh", "JohnnyBoyFloyd", "KLimax47", "Kuppy JR", "Mac79PR", "Mits TDG", "ProtoCull", "So Fuzzy", "Tat2XL", "TATTERR", "TDG Vash", "Wicked Oso TDG"];
  var group_members = GROUP_GAMERTAGS.split(',');  
  var group_playing = '';
  var numberCompleted = 0;
  var self = this;

  xbox.profile.friends(OWNER_XUID, function(err, f){
    var friends = JSON.parse(f);

    friends.forEach(function(friend){
      if(group_members.indexOf(friend.Gamertag) != -1){        
        var xuid = friend.id;

        //Get the user's presence
        xbox.profile.presence(xuid, function(err, presence){
          console.log(presence);

          var p = JSON.parse(presence);
          var member_playing = xbl._getPlaying(p);

          //Add Online user's status
          if(member_playing != '')
            group_playing += friend.Gamertag+' - Playing: '+member_playing+'\n';

          numberCompleted++;
          if(numberCompleted == group_members.length)
            bot.message('XBL Memebers Online:\n'+group_playing);                                                                                    
        }); 
      }
    });
  });
};

xbl._getPlaying = function(p){
  var state = typeof p.state == 'undefined' ? 'Unknown' : p.state;
  var member_playing = '';
  //Online
  if("Online" === state){    
    //Devices
    if(typeof p.devices != 'undefined' && p.devices.length > 0){            
      for(var device = 0; device < p.devices.length; device++){
        if('XboxOne' == p.devices[device].type){
          //Titles
          if(typeof p.devices[device].titles != 'undefined' && p.devices[device].titles.length > 0)
          for(var title = 0; title < p.devices[device].titles.length; title++){
            //What's in the full window
            if('Full' == p.devices[device].titles[title].placement){
              member_playing = p.devices[device].titles[title].name;
            }
            //Rich presence if available
            if(typeof p.devices[device].titles[title].activity != 'undefined'){
              member_playing += ' - '+p.devices[device].titles[title].activity.richPresence;
            }
          }
        }
      }
    }        
  }
  return member_playing;
};

module.exports = xbl;