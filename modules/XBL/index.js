var GROUP_GAMERTAGS = process.env['GROUP_GAMERTAGS'];
var XBOX_LOGIN = process.env['XBOX_LOGIN'];
var XBOX_PASSWORD = process.env['XBOX_PASSWORD'];
var Nightmare = require('nightmare');
var cheerio = require("cheerio");
var gamerListSelector = '[class=friendList]';

xbl = {
  name: 'xbl',
  helpText: '/xbl [gamertag] - Shows XBL info for gamertag\n*  /xbl status - Shows members online',
  defaultFunction: function(args, bot) {return xbl.do(args, bot)}
};

xbl.do = function(args, bot){
};

xbl.status = function(args, bot){
  var group_members = GROUP_GAMERTAGS.split(',');
  var group_playing = '';
  var nightmare = Nightmare({
    show: true,
    switches: {
      'ignore-certificate-errors': true
    }
  });

  nightmare
    .goto('https://login.live.com')
    .insert('input[name=loginfmt]', XBOX_LOGIN)
    .click('input[value="Next"]')
    .wait(5000)
    .insert('input[name=passwd]', XBOX_PASSWORD)
    .click('input[value="Sign in"]')
    .wait(2000)
    .goto('https://account.xbox.com/en-US/Friends')
    .wait(gamerListSelector)
    .evaluate(function(gamerListSelector) {
      //browser scope.
      return document.querySelector(gamerListSelector).innerHTML;
     }, gamerListSelector)
    .end()
    .then(function(text) {
      var $ = cheerio.load(text);
      $("ul > li").each(function(){
        var li = $(this);
        var gamerTag = li.find(".xboxprofileinfo").find('span.name').text();
        var info = li.find(".metadatatext").text() || 'Home';
        if(!info.startsWith('Offline') && !info.startsWith('Last seen') && group_members.indexOf(gamerTag) != -1)
          group_playing = group_playing + gamerTag+': '+info+'\n';
      });
      bot.message(group_playing);
    })
    .catch(function (error) {
      console.error('Search failed:', error);
    });
};

module.exports = xbl;
