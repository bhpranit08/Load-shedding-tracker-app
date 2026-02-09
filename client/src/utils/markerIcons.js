import L from "leaflet"

const createIcon = (color) =>
    new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    })

export const statusIcons = {
    unverified: createIcon("grey"),
    likely: createIcon("orange"),
    confirmed: createIcon("green"),
    resolved: createIcon("blue"),
    "false": createIcon("red"), // Quote the reserved keyword
}