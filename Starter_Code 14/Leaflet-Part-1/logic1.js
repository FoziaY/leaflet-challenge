// Step 1: Define the URL for the GeoJSON earthquake data
var earthquakeDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Step 2: Create the Leaflet map
var map = L.map("map", {
    center: [37.09, -95.71], // Set initial map center
    zoom: 5 // Set initial zoom level
});

// Add a tile layer from OpenStreetMap as the base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Step 3: Retrieve and process earthquake data
d3.json(earthquakeDataUrl).then(function (earthquakeData) {

    // Function to define map styling based on earthquake data
    function getMapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColorForDepth(feature.geometry.coordinates[2]),
            color: "black",
            radius: getRadiusForMagnitude(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Function to determine color based on earthquake depth
    function getColorForDepth(depth) {
        if (depth > 90) {
            return "red";
        } else if (depth > 70) {
            return "orangered";
        } else if (depth > 50) {
            return "orange";
        } else if (depth > 30) {
            return "gold";
        } else if (depth > 10) {
            return "yellow";
        } else {
            return "lightgreen";
        }
    }

    // Function to determine marker radius based on earthquake magnitude
    function getRadiusForMagnitude(magnitude) {
        return magnitude === 0 ? 1 : magnitude * 4;
    }

    // Step 4: Add earthquake data to the map
    L.geoJson(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: getMapStyle,
        onEachFeature: function (feature, layer) {
            // Add pop-up data to each earthquake point
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
        }
    }).addTo(map);

    // Step 5: Add legend to the map
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend"),
            depthRanges = [-10, 10, 30, 50, 70, 90];

        for (var i = 0; i < depthRanges.length; i++) {
            var color = getColorForDepth(depthRanges[i] + 1);
            div.innerHTML +=
                '<i style="background:' + color + '"></i> ' + depthRanges[i] + (depthRanges[i + 1] ? '&ndash;' + depthRanges[i + 1] + '<br>' : '+');
        }g
        return div;
    };
    legend.addTo(map);

});