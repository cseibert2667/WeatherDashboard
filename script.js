// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast

// 3 separate API calls = basic weather, UV Index, 5-day
// Use Lat/Lon from 'basic weather' call to find UV & 5-day
// shoot for data from around 3pm for 5-day forcast


let APIKey = "d9a9ca04881f1da4bcfcc61c47033231";
let city = "Phoenix"
let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

// We then created an AJAX call
$.ajax({
  url: queryURL,
  method: "GET"
}).then(function (response) {
  // Logs response
  console.log(response)
  let lat = response.coord.lat;
  let lon = response.coord.lon;
  console.log(lat+", "+lon)
  getUvIndex(lat, lon);
  // Finds temp & converts to F
  let cityName = response.name;
  console.log(cityName)
  let temp = response.main.temp;
  let tempF = Math.round((temp - 273.15) * 1.8 + 32)
  console.log(tempF);
  let humid = response.main.humidity;
  console.log(humid);
  let wSpeed = response.wind.speed;
  console.log(wSpeed);
});

function getUvIndex (lat, lon){
  let uvQuery = "http://api.openweathermap.org/data/2.5/uvi?appid="+APIKey+"&lat="+lat+"&lon="+lon
  $.ajax({
    url: uvQuery,
    method: "GET"
  }).then(function (uvResponse) {
    console.log(uvResponse.value)
  })
}