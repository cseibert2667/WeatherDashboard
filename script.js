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

// let day = moment.unix(456876543).format("MM/DD/YYYY") //converts unix to specified format


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
  // Retrieves current date
  let date = moment.unix(response.dt).format("MM/DD/YYYY")
  console.log("Date: "+date)
  // Retrieves lat & lon
  let lat = response.coord.lat;
  let lon = response.coord.lon;
  console.log(lat+", "+lon)
  // calls function using the retrieved lat & lon 
  getUvIndex(lat, lon);
  // Retrieves city name
  let cityName = response.name;
  console.log("City: "+cityName);
  // calls function using retrieved city name
  getFiveDay(cityName);
  // Finds temp & converts to F
  let temp = response.main.temp;
  let tempF = Math.round((temp - 273.15) * 1.8 + 32)
  console.log("Temp(F): "+tempF);
  let humid = response.main.humidity;
  console.log("Humidity: "+humid);
  let wSpeed = response.wind.speed;
  console.log("Wind Speed: "+wSpeed);
});

// Retrieves current UV index
function getUvIndex (lat, lon){
  let uvQuery = "http://api.openweathermap.org/data/2.5/uvi?appid="+APIKey+"&lat="+lat+"&lon="+lon;
  $.ajax({
    url: uvQuery,
    method: "GET"
  }).then(function (uvResponse) {
    let uvIndex = uvResponse.value
    console.log("UV Index: "+uvIndex)
  })
}

// Retrieves 5-day forecast
function getFiveDay (cityName) {
  let fiveQuery = "http://api.openweathermap.org/data/2.5/forecast?q="+cityName+"&appid="+APIKey;
  $.ajax({
    url: fiveQuery,
    method: "GET"
  }).then(function (fiveResponse) {
    console.log(fiveResponse)
    let fiveList = fiveResponse.list;
    console.log(fiveList)
    // loops through index grabbing data from roughly 9 PM UTC (2pm - 5pm US)
    for (let i = 5; i < fiveList.length; i=i+8) {
      let dayIndex = fiveList[i];
      // Retrieves unix timestamp and coverts to user-friendly format
      let fdDate = moment.unix(dayIndex.dt).format("MM/DD/YYYY")
      console.log(fdDate);
      // Retrieves temp & converts to F
      let fdTemp = dayIndex.main.temp;
      let fdTempF = Math.round((fdTemp - 273.15) * 1.8 + 32);
      console.log(fdTempF);
      // Retrieves humidity
      let fdHumid = dayIndex.main.humidity;
      console.log(fdHumid);
    }
  })
}