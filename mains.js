function Schedule() {
  this.opponent_array = [];
  this.date_array = [];
  this.home_away_array = [];
  this.start_time_array = [];
}

function getSchedule(league, team, season, callback) {
  var url = "http://api.sportsdatabase.com/" + 
            league + "/query.json?sdql=start%20time%2Cdate%2Co:team%2Csite%40team%3D" + 
            team + "%20and%20season%3D" + season + "&output=json&api_key=guest&jsoncallback=?";
  var schedule = new Schedule;
  $.getJSON(url, function(val) {
    schedule.start_time_array = val["groups"][0]["columns"][0];
    schedule.opponent_array = val["groups"][0]["columns"][2];
    schedule.date_array = val["groups"][0]["columns"][1];
    schedule.home_away_array = val["groups"][0]["columns"][3];
    callback(schedule);
  });
}

$(document).ready(function() {
  getSchedule("nfl", "Bears", "2016", function(schedule) {
    var opponent_array = schedule.opponent_array;
    var date_array = schedule.date_array;
    var home_away_array = schedule.home_away_array;
    var start_time_array = schedule.start_time_array;
    
    for (var i = 0; i < opponent_array.length; i++) {
      $tableRow = $('<tr>');
      if (home_away_array[i] === "home") { $tableRow.css({"background-color": "#C83803", "color" : "white"}); }
      $tableRow.append('<td>' + opponent_array[i] + '</td>');
      $('#schedule tbody').append($tableRow);
      $tableRow.append('<td>' + home_away_array[i] + '</td>');
      var formatted_date = date_array[i].toString().substr(0, 4) + '-' + date_array[i].toString().substr(4, 2) + '-' + date_array[i].toString().substr(6, 2);
      $tableRow.append('<td>' + formatted_date + '</td>');
      $tableRow.append('<td>' + start_time_array[i] + '</td>');
    }
  });
});
