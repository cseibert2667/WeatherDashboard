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


let city = ""

let APIKey = "d9a9ca04881f1da4bcfcc61c47033231";
let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
let cities = []

// pulls weather for city on page load
getWeather("Phoenix");

// search click finds weather for input city
$("#search-btn").on("click", function (e){
  e.preventDefault();
  city = $("#city-input").val();
  getWeather(city);
  $("#5-day").empty();

  // *** instead have this push the item to an array (in local storage), then build the list items using that array in a for loop -- also need to make them clickable
  cities.push(city)
  $(".list-group").empty();
  cities.forEach((city) => {
    let $city = $("<li>").addClass("list-group-item").text(city);
    $(".list-group").prepend($city);
  })
})

function getWeather (city){
  let APIKey = "d9a9ca04881f1da4bcfcc61c47033231";
  let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
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
    let iconID = response.weather[0].icon // retrieves icon ID
    let $icon = $("<img>").attr("src", "http://openweathermap.org/img/wn/"+iconID+"@2x.png")
    getUvIndex(lat, lon); // gets UV index & displays on page
    getFiveDay(cityName); // gets 5-day forecast and builds cards to display data
    // displays info on page
    $("#city-name").text(cityName+" "+date).append($icon);
    $("#main-temp").text("Temperature: "+tempF+"°F");
    $("#main-hum").text("Humidity: "+hum+"%");
    $("#main-wind").text("Wind Speed: "+wSpeed+" mph");
  });
}

// Retrieves current UV index
function getUvIndex (lat, lon){
  let uvQuery = "http://api.openweathermap.org/data/2.5/uvi?appid="+APIKey+"&lat="+lat+"&lon="+lon;
  $.ajax({
    url: uvQuery,
    method: "GET"
  }).then(function (uvResponse) {
    let uvIndex = uvResponse.value
    $("#uv").text(uvIndex)
    if (uvIndex < 3){
      $("#uv").attr("class", "uv-low")
    } else if (uvIndex < 6){
      $("#uv").attr("class", "uv-mod")
    } else if (uvIndex < 8){
      $("#uv").attr("class", "uv-high")
    } else if (uvIndex > 10) {
      $("#uv").attr("class", "uv-ext")
    }
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
    for (let i = 0; i < fiveList.length; i++) {
      let dayIndex = fiveList[i];
      let dateTime = dayIndex.dt_txt;  
      if (dateTime.includes("21:00")) {  // only runs code if time is 9PM UTC (2-5PM US)
        // create new card
        let $card = $("<div>").addClass("card mr-3").attr("style", "width: 12rem");
        let $body = $("<div>").addClass("card-body");
        // Retrieves unix timestamp and coverts to user-friendly format
        let fdDate = moment.unix(dayIndex.dt).format("MM/DD/YYYY");
        let $date = $("<h5>").addClass("card-title").text(fdDate);
        // Retrieves icon
        let fdIconID = dayIndex.weather[0].icon
        let $fdIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/"+fdIconID+"@2x.png")
        // Retrieves temp & converts to F
        let fdTemp = dayIndex.main.temp;
        let fdTempF = Math.round((fdTemp - 273.15) * 1.8 + 32);
        let $temp = $("<p>").addClass("card-text").text("Temperature: "+fdTempF+"°F");
        
        // Retrieves humidity
        let fdHum = dayIndex.main.humidity;
        let $hum = $("<p>").addClass("card-text").text("Humidity: "+fdHum+"%");
        
        // appends data to card, card to page
        $($body).append($date, $fdIcon, $temp, $hum)
        $($card).append($body)
        $("#5-day").append($card)
      }
    }
  })
}
