const mapCenterLat = document.querySelector('#map-ctr-lat')
const mapCenterLng = document.querySelector('#map-ctr-lng')
const refreshLink = document.querySelector('#refresh-link')
const stationName = document.querySelectorAll('#servo-name')
const servoAddress = document.querySelectorAll('#servo-address')
const stationAddress = document.querySelector('#station-address')
const stationDistance = document.querySelector('#servo-distance')
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
const github = document.querySelectorAll('.github')
const githubImg = document.querySelectorAll('.github-img')
// const newStationBtn = document.querySelector('.add-new-servo')
// const newServoForm = document.querySelector('.new-servo-form')

// newStationBtn.addEventListener('click', handleNewClick)

// function handleNewClick() {
//   newServoForm.style.display = 'none'
//   alert('yay')
// }
const measurementToggle = document.querySelector('#measurement-toggle')
const servoDistances = document.querySelectorAll('#servo-distance')
const servoMeasurements = document.querySelectorAll('#servo-measurement')
const servoStations = document.querySelectorAll('#servo-station')
const findAddressBtn = document.querySelectorAll('.find-address-btn')
const mapCtrAddress = document.querySelectorAll('.map-ctr-address')


refreshLink.addEventListener('click', handleClickRefreshLink)
// stationLink.addEventListener('click', handleSpotlight)
document.addEventListener('keydown', handleDisplay)
// document.addEventListener("DOMContentLoaded", geoFindMe)
document.addEventListener('click', handleClickCtrAddress)
for (let servoStation of servoStations) {
    servoStation.addEventListener('click', handleClickServoStation)
}


function loadUserImg() {
    for (let i = 0; i < 3; i++) {
        let user = github[i]
        let username = user.innerHTML.split('/')[3]
        fetch(`https://api.github.com/users/${username}`)
            .then(result => result.json())
            .then(data => {
                githubImg[i].src = data.avatar_url
            })
    }
}


function handleClickCtrAddress(event){
    let lat = mapCenterLat.textContent
    let lng = mapCenterLng.textContent
    let location = lat + ',' + lng
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location}&key=AIzaSyBBVmJUTQL7TidRGsReetenLy-OWCUElew`)
        .then(result => result.json())
        .then(data => {
            mapCtrAddress[0].textContent = data.results[0].formatted_address
        })
}


let show = true
function handleDisplay(event){
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'b') {
        event.preventDefault()
        
        if (show) {
            navigation.style.display = 'none'
            directions.style.display = 'none'
            gridWrapper.style.gridTemplateColumns = '1fr'
            show = false
        } else {
            navigation.style.display = ''
            directions.style.display = ''
            gridWrapper.style.gridTemplateColumns = '1fr 3fr 1fr'
            show = true
        }
    }
}

// hardcoded for now, pulled it out as variables so I can set starting co-ords for map center. 
let mapStartCenterLat =  -34
let mapStartCenterLng = 151.04


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

    google.maps.event.addListener(map, "idle", function() {
        var bounds = map.getBounds();
        let mapStartBoundLat = bounds.ci.hi
        let mapEndBoundLat = bounds.ci.lo
        let mapStartBoundLng = bounds.Lh.hi
        let mapEndBoundLng = bounds.Lh.lo
        
    fetch(`http://localhost:9090/api/stations/bounds/?startLat=${mapStartBoundLat}&endLat=${mapEndBoundLat}&startLng=${mapStartBoundLng}&endLng=${mapEndBoundLng}`)
        .then(response => response.json())
        .then(data => data.forEach(
        station => {
            const caltex = document.createElement("img");
            const bp = document.createElement("img")
            const shell = document.createElement("img")
            const seven11 = document.createElement("img")
                
            caltex.src =
                "https://i.postimg.cc/v8c2CbBV/ca1512cec7-caltex-logo-caltex-logo-removebg-preview.png";

            bp.src = 
                "https://i.postimg.cc/4yFcb6z8/BP-removebg-preview-3.png"

            shell.src = 
                "https://i.postimg.cc/HLMQyCh5/Shell-logo-svg-removebg-preview.png"

            seven11.src = 
                "https://i.postimg.cc/x1tjNxgS/7-Eleven-logo-brand-logotype.png"

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
            else if (stationOwner === "7-Eleven Pty Ltd") {
                let Seven11 = "Seven11"
                markerObject.content = icons[Seven11]
            }

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
})
  
    google.maps.event.addListener(map, "center_changed", function() {
        var center = this.getCenter()
        var latitude = center.lat()
        var longitude = center.lng()
    mapCenterLat.textContent = latitude.toFixed(6)
    mapCenterLng.textContent = longitude.toFixed(6)
    
    })
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
          gridWrapper.style.background = "linear-gradient(90deg, rgba(120,159,139,1) 0%, rgba(72,137,187,1) 100%)"
        } else {
          gridWrapper.style.background = "linear-gradient(90deg, rgba(120,159,139,1) 0%, rgba(72,137,187,1) 100%)"
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

        fetch(`http://localhost:9090/api/stations/nearest/?lat=${mapStartCenterLat}&lng=${mapStartCenterLng}`)
            .then(response => response.json())
            .then(result => {
                for (let i = 0; i < 10; i++) {
                    stationName[i].textContent = result[i].name
                    servoAddress[i].textContent = result[i].address
                    servoDistances[i].textContent = (Number(result[i].distance)*111.1*1000).toFixed(0)
                }
            })
            
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

let spotlightLat = 0
let spotlightLng = 0 

function updateSpotlight(){
    fetch('http://localhost:9090/api/stations/random')
        .then(res => res.json())
        .then(station => {
            stationLink.textContent = station.name
            stationAddress.textContent = station.address
            spotlightLat = parseFloat(station.latitude)
            spotlightLng = parseFloat(station.longitude)
            console.log("updating")
            // initMap()
            updateWeather(mapStartCenterLat,mapStartCenterLng)
        })
}

// function handleSpotlight(){
 
//     alert('wth')
//    console.log("do we ever come here?")  
//    console.log(spotlightLat)
//    console.log(spotlightLng)
//    mapStartCenterLat = spotlightLat
//    mapStartCenterLng = spotlightLng
//           initMap()
//           // updateWeather(mapStartCenterLat,mapStartCenterLng)
      
// }

function handleClickRefreshLink(event){
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


function updateWeather(mapStartCenterLat,mapStartCenterLng){
    let lat = mapStartCenterLat
    let lng = mapStartCenterLng
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=621eaefe9c060ebcb83ed98c4f681378&units=metric`)
        .then(response => response.json())
        .then(weatherData => {
            weatherLocation.textContent = weatherData.city.name + '/' + weatherData.city.country
            weatherDesc.textContent = weatherData.list[0].weather[0].description
            weatherTemp.textContent = weatherData.list[0].main.temp
            let iconCode =  weatherData.list[0].weather[0].icon
            let iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`
            document.getElementById('weather-icon').src = iconUrl
            weatherRain.textContent = weatherData.list[0].pop
            weatherHumidity.textContent = weatherData.list[0].main.humidity
            weatherWind.textContent = weatherData.list[0].wind.speed  
    })
}


function handleClickServoStation(event) {
    mapStartCenterLat = mapCenterLat
    mapStartCenterLng = mapCenterLng
    event.target
    
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
loadUserImg()
updateWeather()
// detectUserLocation()

function detectUserLocation() {
    navigator.geolocation.getCurrentPosition(
        
        function(position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            // console.log(userLon);
            initMap(userLat, userLon)
        }
        
    )
    console.log('sucess')
}
