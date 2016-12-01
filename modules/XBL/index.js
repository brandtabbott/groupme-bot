var GROUP_GAMERTAGS = process.env['GROUP_GAMERTAGS'];
var XBOX_LOGIN = process.env['XBOX_LOGIN'];
var XBOX_PASSWORD = process.env['XBOX_PASSWORD'];
var Nightmare = require('nightmare');
var cheerio = require("cheerio");
var gamerListSelector = '[class=gamerList]';

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
  var nightmare = Nightmare({ show: false });
  
  nightmare
    .goto('https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=13&ct=1480444953&rver=6.5.6509.0&wp=MBI_SSL&wreply=https:%2F%2Faccount.xbox.com:443%2Fpassport%2FsetCookies.ashx%3Frru%3Dhttps%253a%252f%252faccount.xbox.com%252fen-US%252fAccount%252fSignin%253freturnUrl%253dhttp%25253a%25252f%25252fwww.xbox.com%25252fen-US%25252f%25253fxr%25253dmebarnav%2526pcexp%253dtrue%2526uictx%253dme&lc=1033&id=292543&cbcxt=0')
    .insert('form[action*="/post"] [name=loginfmt]', XBOX_LOGIN)
    .click('form[action*="/post"] [value="Next"]')  
    .wait(1000)
    .insert('form[action*="/post"] [name=passwd]', XBOX_PASSWORD)
    .click('form[action*="/post"] [value="Sign in"]')  
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
        var gamerTag = li.attr("data-gamertag");
        var info = li.find(".primaryInfo").text();
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
