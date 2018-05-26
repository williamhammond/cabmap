import React from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

class Application extends React.Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      lng: -73.9857,
      lat: 40.7484,
      zoom: 11
    };
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [lng, lat],
      zoom
    });
    map.on('load', function() {
        console.log("test")
        console.log(this.mapContainer)

    map.addSource('trees', {
        "type": "geojson",
        "data": "./data/trees.geojson"
    });

        map.addLayer({
            "id": "trees-heat",
            "type": "heatmap",
            "source": "trees",
            "maxzoom": 15,
            "paint": {
            // increase weight as diameter breast height increases
                "heatmap-weight": {
                    "property": "dbh",
                    "type": "exponential",
                    "stops": [
                        [1, 0],
                        [62, 1]
                    ]
                },
            // increase intensity as zoom level increases
                "heatmap-intensity": {
                    "stops": [
                        [11, 1],
                        [15, 3]
                    ]
                },
            // use sequential color palette to use exponentially as the weight increases
                "heatmap-color": [
                    "interpolate",
                    ["linear"],
                    ["heatmap-density"],
                    0, "rgba(236,222,239,0)",
                    0.2, "rgb(208,209,230)",
                    0.4, "rgb(166,189,219)",
                    0.6, "rgb(103,169,207)",
                    0.8, "rgb(28,144,153)"
                ],
                // increase radius as zoom increases
                "heatmap-radius": {
                    "stops": [
                        [11, 15],
                        [15, 20]
                    ]
                },
                // decrease opacity to transition into the circle layer
                "heatmap-opacity": {
                    "default": 1,
                    "stops": [
                        [14, 1],
                        [15, 0]
                    ]
                },
            }
        }, 'waterway-label');

        map.addLayer({
            "id": "trees-point",
            "type": "circle",
            "source": "trees",
            "minzoom": 14,
            "paint": {
            // increase the radius of the circle as the zoom level and dbh value increases
                "circle-radius": {
                    "property": "dbh",
                    "type": "exponential",
                    "stops": [
                        [{ zoom: 15, value: 1 }, 5],
                        [{ zoom: 15, value: 62 }, 10],
                        [{ zoom: 22, value: 1 }, 20],
                        [{ zoom: 22, value: 62 }, 50],
                    ]
                },
                "circle-color": {
                    "property": "dbh",
                    "type": "exponential",
                    "stops": [
                    [0, "rgba(236,222,239,0)"],
                    [10, "rgb(236,222,239)"],
                    [20, "rgb(208,209,230)"],
                    [30, "rgb(166,189,219)"],
                    [40, "rgb(103,169,207)"],
                    [50, "rgb(28,144,153)"],
                    [60, "rgb(1,108,89)"]
                    ]
                },
                "circle-stroke-color": "white",
                "circle-stroke-width": 1,
                "circle-opacity": {
                    "stops": [
                        [14, 0],
                        [15, 1]
                    ]
                }
            }
        }, 'waterway-label');
    });

    //click on tree to view dbh in a popup
    map.on('click', 'trees-point', function (e) {
    new mapboxgl.Popup()
        .setLngLat(e.features[0].geometry.coordinates)
        .setHTML('<b>DBH:</b> '+ e.features[0].properties.dbh)
        .addTo(map);
    });

  }

  render() {
    const { lng, lat, zoom } = this.state;

    return (
      <div>
        <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
        </div>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
      </div>
    );
  }
}

ReactDOM.render(<Application />, document.getElementById('app'));