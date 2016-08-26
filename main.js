var TEAM_COLORS = {
  "Bears" : "#C83803", "Bengals" : "#FB4F14", "Bills" : "#00338D", "Broncos" : "#FB4F14", "Browns" : "#FB4F14", "Buccaneers" : "#D50A0A",
  "Cardinals" : "#97233F", "Chargers" : "#0073CF", "Chiefs" : "#E31837", "Colts" : "#002C5F", "Cowboys" : "#002244", "Dolphins" : "#008E97",
  "Eagles" : "#004953", "Falcons" : "#A71930", "Fortyniners" : "#AA0000", "Giants" : "#0B2265", "Jaguars" : "#006778", "Jets" : "#203731", "Lions" : "#005A8B", "Packers" : "#203731",
  "Panthers" : "#0085CA", "Patriots" : "#002244", "Raiders" : "#A5ACAF", "Rams" : "#002244", "Ravens" : "#241773", "Redskins" : "#773141", "Saints" : "#9F8958",
  "Seahawks" : "#002244", "Steelers" : "#FFB612", "Texans" : "#03202F", "Titans" : "#4B92DB", "Vikings" : "#4F2683"
};

var TEAMS = Object.keys(TEAM_COLORS);

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

function getSchedule(league, team, season) {
  var url = "http://api.sportsdatabase.com/" + 
            league + "/query.json?sdql=start%20time%2Cdate%2Co:team%2Csite%40team%3D" + 
            team + "%20and%20season%3D" + season + "&output=json&api_key=guest&jsoncallback=?";
  var schedule = [];
  $.getJSON(url, function(val) {
    for (var i = 0; i < val["groups"][0]["columns"][0].length; i++) {
      var game = new Game;
      game.startTime = val["groups"][0]["columns"][0][i];
      game.opponent = val["groups"][0]["columns"][2][i];
      game.date = val["groups"][0]["columns"][1][i];
      game.venue = val["groups"][0]["columns"][3][i];
      schedule.push(game);
    }
    displaySchedule(league, team, season, schedule);
  });
}

function displaySchedule(league, team, season, schedule) {
  $('#schedule tbody').empty();
  var teamColor = TEAM_COLORS[team];
  $('#team-name').text(team).css("color", teamColor);
  
  schedule.forEach(function(val) {
    $tableRow = $('<tr>');
    if (val.venue === "home") { $tableRow.css({ "background-color" : teamColor, "color" : "white" }); }
    $tableRow.append('<td>' + val.opponent + '</td>');
    $('#schedule tbody').append($tableRow);
    $tableRow.append('<td>' + val.venue + '</td>');
    var formattedDate = val.date.toString().substr(4, 2) + '-' + val.date.toString().substr(6, 2);
    $tableRow.append('<td>' + formattedDate + '</td>');
    $tableRow.append('<td>' + getFormattedTime(val.startTime.toString()) + '</td>');
  });
}

function setUpTeamSelector() {
  var $teamSelect = $('<select class="form-control" id="team-select">');
  var $defaultSelect = $('<option selected disabled hidden><strong>Select Team Here</strong></option>');
  $teamSelect.append($defaultSelect);
  
  TEAMS.forEach(function(val) {
    $teamSelect.append('<option value=' + val + '>' + val + '</option>');
  });
  
  $('#selector').append($teamSelect);
  
  $(document).on("change", "select", function() {
    getSchedule("nfl", $teamSelect.val(), "2016");
  });
}

$(document).ready(function() {
  setUpTeamSelector();
});
