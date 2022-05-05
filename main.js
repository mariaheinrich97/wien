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

ERKLÄRUNG Defnineiren der Fukiton
funktion sagt, dass funkiton erstellt wird
addiere() = Name & Variablen
ausdruck in {} - was soll geschehen?
return gibt wert zurück
let ergebnis = ... ausführen der funkiton
*/


// Sehenswürdigekiten
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

    L.geoJSON(geojson).addTo(overlay);
    //L.geoJSON(geojson).addTo(map); - dann wären die Fähnchen immer sichtbar und nicht ausschaltbar
}
//loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");


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

    L.geoJSON(geojson).addTo(overlay);
    //L.geoJSON(geojson).addTo(map); - dann wären die Fähnchen immer sichtbar und nicht ausschaltbar
}
//loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");


//Fußgängerzonen Vieanna Sightseeing
async function loadZones(url) { //anders
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson); //nur ums in der Console zu sehen

    //Ein- und Ausschalten mit Haken
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Fußgängerzonen Vienna"); //ANDERS
    overlay.addTo(map);

    L.geoJSON(geojson).addTo(overlay);
    //L.geoJSON(geojson).addTo(map); - dann wären die Fähnchen immer sichtbar und nicht ausschaltbar
}
//loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");

//Hotels und Unterkünfte Vieanna Sightseeing
async function loadHotels(url) { //anders
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson); //nur ums in der Console zu sehen

    //Ein- und Ausschalten mit Haken
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Hotels & Unterkünfte Vienna"); //ANDERS
    overlay.addTo(map);

    L.geoJSON(geojson).addTo(overlay);
    //L.geoJSON(geojson).addTo(map); - dann wären die Fähnchen immer sichtbar und nicht ausschaltbar
}
//loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json");