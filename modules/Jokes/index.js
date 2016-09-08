var fs = require('fs');
var mommaJokes = fs.readFileSync(__dirname+'/momma-jokes.txt').toString().split('\n');

jokes = {
  name: 'jokes',
  helpText: '/jokes [name] - Tells a yo momma joke for name',
  defaultFunction: function(args, bot) {return jokes.do(args, bot)}   
};

jokes.do = function(args, bot){
  if(args.length < 1)
    bot.message(mommaJokes[Math.floor(Math.random() * mommaJokes.length)].replace(/yo mama/ig, "Johnny's Mom"));
  else
    bot.message(mommaJokes[Math.floor(Math.random() * mommaJokes.length)].replace(/yo mama/ig, args.join("")+"'s Mom"));
};

module.exports = jokes;