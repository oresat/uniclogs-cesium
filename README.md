# Uniclogs Cesium

Cesium-based app to show where OreSat0 is.

## Make Earth Image Tiles

- Install [GDAL] for your system. See [GDAL Download].
- `$ mkdir data`
- `$ cd data`
- Download NASA's Blue Marble image: `$ wget https://eoimages.gsfc.nasa.gov/images/imagerecords/74000/74218/world.200412.3x21600x10800.png`
- Turn the png into a geoTIFF: `$ gdal_translate -of GTiff -a_srs EPSG:4326 -a_ullr -180 90 180 -90 world.200412.3x21600x10800.png world.200412.3x21600x10800.tif`
- Generate tiles from geoTIFF: `$ gdal2tiles.py world.200412.3x21600x10800.tif tiles -p geodetic --tmscompatible --process=4`
- `$ cd -`

## Run Cesium App

- Install `npm` for your system
- Install dependencies: `$ npm update`
- Run: `$ npm start`
- Goto `localhost:8080` in a web browser

[GDAL]:https://gdal.org
[GDAL Download]:https://gdal.org/download.html
