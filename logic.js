// Add Title Layers
var baselayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});
const link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Add URL
d3.json(link, function(data) {
  Features(data.features);
});

function Features(earthquakefeatures) {
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3> Where: " + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<br><h2> Magnitude: " + feature.properties.mag + "</h2>");
  }

// Add Circle Markers
function createCircleMarker(feature,latlng){
    var options = {
        radius:feature.properties.mag*5,
        fillColor: CircleMarkerColor(feature.properties.mag),
        color: CircleMarkerColor(feature.properties.mag),
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.5
    }
    return L.circleMarker(latlng, options);
}
  
  var markers = L.geoJSON(earthquakefeatures, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });
  
  globalMap(markers);
}

// Add Colors to Markers
function CircleMarkerColor(Magnitude) {
  switch(true) {
      case (0.0 <= Magnitude && Magnitude <= 1.0):
        return "#051CB8";
      case (1.0 <= Magnitude && Magnitude <= 3.0):
        return "#29FFE8";
      case (3.0 <= Magnitude && Magnitude <= 5.0):
        return "#83FF29";
      case (5.0 <= Magnitude && Magnitude <= 7.0):
        return "#F6FF29";
      case (7.0 <= Magnitude && Magnitude <= 9.0):
        return "#DB911A";
        case (9.0 <= Magnitude ):
          return "#A40A15";
      default:
        return "#FFFFFF";
  }
}

let legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend'),
    Magnitudes = [0, 1, 3, 5, 7, 9],
        labels = [];
    for (let i = 0; i < Magnitudes.length; i++) {
        div.innerHTML +=
        '<i style="background:' + CircleMarkerColor(Magnitudes[i] + 1) + '"></i> ' +
        Magnitudes[i] + (Magnitudes[i + 1] ? '&ndash;' + Magnitudes[i + 1] + '<br>' : '+');
    }
    return div;
};

function globalMap(markers) {
  let baseMaps = {
    "Street Map": baselayer,
  };

  let overlayMaps = {
    Earthquakes: markers
  };

  let myMap = L.map("map", {
    center: [
      39.8282, -98.5795
    ],
    zoom: 3.5,
    layers: [baselayer, markers]
  });

// Add baeslayer 
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  legend.addTo(myMap);
}