function Schedule() {
  this.opponent_array = [];
  this.date_array = [];
  this.home_away_array = [];
}

function getSchedule(league, team, season, callback) {
  var url = "http://api.sportsdatabase.com/" + 
            league + "/query.json?sdql=date%2Co:team%2Co:site%40team%3D" + 
            team + "%20and%20season%3D" + season + "&output=json&api_key=guest&jsoncallback=?";
  var schedule = new Schedule;
  $.getJSON(url, function(val) {
    schedule.opponent_array = val["groups"][0]["columns"][1];
    schedule.date_array = val["groups"][0]["columns"][0];
    schedule.home_away_array = val["groups"][0]["columns"][2];
    callback(schedule);
  });
}

$(document).ready(function() {
  getSchedule("nfl", "Bears", "2016", function(schedule) {
    $('body').text(schedule.opponent_array);
  });
});
