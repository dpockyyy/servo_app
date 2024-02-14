const mapCenterLat = document.querySelector('.map-ctr-lat')
const mapCenterLng = document.querySelector('.map-ctr-lng')
const refreshLink = document.querySelector('#refresh-link')
const stationName = document.querySelector('#station-name')
const stationAddress = document.querySelector('#station-address')
const weatherLocation = document.querySelector('.weather-location')
const weatherDesc = document.querySelector('.weather-desc')
const weatherTemp = document.querySelector('.weather-temp')
const weatherRain = document.querySelector('.weather-rain')
const weatherHumidity = document.querySelector('.weather-humidity')
const weatherWind = document.querySelector('.weather-wind')
const stationLink = document.querySelector('#station-link')
const navigation = document.querySelector('.navigation')
const directions = document.querySelector('.directions')
const gridWrapper = document.querySelector('.grid-wrapper')



refreshLink.addEventListener('click', handleClick)
stationLink.addEventListener('click', updateSpotlight)
document.addEventListener('keydown', handleDisplay)
document.addEventListener("DOMContentLoaded", detectUserLocation)

let show = true
function handleDisplay(event){
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'b') {
        event.preventDefault()
        
        if (show){
            navigation.style.display = 'none'
            directions.style.display = 'none'
            gridWrapper.style.gridTemplateColumns = '1fr'
            show = false
        } else{
            navigation.style.display = ''
            directions.style.display = ''
            gridWrapper.style.gridTemplateColumns = '1fr 3fr 1fr'
            show = true
        }
    }
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

    google.maps.event.addListener(map, "idle", function() {
      var bounds = map.getBounds();
      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();
      console.log(bounds)
      // console.log(sw)
    })
    
    })

    function startingBounds() {
      var bounds = map.getBounds()
      console.log(bounds)
    }
    
    fetch('http://localhost:9090/api/stations/all')
        .then(response => response.json())
        .then(data => data.forEach(
            station => {
              const caltex = document.createElement("img");
              const bp = document.createElement("img")
              const shell = document.createElement("img")
              const seven11 = document.createElement("img")
              
              caltex.src =
                "https://i.postimg.cc/Z5t3zQR5/ca1512cec7-caltex-logo-caltex-logo-removebg-preview.png";

              bp.src = 
                "https://i.postimg.cc/kXxGKgJ7/BP-removebg-preview.png"

              shell.src = "https://i.postimg.cc/HLMQyCh5/Shell-logo-svg-removebg-preview.png"

              seven11.serc = "https://i.postimg.cc/zBCWBSc1/7-Eleven-Logo-wine-removebg-preview.png"

              let icons = {
                Caltex: caltex,
                BP: bp,
                Shell: shell,
                Seven11: seven11,
              }
            
              let markerObject = {
                  map,  
                  position: { lat: parseFloat(station.latitude), lng: parseFloat(station.longitude) },
                  title: station.name,
              }
              let stationOwner = station.owner
              if (icons.hasOwnProperty(stationOwner)) {
                markerObject.content = icons[stationOwner]
              } 
              // else if (stationOwner === "7-Eleven Pty Ltd") {
              //   console.log("711")
              //   let Seven11 = "Seven11"
              //   markerObject.content = icons[Seven11]
              // }

              // can't seem to get 7/11 to work at this stage. spent way too much time on this will circle back later. 
                const marker = new AdvancedMarkerElement(
                  markerObject
                );

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
        startingBounds()
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

        // if (hour === 0) {
        //   hour = 12;
        // }
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
        mapCenterLat.textContent = mapStartCenterLat.toFixed(2)
        mapCenterLng.textContent = mapStartCenterLng.toFixed(2)
     
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
            stationLink.textContent = station.name
            stationAddress.textContent = station.address
            mapStartCenterLat = parseFloat(station.latitude)
            mapStartCenterLng = parseFloat(station.longitude)
            initMap()
        })
}

function handleClick(event){
    event.preventDefault()
    fetch('http://localhost:9090/api/stations/random')
    .then(res => res.json())
    .then(station => {
        stationLink.textContent = station.name
        stationAddress.textContent = station.address
        mapStartCenterLat = parseFloat(station.latitude)
        mapStartCenterLng = parseFloat(station.longitude)
    })
}


function updateWeather(){
  const lat = -37.42
  const lon = 144
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


geoFindMe()
updateSpotlight()
updateWeather()
//detectUserLocation()

function detectUserLocation() {
    navigator.geolocation.getCurrentPosition(
        
        function(position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            console.log(userLon);
            initMap(userLat, userLon)
        }
        
    )
    console.log('sucess')
}

