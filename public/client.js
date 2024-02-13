const mapCenterLat = document.querySelector('.map-ctr-lat')
const mapCenterLng = document.querySelector('.map-ctr-lng')
const refreshLink = document.querySelector('#refresh-link')
const stationName = document.querySelector('#station-name')
const stationAddress = document.querySelector('#station-address')
const currentDate = document.querySelector('#current-date')
const wtiOilPrice = document.querySelector('#wti-oil-price')
const brentOilPrice = document.querySelector('#brent-oil-price')
const naturalGasPrice = document.querySelector('#natural-gas-price')


refreshLink.addEventListener('click', handleClick)

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
   mapCenterLat.textContent = latitude.toFixed(2)
   mapCenterLng.textContent = longitude.toFixed(2)
  
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
)}

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
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
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

  if (!navigator.geolocation) {
    return  "Geolocation is not supported by your browser";
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

function updateSpotlight(){
  fetch('http://localhost:9090/api/stations/random')
    .then(res => res.json())
    .then(station => {
      stationName.textContent = station.name
      stationAddress.textContent = station.address
    })
}

function handleClick(event){
  event.preventDefault()
  updateSpotlight()
}

function updateLastestPrice(){
  fetch()
}

initMap()
geoFindMe()
updateSpotlight()