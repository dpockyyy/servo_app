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
  const { Map } = await google.maps.importLibrary("maps");
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
      });
  })
)
}

initMap();
