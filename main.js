/* OGD Wien Beispiel */
// Zeilenumbruch: Option + Z


let stephansdom = {
    lat: 48.208493,
    lng: 16.373118,
    title: "Stephansdom",
};

let startLayer = L.tileLayer.provider("BasemapAT.grau")
// L
//tileLayer - ein Layer
//providers - genaue Kartenteile

let map = L.map("map", {
    center: [stephansdom.lat, stephansdom.lng],
    zoom: 16,
    layers: [
        startLayer
    ]
})
//Layer einbinden

let layerControl = L.control.layers({
    "BasemapAT Grau": startLayer,
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "Basemap mit Orthofoto und Beschriftung": L.layerGroup([
        L.tileLayer.provider("BasemapAT.orthofoto"),
        L.tileLayer.provider("BasemapAT.overlay"),
    ])
}).addTo(map);

layerControl.expand();

/*
let sightLayer = L.featureGroup();
layerControl.addOverlay(sightLayer, "Sehenswürdigkeiten");

let mrk = L.marker([stephansdom.lat, stephansdom.lng]).addTo(sightLayer);
sightLayer.addTo(map);
*/

// Maßstab hinzufügen
L.control.scale({
    imperial: false,
}).addTo(map);

// z. B. für Smartphones gut
L.control.fullscreen().addTo(map);
// map.addControl(L.control.fullscreen());

// miniMap = Übersichtskarte
let miniMap = new L.Control.MiniMap(
    L.tileLayer.provider("BasemapAT"), {
        toggleDisplay: true,
    }
).addTo(map);


/*
function addiere(zahl1, zahl2) {
    let summe = zahl1 + zahl2;
    return summe; // ohne return, würde nichts zurückgegeben werden
}
let ergebnis = addiere(2,2); //Funktion wird aufgerufen
console.log(ergebnis);

ERKLÄRUNG Defnineiren der Funkiton
funktion sagt, dass funkiton erstellt wird
addiere() = Name & Variablen
ausdruck in {} - was soll geschehen?
return gibt wert zurück
let ergebnis = ... ausführen der Funktion
*/


// Sehenswürdigekeiten
async function loadSites(url, layername) {
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson); //nur ums in der Console zu sehen

    //Ein- und Ausschalten mit Haken
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, layername);
    overlay.addTo(map);

    L.geoJSON(geojson, {
        pointToLayer: function (geoJsonPoint, latlng) {
            //L.marker(latlng).addTo(map);
            //console.log(geoJsonPoint.properties.NAME);
            let popup = `
        <img src="${geoJsonPoint.properties.THUMBNAIL}" alt=""><br>
        <strong>${geoJsonPoint.properties.NAME}</strong>
        <hr>
        Adresse: ${geoJsonPoint.properties.ADRESSE}<br>
        <a href="${geoJsonPoint.properties.WEITERE_INF}">Weblink</a>
        `;
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: "icons/photo.png",
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            }).bindPopup(popup);
        }
    }).addTo(overlay);
    //L.geoJSON(geojson).addTo(map); - dann wären die Fähnchen immer sichtbar und nicht ausschaltbar
}
loadSites("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json", "Sehenswürdigkeiten");


/* ERLÄUTERUNG Sehenswürdigekeiten
async: wartet, bis vorgang abgeschlossen, bevor der nächste ausgeführt wird

Daten abholen / aufrufen
await fetch(url) - warten bis url aufgerufen wrude und spechern
await response.json (); warten, bis alle Daten aufgerufen wurden

loadSites definiert die VAriabel und ruft die URL mit der Tabelle Sehenswürdigkeiten online auf

    L.geoJSON(geojson).addTo(map); - fügt 63 Marker in die KArte ein (sichtbarmachen)
*/

//Haltestellen Vieanna Sightseeing
async function loadStops(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson); //nur ums in der Console zu sehen

    //Ein- und Ausschalten mit Haken
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Haltestellen Vienna Sightseeing");
    overlay.addTo(map);

    L.geoJSON(geojson, {
        pointToLayer: function (geoJsonPoint, latlng) {
            //Wichtig um Attribute des Popups aufzurufen:
            //console.log(geoJsonPoint.properties); 
            let popup = ` 
                    <strong>${geoJsonPoint.properties.LINE_NAME}</strong><br>
                    Station ${geoJsonPoint.properties.STAT_NAME}
        `;
            //Attribute im popup unterschiedlich
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `icons/bus_${geoJsonPoint.properties.LINE_ID}.png`,
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            }).bindPopup(popup);
        }
    }).addTo(overlay);
    //L.geoJSON(geojson).addTo(map); - dann wären die Fähnchen immer sichtbar und nicht ausschaltbar
}
loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");
//clrs.cc - Farben für Stationen


//Load... ändern
//URL ändern
//falls loadLines(url) - dann immer das ändern, da die letze Variale verwendet wird, ansonsten layername als extra variable definieren (dann nach URL aufrufen auch Variable einen Namen vergeben)
//andere Möglichkeit: keinen layernamen als variable, sondern Funktionsname loadPoly geändert

//Liniennetz Vieanna Sightseeing
async function loadLines(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson); //nur ums in der Console zu sehen

    //Ein- und Ausschalten mit Haken
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Liniennetz Vienna Sightseeing"); //
    overlay.addTo(map);


    L.geoJSON(geojson, {
        style: function (feature) {
            //console.log(feature);

            let colors = {
                "Red Line": "#FF4136",
                "Yellow Line": "#FFDC00",
                "Blue Line": "#0074D9",
                "Green Line": "#2ECC40",
                "Grey Line": "#AAAAAA",
                "Orange Line": "#FF851B"
            }

            return {
                color: `${colors[feature.properties.LINE_NAME]}`,
                weight: 5,
                //dashArray: [10, 6],
            }
        }
    }).bindPopup(function (layer) {
        //return layer.feature.properties.description;
        return `
        <h4> ${layer.feature.properties.LINE_NAME}</h4>
        von: ${layer.feature.properties.FROM_NAME}
        <br>
        nach: ${layer.feature.properties.TO_NAME}
        `;
    }).addTo(overlay);
    //L.geoJSON(geojson).addTo(map); - dann wären die Fähnchen immer sichtbar und nicht ausschaltbar
}

//L.geoJSON(geojson).addTo(map); - dann wären die Fähnchen immer sichtbar und nicht ausschaltbar
loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");


//Fußgängerzonen Vieanna Sightseeing
async function loadZones(url) { //anders
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson); //nur ums in der Console zu sehen

    //Ein- und Ausschalten mit Haken
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Fußgängerzonen Vienna"); //ANDERS
    overlay.addTo(map);

    L.geoJSON(geojson, {
        style: function (feature) {
            return {
                color: "#F012BE",
                weight: 1,
                opacity: 0.2,
                //fillColor: "#F012BE",
                fillOpacity: 0.2,
            }
        }

    }).bindPopup(function (layer) {
        return `
        <h4>Fußgängerzone ${layer.feature.properties.ADRESSE}</h4>
        <p>Zeitraum: ${layer.feature.properties.ZEITRAUM || ""}</p>
        <p>${layer.feature.properties.AUSN_TEXT || ""}</p>
        `;
        // || sonst nichts reinschreiben - da sonst das Feld gezeigt wri und nicht schön aussieht
    }).addTo(overlay);
}
loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");

//Hotels und Unterkünfte Vieanna Sightseeing
async function loadHotels(url) { //anders
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson); //nur ums in der Console zu sehen

    //Ein- und Ausschalten mit Haken
    let overlay = L.markerClusterGroup({
        disableClusteringAtZoom: 17
    });
    layerControl.addOverlay(overlay, "Hotels & Unterkünfte Vienna"); //ANDERS
    overlay.addTo(map);

    let hotelsLayer = L.geoJSON(geojson, {
        pointToLayer: function (geoJsonPoint, latlng) {
            //L.marker(latlng).addTo(map);

            // # sucht id
            // . sucht nach Klasse
            let searchList = document.querySelector("#searchList");
            //console.log(searchList)
            searchList.innerHTML += `<option value="${geoJsonPoint.properties.BETRIEB}"></option>`;
            //console.log(document.querySelector("#searchList").innerHTML)
            //console.log(`option value="${geoJsonPoint.properties.BETRIEB}"></option>`);

            if (geoJsonPoint.properties.BETRIEBSART_TXT == "Hotel") {
                let iconStay = "icons/hotel_0star.png"
            } else if (geoJsonPoint.properties.BETRIEBSART_TXT == "Pension") {
                let iconStay = "lodging_0star.png"
            } else {
                let iconStay = "lodging_apartment-2"
            }

            let popup = `
        <strong>
        Name: ${geoJsonPoint.properties.BETRIEB}<br>
        Betriebsart: ${geoJsonPoint.properties.BETRIEBSART_TXT}<br>
        Kategorie: ${geoJsonPoint.properties.KATEGORIE_TXT}<br>
        </strong>
        <hr>
        Adresse: ${geoJsonPoint.properties.ADRESSE}<br>
        Bezirk: ${geoJsonPoint.properties.BEZIRK}<br>
        Telefonnummer: ${geoJsonPoint.properties.KONTAKT_TEL}<br>
        <a href = mailto:${geoJsonPoint.properties.KONTAKT_EMAIL}>E-Mail</a><br>
        <a href="${geoJsonPoint.properties.WEBLINK1}">Weblink</a>
        `;

            if (geoJsonPoint.properties.BETRIEBSART_TXT == "Hotel") {
                //let iconStay = "icons/hotel_0star.png"
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: "icons/hotel_0star.png",
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37]
                    })
                }).bindPopup(popup);
            } else if (geoJsonPoint.properties.BETRIEBSART_TXT == "Pension") {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: "icons/lodging_0star.png",
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37]
                    })
                }).bindPopup(popup);
            } else {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: "icons/apartment-2.png",
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37]
                    })
                }).bindPopup(popup);
            }
        }
    }).addTo(overlay);

    // Anzeigen des gesuchten Hotels und der Inhalte
    
    let form = document.querySelector("#searchForm");
    form.suchen.onclick = function () {
        //console.log(form.hotel.value);
        hotelsLayer.eachLayer(function (marker) {
            //console.log(marker);
            //console.log(marker.getLatLng())
            //console.log(marker.getPopup())
            //console.log(marker.feature.properties.BETRIEB)

            if (form.hotel.value == marker.feature.properties.BETRIEB) {
                //console.log(marker.getLatLng())
                //console.log(marker.getPopup())
                //console.log(marker.feature.properties.BETRIEB)
                map.setView(marker.getLatLng(), 17) // Karte zoomen: Koordinaten abrufen und 17 als Zoom wählen
                marker.openPopup()
            }
        })
    }
}
loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json");