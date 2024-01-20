let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function createMap(earthquakes) {
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.carto.com/attributions">CARTO</a>'
    });

    // Define baseMaps and overlays
    let baseMaps = {
        "Street Map": street
    };

    let overlays = {
        "Earthquakes": earthquakes
    };

    // Create map
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // BaseMaps and OverlayMaps
    L.control.layers(baseMaps, overlays).addTo(myMap);

    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (myMap) {
        let div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 60, 90],
            labels = [],
            legendInfo = "<h5>Magnitude</h5>";

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    // Add legend to map
    legend.addTo(myMap);
}

d3.json(queryUrl).then(function (earthquakeData) {
    console.log(earthquakeData);
    createFeatures(earthquakeData.features);
});

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[2]}`);
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    });

    createMap(earthquakes);
}

function createMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "pink",
        fillOpacity: 1
    });
}

function markerSize(magnitude) {
    return magnitude * 5;
}

//Create the markers color based on their depth 
function markerColor(depth) {
    if (depth > 90) {
        return 'orange';
    } else if (depth > 70) {
        return 'blue';
    } else if (depth > 50) {
        return 'yellow';
    } else if (depth > 30) {
        return 'gray';
    } else if (depth > 10) {
        return 'red';
    } else {
        return 'green';
    }
}