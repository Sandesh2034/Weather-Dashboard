var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

function addToHistory (cityName) {
    if (!searchHistory.includes(cityName)) {
        searchHistory.push(cityName);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        var listItem = $("<button>")
        .addClass("list-group-item list-group-item-action")
        .text(cityName);

        listItem.on("click", function () {
            getWeatherData(cityName);
        });

        $("#history").append(listItem);
    }
}

$("#search-form").submit(function (event) {
  event.preventDefault();

  var cityName = $("#search-input").val().trim();

  if (cityName !== "") {
    getWeatherData(cityName);

    $("#search-input").val("");
  }
});

function getWeatherData(cityName) {
  var apiKey = 'babe62255845b6c3287d70ed6f28e1ef';
  var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;

  $.ajax({
    url: apiUrl,
    method: "GET",
    success: function (response) {
      updateWeatherUI(response);
      addToHistory(cityName);
    },
    error: function (error) {
      console.log("Error fetching weather data: ", error);
    }
  });
}

function updateWeatherUI(data) {
  var currentTemperature = data.list[0].main.temp;
  var humidity = data.list[0].main.humidity;
  var windSpeed = data.list[0].wind.speed;

  $("#today").html("<p>Temperature: " + currentTemperature + "</p><p>Humidity: " + humidity + "</p><p>Wind Speed: " + windSpeed + "</p>");

  for (var i = 1; i <= 5; i++) {
    var forecastDate = data.list[i].dt_txt;
    var forecastTemperature = data.list[i].main.temp;
    var forecastHumidity = data.list[i].main.humidity;

    $("#forecast").append("<div><p>Date: " + forecastDate + "</p><p>Temperature: " + forecastTemperature + "</p><p>Humidity: " + forecastHumidity + "</p></div>");
  }

  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

$(document).ready(function () {
 
  for (var i = 0; i < searchHistory.length; i++) {
    addToHistory(searchHistory[i]);

  }
});