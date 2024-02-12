// let map;

// async function initMap() {
//   // Request needed libraries.
//   const { Map } = await google.maps.importLibrary("maps");
//   const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
//   const map = new Map(document.getElementById("map"), {
//     center: { lat: 37.42, lng: -122.1 },
//     zoom: 13,
//     minZoom: 9,
//     mapId: "4504f8b37365c3d0",
//   });
  
//   const priceTag = document.createElement("div");

//   priceTag.className = "price-tag";
//   priceTag.textContent = "$2.5M";

//   const marker = new AdvancedMarkerElement({
//     map,
//     position: { lat: 37.42, lng: -122.1 },
//     content: priceTag,
//   });
// }

// initMap();

let map;

async function initMap() {
  // Request needed libraries.
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const map = new Map(document.getElementById("map"), {
    center: { lat: -37.42, lng: 144 },
    zoom: 13,
    minZoom: 9,
    mapId: "4504f8b37365c3d0",
  });
  
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

initMap();

window.addEventListener("load", () => {
  clock();
  function clock() {
    const today = new Date();

    // get time components
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();

    //add '0' to hour, minute & second when they are less 10
    const hour = hours < 10 ? "0" + hours : hours;
    const minute = minutes < 10 ? "0" + minutes : minutes;
    const second = seconds < 10 ? "0" + seconds : seconds;

    //make clock a 12-hour time clock
    const hourTime = hour > 12 ? hour - 12 : hour;

    // if (hour === 0) {
    //   hour = 12;
    // }
    //assigning 'am' or 'pm' to indicate time of the day
    const ampm = hour < 12 ? "AM" : "PM";

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
    
    const time = hourTime + ":" + minute + ":" + second + ampm;

    //combine current date and time
    const dateTime = dayName + " " + time;

    //print current date and time to the DOM
    document.getElementById("date-time").innerHTML = dateTime;
    setTimeout(clock, 1000);
  }
});