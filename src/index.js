import * as Cesium from "cesium";
import "cesium/Widgets/widgets.css";
import "../src/css/main.css";
import { tle2czml } from "./tle2czml.js";

var viewer = new Cesium.Viewer('cesiumContainer', {
  baseLayerPicker: false, // uses Cesium Ion
  geocoder: false, // uses Cesium Ion
  imageryProvider: new Cesium.TileMapServiceImageryProvider({
    url : "tiles",
    fileFomate: "png",
    tilingScheme : new Cesium.GeographicTilingScheme(),
    maximumLevel: 5,
  }),
  timeline: false,
  shouldAnimate: true,
});

// set time to current time
viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;

// add lighting
viewer.scene.globe.enableLighting = true;

// replace the Cesium Ion logo with just a Cesium logo, this is not using Cesium Ion, only CesiumJS
viewer.scene.frameState.creditDisplay._cesiumCredit._html = '<a href="https://cesium.com/" target="_blank"><img src="Assets/Images/cesium_credit.png" title="Cesium"/></a>';

var portlandPin = viewer.entities.add({
  name: "PSAS",
  description: "\
<p>\
  Portland State Aerospace Society\
</p>",
  position: Cesium.Cartesian3.fromDegrees(-122.676483, 45.523064),
  billboard: {
    image: './static/PSAS_logo.png',
    scale: 0.2,
  },
});

Cesium.when.all([portlandPin])

const tle = [
  'OreSat0',
  '1 52010U 22026C   22080.28190160 -.00000067  00000+0  00000+0 0  9991',
  '2 52010  97.4900  81.3471 0023793 233.3236 126.5960 15.13579966   853'
];

const czml = tle2czml(tle);
viewer.dataSources.add(Cesium.CzmlDataSource.load(czml));
