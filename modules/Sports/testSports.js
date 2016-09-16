sportsModule = require('./');

console.message = console.log;

sportsModule.defaultFunction(null,console);
sportsModule.defaultFunction(['nfl'],console);
sportsModule.defaultFunction(['nba'],console);
sportsModule.defaultFunction(['mlb'],console);
sportsModule.defaultFunction(['nhl'],console);