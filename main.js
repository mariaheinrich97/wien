/* OGD Wien Beispiel */


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
    zoom: 12,
    layers: [
        startLayer
    ]
})

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

let sightLayer = L.featureGroup();

layerControl.addOverlay(sightLayer, "Sehenswürdigkeiten");

let mrk = L.marker([stephansdom.lat, stephansdom.lng]).addTo(sightLayer);

sightLayer.addTo(map);

// Maßstab hinzufügen
L.control.scale({
    imperial: false,
}).addTo(map);

// z. B. für Smartphones gut
L.control.fullscreen().addTo(map);
// map.addControl(L.control.fullscreen());

// miniMap = Übersichtskarte
let miniMap = new L.Control.MiniMap(
    L.tileLayer.provider("BasemapAT"),
).addTo(map);

// Karten
// Scale
// MiniMap