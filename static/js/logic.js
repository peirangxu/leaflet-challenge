// Define Functions
function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place,time, and the magnitude of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>" + "Magnitude: "+feature.properties.mag + "</p>");
    }

    // Create circlemarkers on the geoJson layer
    function geojsonMarkerOptions(feature) {
        return {

        radius: feature.properties.mag*5,
        fillColor: color(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        stroke: true,
        fillOpacity: 1
        }
    };
    var earthquakes=L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions(feature))},
        onEachFeature: onEachFeature
    });

    createMap(earthquakes);
};

function color(mag) {
    if (mag <= 1) {
        return "#B7F34D";
        } else if (mag <= 2) {
         return "#E1F34D";
         } else if (mag <= 3) {
        return "#F3DB4D";
         } else if (mag <= 4) {
         return "#F3BA4D";
         } else if (mag <= 5) {
         return "#F0A76B";
         } else {
         return "#F06B6B";
         }

     }

function createMap(earthquakes) {

    var lightmap=L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 18,
          id: "mapbox.light",
          accessToken: API_KEY
    })
    
    var map = L.map("map", {
            center: [39.09, -95.71],
            zoom: 6,
            layers: [lightmap,earthquakes]
    });
        
    var legend = L.control({position: 'bottomright'});
          
    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];
    
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                    '<i style="background:' + color(grades[i] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
                    console.log(color(grades[i]+1));
        }
    
        
            return div;
        };
    
    legend.addTo(map);
        
    }

//Request for the url
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data){
    console.log(data);
    //Run the createFeatures function
    createFeatures(data.features);
});
