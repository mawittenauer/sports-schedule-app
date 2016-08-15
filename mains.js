var TEAMS = [
  "Bears", "Bengals", "Bills", "Broncos", "Browns", "Bucaneers",
  "Cardinals", "Chargers", "Cheifs", "Colts", "Cowboys", "Dolphins",
  "Eagles", "Falcons", "Fortyniners", "Giants", "Jaguars", "Jets", "Lions", "Packers",
  "Panthers", "Patriots", "Raiders", "Rams", "Ravens", "Redskins", "Saints",
  "Seahawks", "Steelers", "Texans", "Titans", "Vikings"
];

function Schedule() {
  this.opponentArray = [];
  this.dateArray = [];
  this.homeAwayArray = [];
  this.startTimeArray = [];
}

function getSchedule(league, team, season, callback) {
  var url = "http://api.sportsdatabase.com/" + 
            league + "/query.json?sdql=start%20time%2Cdate%2Co:team%2Csite%40team%3D" + 
            team + "%20and%20season%3D" + season + "&output=json&api_key=guest&jsoncallback=?";
  var schedule = new Schedule;
  $.getJSON(url, function(val) {
    schedule.startTimeArray = val["groups"][0]["columns"][0];
    schedule.opponentArray = val["groups"][0]["columns"][2];
    schedule.dateArray = val["groups"][0]["columns"][1];
    schedule.homeAwayArray = val["groups"][0]["columns"][3];
    callback(schedule);
  });
}

function setSchedule(league, team, season) {
  $('#schedule tbody').empty();
  getSchedule(league, team, season, function(schedule) {
    var opponentArray = schedule.opponentArray;
    var dateArray = schedule.dateArray;
    var homeAwayArray = schedule.homeAwayArray;
    var startTimeArray = schedule.startTimeArray;

    for (var i = 0; i < opponentArray.length; i++) {
      $tableRow = $('<tr>');
      if (homeAwayArray[i] === "home") { $tableRow.css({"background-color": "#C83803", "color" : "white"}); }
      $tableRow.append('<td>' + opponentArray[i] + '</td>');
      $('#schedule tbody').append($tableRow);
      $tableRow.append('<td>' + homeAwayArray[i] + '</td>');
      var formattedDate = dateArray[i].toString().substr(0, 4) + '-' + dateArray[i].toString().substr(4, 2) + '-' + dateArray[i].toString().substr(6, 2);
      $tableRow.append('<td>' + formattedDate + '</td>');
      $tableRow.append('<td>' + startTimeArray[i] + '</td>');
    }
  });
}

$(document).ready(function() {
  var $teamSelect = $('<select class="form-control" id="team-select">');
  var $row = $('<div class="row">');
  
  TEAMS.forEach(function(val) {
    $teamSelect.append('<option value=' + val + '>' + val + '</option>');
  });
  
  $('#selector').append($teamSelect);
  
  $(document).on("change", "select", function() {
    setSchedule("nfl", $teamSelect.val(), "2016");
  });
});
