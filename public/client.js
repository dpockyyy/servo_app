let map;

// async function initMap() {
//   const { Map } = await google.maps.importLibrary("maps");
//   const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
//   const map = new Map(document.getElementById("map"), {
//     center: { lat: -34.397, lng: 150.644 },
//     zoom: 13,
//     minZoom: 9,
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
async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const map = new Map(document.getElementById("map"), {
    center: { lat: 37.42, lng: -122.1 },
    zoom: 13,
    minZoom: 9,
    mapId: "4504f8b37365c3d0",
  });
  const priceTag = document.createElement("div");

  priceTag.className = "price-tag";
  priceTag.textContent = "$2.5M";

  const marker = new AdvancedMarkerElement({
    map,
    position: { lat: 37.42, lng: -122.1 },
    content: priceTag,
  });
}

initMap();
