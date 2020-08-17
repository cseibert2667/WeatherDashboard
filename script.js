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
let city = "Seattle"
let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

// We then created an AJAX call
$.ajax({
  url: queryURL,
  method: "GET"
}).then(function (response) {
  console.log(response); // logs response
  let date = moment.unix(response.dt).format("MM/DD/YYYY"); // Retrieves current date
  let cityName = response.name; // city name
  let lat = response.coord.lat; // latitude
  let lon = response.coord.lon; // longitude
  let temp = response.main.temp; // Finds temp
  let tempF = Math.round((temp - 273.15) * 1.8 + 32); // converts to F
  let wSpeed = response.wind.speed; // retrieves wind speed
  let hum = response.main.humidity; // retrieves humidity
  getUvIndex(lat, lon); // gets UV index & displays on page
  getFiveDay(cityName); // gets 5-day forecast and builds cards to display data
  // displays info on page
  $("#city-name").text(cityName+" "+date);
  $("#main-temp").text("Temperature: "+tempF+"°F");
  $("#main-hum").text("Humidity: "+hum+"%");
  $("#main-wind").text("Wind Speed: "+wSpeed+" mph");
});

// Retrieves current UV index
function getUvIndex (lat, lon){
  let uvQuery = "http://api.openweathermap.org/data/2.5/uvi?appid="+APIKey+"&lat="+lat+"&lon="+lon;
  $.ajax({
    url: uvQuery,
    method: "GET"
  }).then(function (uvResponse) {
    let uvIndex = uvResponse.value
    $("#main-uv").text("UV Index: "+uvIndex)
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
    // loops through array grabbing data from roughly 9 PM UTC (2pm - 5pm US)
    for (let i = 5; i < fiveList.length; i=i+8) {
      let dayIndex = fiveList[i];
      // create new card
      let $card = $("<div>").addClass("card").attr("style", "width: 18rem");
      let $body = $("<div>").addClass("card-body");
      // Retrieves unix timestamp and coverts to user-friendly format
      let fdDate = moment.unix(dayIndex.dt).format("MM/DD/YYYY");
      let $date = $("<h5>").addClass("card-title").text(fdDate);
      
      // Retrieves temp & converts to F
      let fdTemp = dayIndex.main.temp;
      let fdTempF = Math.round((fdTemp - 273.15) * 1.8 + 32);
      let $temp = $("<p>").addClass("card-text").text("Temperature: "+fdTempF+"°F");
      
      // Retrieves humidity
      let fdHum = dayIndex.main.humidity;
      let $hum = $("<p>").addClass("card-text").text("Humidity: "+fdHum+"%");
      

      $($body).append($date, $temp, $hum)
      $($card).append($body)
      $("#5-day").append($card)
    }
  })
}

{/* <div id="5-day">
        <div class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title" id="card-date">08/31/1994</h5>
                <p class="card-text" id="card-temp">Temperature: 420</p>
                <p class="card-text" id="card-hum">Humidity: 69%</p>
            </div>
        </div>
    </div> */}