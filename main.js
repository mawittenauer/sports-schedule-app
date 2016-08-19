var TEAM_COLORS = {
  "Bears" : "#C83803", "Bengals" : "#FB4F14", "Bills" : "#00338D", "Broncos" : "#FB4F14", "Browns" : "#FB4F14", "Buccaneers" : "#D50A0A",
  "Cardinals" : "#97233F", "Chargers" : "#0073CF", "Chiefs" : "#E31837", "Colts" : "#002C5F", "Cowboys" : "#002244", "Dolphins" : "#008E97",
  "Eagles" : "#004953", "Falcons" : "#A71930", "Fortyniners" : "#AA0000", "Giants" : "#0B2265", "Jaguars" : "#006778", "Jets" : "#203731", "Lions" : "#005A8B", "Packers" : "#203731",
  "Panthers" : "#0085CA", "Patriots" : "#002244", "Raiders" : "#A5ACAF", "Rams" : "#002244", "Ravens" : "#241773", "Redskins" : "#773141", "Saints" : "#9F8958",
  "Seahawks" : "#002244", "Steelers" : "#FFB612", "Texans" : "#03202F", "Titans" : "#4B92DB", "Vikings" : "#4F2683"
};

var TEAMS = Object.keys(TEAM_COLORS);

function Game() {
  this.opponent = '';
  this.date = '';
  this.venue = '';
  this.startTime = '';
}

function getSchedule(league, team, season, callback) {
  var url = "http://api.sportsdatabase.com/" + 
            league + "/query.json?sdql=start%20time%2Cdate%2Co:team%2Csite%40team%3D" + 
            team + "%20and%20season%3D" + season + "&output=json&api_key=guest&jsoncallback=?";
  var schedule = [];
  $.getJSON(url, function(val) {
    for (var i = 0; i < val["groups"][0]["columns"][0].length; i++) {
      var game = new Game;
      game.startTimeArray = val["groups"][0]["columns"][0][i];
      game.opponentArray = val["groups"][0]["columns"][2][i];
      game.dateArray = val["groups"][0]["columns"][1][i];
      game.homeAwayArray = val["groups"][0]["columns"][3][i];
      shedule.push(game);
    }
  });
  return schedule;
}

function setSchedule(league, team, season) {
  $('#schedule tbody').empty();
  getSchedule(league, team, season, function(schedule) {
    $('#team-name').text('');
    var opponentArray = schedule.opponentArray;
    var dateArray = schedule.dateArray;
    var homeAwayArray = schedule.homeAwayArray;
    var startTimeArray = schedule.startTimeArray;
    var teamColor = schedule.teamColor;
    $('#team-name').text(team).css("color", teamColor);

    for (var i = 0; i < opponentArray.length; i++) {
      $tableRow = $('<tr>');
      if (homeAwayArray[i] === "home") { $tableRow.css({"background-color": teamColor, "color" : "white"}); }
      $tableRow.append('<td>' + opponentArray[i] + '</td>');
      $('#schedule tbody').append($tableRow);
      $tableRow.append('<td>' + homeAwayArray[i] + '</td>');
      var formattedDate = dateArray[i].toString().substr(0, 4) + '-' + dateArray[i].toString().substr(4, 2) + '-' + dateArray[i].toString().substr(6, 2);
      $tableRow.append('<td>' + formattedDate + '</td>');
      $tableRow.append('<td>' + startTimeArray[i] + '</td>');
    }
  });
}

function setUpTeamSelector() {
  var $teamSelect = $('<select class="form-control" id="team-select">');
  var $row = $('<div class="row">');
  
  TEAMS.forEach(function(val) {
    $teamSelect.append('<option value=' + val + '>' + val + '</option>');
  });
  
  $('#selector').append($teamSelect);
  
  $(document).on("change", "select", function() {
    setSchedule("nfl", $teamSelect.val(), "2016");
  });
}

$(document).ready(function() {
  setUpTeamSelector();
});
