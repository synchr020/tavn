
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'cluster-map', // container ID
  style: 'mapbox://styles/mapbox/outdoors-v12', // style URL
  center: place.geometry.coordinates, // starting position [lng, lat]
  zoom: 6, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
  .setLngLat(place.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(
        `<h3>${place.title}</h3><p>${place.location}</p>`
      )
  )
  .addTo(map);