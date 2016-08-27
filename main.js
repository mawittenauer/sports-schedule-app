var NFL_TEAM_COLORS = {
  "Bears" : "#C83803", "Bengals" : "#FB4F14", "Bills" : "#00338D", "Broncos" : "#FB4F14", "Browns" : "#FB4F14", 
  "Buccaneers" : "#D50A0A", "Cardinals" : "#97233F", "Chargers" : "#0073CF", "Chiefs" : "#E31837", "Colts" : "#002C5F", 
  "Cowboys" : "#002244", "Dolphins" : "#008E97", "Eagles" : "#004953", "Falcons" : "#A71930", "Fortyniners" : "#AA0000", 
  "Giants" : "#0B2265", "Jaguars" : "#006778", "Jets" : "#203731", "Lions" : "#005A8B", "Packers" : "#203731",
  "Panthers" : "#0085CA", "Patriots" : "#002244", "Raiders" : "#A5ACAF", "Rams" : "#002244", "Ravens" : "#241773", 
  "Redskins" : "#773141", "Saints" : "#9F8958", "Seahawks" : "#002244", "Steelers" : "#FFB612", "Texans" : "#03202F", 
  "Titans" : "#4B92DB", "Vikings" : "#4F2683"
};

var NBA_TEAM_COLORS = {
  "Hawks" : "#E13A3E", "Celtics" : "#008348", "Nets" : "#061922", "Hornets" : "#1D1160", "Bulls" : "#CE1141",
  "Caveliers" : "#FDBB30", "Mavericks" : "#007DC5", "Nuggets" : "#4D90CD", "Pistons" : "#ED174C", "Warriors" : "#FDB927",
  "Rockets" : "#CE1141", "Pacers" : "#FFC633", "Clippers" : "#ED1744C", "Lakers" : "#552582", "Grizzlies" : "#0F586C",
  "Heat" : "#98002E", "Bucks" : "#00471B", "Timberwolves" : "#005083", "Pelicans" : "#002B5C", "Knicks" : "#006BB6",
  "Thunder" : "#007DC3", "Magic" : "#007DC5", "76ERS" : "#ED174C", "Suns" : "#E56020", "Trail Blazers" : "#E03A3E",
  "Kings" : "#724C9F", "Spurs" : "#BAC3C9", "Raptors" : "#CE1141", "Jazz" : "#002B5C", "Wizards" : "#002B5C"
};

var MLB_TEAM_COLORS = { 
  "Indians" : "#E31937", "Diamondbacks" : "#A71930", "Braves" : "#CE1141", "Orioles" : "#DF4601", "Red Sox" : "#BD3039", 
  "Cubs" : "#CC3433", "White Sox" : "#000000", "Reds" : "#C6011F", "Rockies" : "#333366", "Tigers" : "#0C2C56", 
  "Astros" : "#002D62", "Royals" : "#004687", "Angels" : "#003263", "Dodgers" : "#EF3E42", "Marlins" : "#FF6600", 
  "Brewers" : "#0A2351", "Twins" : "#002B5C", "Mets" : "#FF5910", "Yankees" : "#E4002B", "Athletics" : "#003831", 
  "Phillies" : "#284898", "Pirates" : "#FDB827", "Padres" : "#002D62", "Giants" : "#FD5A1E", "Mariners" : "#0C2C56", 
  "Cardinals" : "#C41E3A", "Rays" : "#092C5C", "Rangers" : "#C0111F", "Blue Jays" : "#134A8E", "Nationals" : "#AB0003"
};

var LEAGUES = [ "NFL", "MLB", "NBA" ];

var NFL_TEAMS = Object.keys(NFL_TEAM_COLORS);
var MLB_TEAMS = Object.keys(MLB_TEAM_COLORS);
var NBA_TEAMS = Object.keys(NBA_TEAM_COLORS)

function getFormattedTime(fourDigitTime) {
    var hours24 = parseInt(fourDigitTime.substring(0, 2), 10);
    var hours = ((hours24 + 11) % 12) + 1;
    var amPm = hours24 > 11 ? 'pm' : 'am';
    var minutes = fourDigitTime.substring(2);

    return hours + ':' + minutes + amPm;
};

function Game() {
  this.opponent = '';
  this.date = '';
  this.venue = '';
  this.startTime = '';
}

function setUpLeagueSelector() {
  var league = '';
  var $leagueSelect = $('<select class="form-control" id="league-select">');
  var $defaultSelect = $('<option selected disabled hidden><strong>Select League Here</strong></option>');
  $leagueSelect.append($defaultSelect);
  
  LEAGUES.forEach(function(val) {
    $leagueSelect.append('<option value=' + val + '>' + val + '</option>');
  });
  
  $('#selector').append($leagueSelect);
}

function getSchedule(league, team, season) {
  var url = "http://api.sportsdatabase.com/" + 
            league + "/query.json?sdql=start%20time%2Cdate%2Co:team%2Csite%40team%3D" + 
            team + "%20and%20season%3D" + season + "&output=json&api_key=guest&jsoncallback=?";
  var schedule = [];
  team = decodeURI(team);
  $.getJSON(url, function(val) {
    if (val === null) {
      $('#team-name').text('');
      $('#schedule tbody').html("<h1>" + team + " Schedule Not Yet Available</h1>");
      return;
    }
    for (var i = 0; i < val["groups"][0]["columns"][0].length; i++) {
      var game = new Game;
      var start = val["groups"][0]["columns"][0][i];
      if (start == null) { 
        game.startTime = "TBA"; 
      } else {
        game.startTime = getFormattedTime(start.toString()); 
      }
      game.opponent = val["groups"][0]["columns"][2][i];
      var unformattedDate = val["groups"][0]["columns"][1][i];
      var formattedDate = unformattedDate.toString().substr(4, 2) + '-' + unformattedDate.toString().substr(6, 2);
      game.date = formattedDate;
      game.venue = val["groups"][0]["columns"][3][i];
      schedule.push(game);
    }
    displaySchedule(league, team, season, schedule);
  });
}

function displaySchedule(league, team, season, schedule) {
  $('#schedule tbody').empty();
  var teamColor = NFL_TEAM_COLORS[team];
  if (league === "nfl") {
    var teamColor = NFL_TEAM_COLORS[team];
  } else if (league === "nba") {
    var teamColor = NBA_TEAM_COLORS[team];
  } else if (league === "mlb") {
    var teamColor = MLB_TEAM_COLORS[team];
  }
  $('#team-name').text(team).css("color", teamColor);
  
  schedule.forEach(function(val) {
    $tableRow = $('<tr>');
    if (val.venue === "home") { $tableRow.css({ "background-color" : teamColor, "color" : "white" }); }
    $tableRow.append('<td>' + val.opponent + '</td>');
    $('#schedule tbody').append($tableRow);
    $tableRow.append('<td>' + val.venue + '</td>');
    $tableRow.append('<td>' + val.date + '</td>');
    $tableRow.append('<td>' + val.startTime + '</td>');
  });
}

function setUpTeamSelector(league) {
  var $teamSelect = $('<select class="form-control" id="team-select">');
  var $defaultSelect = $('<option selected disabled hidden><strong>Select Team Here</strong></option>');
  $teamSelect.append($defaultSelect);
  var teams = [];
  
  if (league == "NFL") {
    teams = NFL_TEAMS;
  } else if (league == "NBA") {
    teams = NBA_TEAMS;
  } else if (league == "MLB") {
    teams = MLB_TEAMS;
  }
  
  teams.forEach(function(val) {
    $teamSelect.append('<option value=' + encodeURI(val) + '>' + val + '</option>');
  });
  
  $('#selector').append($teamSelect);
}

$(document).ready(function() {
  setUpLeagueSelector();
  
  $('#league-select').change(function() {
    $('#league-select').siblings().remove();
    var league = $('#league-select').val();
    setUpTeamSelector(league);
  });
  
  $(document).on("change", "#team-select", function() {
    getSchedule($('#league-select').val().toLowerCase(), $('#team-select').val(), "2016");
  });
  
});
