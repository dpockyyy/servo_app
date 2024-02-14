const mapCenterLat = document.querySelector('.map-ctr-lat')
const mapCenterLng = document.querySelector('.map-ctr-lng')
const refreshLink = document.querySelector('#refresh-link')
const stationName = document.querySelector('#station-name')
const stationAddress = document.querySelector('#station-address')
const currentDate = document.querySelector('#current-date')
const wtiOilPrice = document.querySelector('#wti-oil-price')
const brentOilPrice = document.querySelector('#brent-oil-price')
const naturalGasPrice = document.querySelector('#natural-gas-price')
const weatherLocation = document.querySelector('.weather-location')
const weatherDesc = document.querySelector('.weather-desc')
const weatherTemp = document.querySelector('.weather-temp')
const weatherRain = document.querySelector('.weather-rain')
const weatherHumidity = document.querySelector('.weather-humidity')
const weatherWind = document.querySelector('.weather-wind')
const measurementToggle = document.querySelector('#measurement-toggle')
const servoDistances = document.querySelectorAll('#servo-distance')
const servoMeasurements = document.querySelectorAll('#servo-measurement')
const servoStations = document.querySelectorAll('#servo-station')



refreshLink.addEventListener('click', handleClickRefreshLink)
for (let servoStation of servoStations) {
    servoStation.addEventListener('click', handleClickServoStation)
}

// hardcoded for now, pulled it out as variables so I can set starting co-ords for map center.
let mapStartCenterLat = -37.42
let mapStartCenterLng = 144

async function initMap() {
    // Request needed libraries.
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const map = new Map(document.getElementById("map"), {
        center: { lat: mapStartCenterLat, lng: mapStartCenterLng },
        zoom: 13,
        minZoom: 9,
        mapId: "4504f8b37365c3d0",
    });

    google.maps.event.addListener(map, "center_changed", function() {
        var center = this.getCenter()
        var latitude = center.lat()
        var longitude = center.lng()
    mapCenterLat.textContent = latitude.toFixed(6)
    mapCenterLng.textContent = longitude.toFixed(6)
    
    })
    
    fetch('http://localhost:9090/api/stations/all')
        .then(response => response.json())
        .then(data => data.forEach(
            station => {
                const marker = new AdvancedMarkerElement({
                    map,
                    position: { lat: parseFloat(station.latitude), lng: parseFloat(station.longitude) },
                    title: station.name,
                });

                const contentString = 
                `<h4 id="firstHeading" class="firstHeading">${station.name}</h4>`
                + station.address
                const infoWindow = new InfoWindow({
                    content: contentString,
                });

                marker.addListener("click", () => {
                    infoWindow.close();
                    infoWindow.open(marker.map, marker)
                });
            })
        )

}

initMap()


window.addEventListener("load", () => {
    clock()
    function clock() {
        const today = new Date()

        // get time components
        const hours = today.getHours()
        const minutes = today.getMinutes()
        const seconds = today.getSeconds()

        //add '0' to hour, minute & second when they are less 10
        const hour = hours < 10 ? "0" + hours : hours
        const minute = minutes < 10 ? "0" + minutes : minutes
        const second = seconds < 10 ? "0" + seconds : seconds

        //make clock a 12-hour time clock
        const hourTime = hour > 12 ? hour - 12 : hour
        
        //assigning 'am' or 'pm' to indicate time of the day
        const ampm = hour < 12 ? "AM" : "PM"

        // get date components
        const day = today.getDay()
        let days = ['Sun', 'Mon', 'Tues', 'Weds', 'Thurs', 'Fri', 'Sat']
        let dayName = days[day]


        // changing background colour based on AM/PM
        const gridWrapper = document.querySelector('.grid-wrapper')
        if (ampm === "PM") {
          gridWrapper.style.backgroundColor = "gray"
        } else {
          gridWrapper.style.backgroundColor = "mistyrose"
        }
        //get current date and time
        
        const time = hourTime + ":" + minute + ":" + second + ampm

        //combine current date and time
        const dateTime = dayName + " " + time

        //print current date and time to the DOM
        document.getElementById("date-time").innerHTML = dateTime
        setTimeout(clock, 1000)
    }
})


function geoFindMe() {

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        mapStartCenterLat = latitude
        mapStartCenterLng = longitude
        mapCenterLat.textContent = mapStartCenterLat.toFixed(6)
        mapCenterLng.textContent = mapStartCenterLng.toFixed(6)

        fetch(`http://localhost:9090/api/stations/nearest?lat=${mapStartCenterLat}&lng=${mapStartCenterLng}`)

        return `Latitude: ${latitude} °, Longitude: ${longitude} °`;
    }

    function error() {
        return "Unable to retrieve your location";
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        return  "Geolocation is not supported by your browser";
    }

    initMap()
}


function updateSpotlight(){
    fetch('http://localhost:9090/api/stations/random')
        .then(res => res.json())
        .then(station => {
            stationName.textContent = station.name
            stationAddress.textContent = station.address
        })
}


function handleClickRefreshLink(event){
    event.preventDefault()
    updateSpotlight()
}


function updateWeather(){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${mapStartCenterLat}&lon=${mapStartCenterLng}&appid=347533d0e42725230e0bb151a7cb2eea&units=metric`)
        .then(response => response.json())
        .then(weatherData => {
            weatherLocation.textContent = weatherData.timezone.split('/')[1] + ', ' +  weatherData.timezone.split('/')[0] 
            weatherDesc.textContent = weatherData.current.weather[0].description
            weatherTemp.textContent = weatherData.current.temp
            weatherRain.textContent = weatherData.daily[0].pop
            weatherHumidity.textContent = weatherData.current.humidity
            weatherWind.textContent = weatherData.current.wind_speed   
    })
}


function handleClickServoStation(event) {
    mapStartCenterLat = mapCenterLat
    mapStartCenterLng = mapCenterLng

    
}


function handleCheckboxMeasurementToggle() {
    if (measurementToggle.checked) {
        for (let servoMeasurement of servoMeasurements) {
            servoMeasurement.innerHTML = 'km'
        }
        for (let servoDistance of servoDistances) {
            servoDistance.innerHTML = servoDistance.innerHTML / 1000
        }
    } else {
        for (let servoMeasurement of servoMeasurements) {
            servoMeasurement.innerHTML = 'm'
        }
        for (let servoDistance of servoDistances) {
            servoDistance.innerHTML = servoDistance.innerHTML * 1000
        }
    }
}

geoFindMe()
updateSpotlight()
updateWeather()



///////////////////////////////////////////////////////////////////////////////////////
// // This is to get the user's center location on the map and send it to the server.
// // Code was found here: https://stackoverflow.com/questions/40905568/how-to-pass-a-js-variable-from-my-client-to-an-express-server
// $.ajax({
//     url : "/api/center_location",
//     type: "POST",
//     dataType:'json',
//     data: {
//         mapStartCenterLat,
//         mapStartCenterLng
//     },
//     success: function(data){
//         console.log(data.msg); // 'OK'
//     },
// });
