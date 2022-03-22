import * as satellite from "satellite.js";

export function tle2czml(tle) {
  const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADJSURBVDhPnZHRDcMgEEMZjVEYpaNklIzSEfLfD4qNnXAJSFWfhO7w2Zc0Tf9QG2rXrEzSUeZLOGm47WoH95x3Hl3jEgilvDgsOQUTqsNl68ezEwn1vae6lceSEEYvvWNT/Rxc4CXQNGadho1NXoJ+9iaqc2xi2xbt23PJCDIB6TQjOC6Bho/sDy3fBQT8PrVhibU7yBFcEPaRxOoeTwbwByCOYf9VGp1BYI1BA+EeHhmfzKbBoJEQwn1yzUZtyspIQUha85MpkNIXB7GizqDEECsAAAAASUVORK5CYII=';
  const days = 3;
  const satrec = satellite.twoline2satrec(tle[1], tle[2]);
  
  const startTime = new Date(Date.now());
  let endTime = new Date(startTime);
  endTime.setDate(startTime.getDate() + days);

  const minutes = days * 24 * 60;
  const period = 1440 / tle[2].substring(52, 63);
  const minutesPeriod = period * 60;
  const numberOfFullOrbits = Math.floor(minutes / period);

  let leadTimeList = [];
  let trailTimeList = [];
  let intervalTime = new Date(startTime);
  intervalTime.setDate(startTime.getDate());
  let nextIntervalTime = new Date(startTime);
  for (let i = 0; i <= minutes; i += period) {
    if (i === 0) {
      intervalTime.setSeconds(startTime.getSeconds() + i);

      leadTimeList.push({
        "interval": startTime.toISOString() + "/" + intervalTime.toISOString(),
        "epoch": startTime.toISOString(),
        "number": [0, minutesPeriod, minutesPeriod, 0]
      });

      trailTimeList.push({
        "interval": startTime.toISOString() + "/" + intervalTime.toISOString(),
        "epoch": startTime.toISOString(),
        "number": [0, 0, minutesPeriod, minutesPeriod]
      });

    } else {
      nextIntervalTime.setSeconds(startTime.getSeconds() + i);

      leadTimeList.push({
        "interval": intervalTime.toISOString() + "/" + nextIntervalTime.toISOString(),
        "epoch": intervalTime.toISOString(),
        "number": [0, minutesPeriod, minutesPeriod, 0]
      });

      trailTimeList.push({
        "interval": intervalTime.toISOString() + "/" + nextIntervalTime.toISOString(),
        "epoch": intervalTime.toISOString(),
        "number": [0, 0, minutesPeriod, minutesPeriod]
      });

      intervalTime.setSeconds(startTime.getSeconds() + i);
    }
  }

  let res = [];
  let timeStep = 0;
  let currentTime = new Date(startTime)
  for (let i = 0; i < minutes*60; i += 300) {
    currentTime.setTime(startTime.getTime() + i*1000);
    const positionAndVelocity = satellite.propagate(satrec, currentTime);
    const positionEci = positionAndVelocity.position;
    res.push(i, positionEci.x*1000, positionEci.y*1000, positionEci.z*1000);
  }

  let czml = [
    {
      "id": "document",
      "version": "1.0",
      "clock": {
        "currentTime": startTime.toISOString(),
        "multiplier": 1,
        "interval": startTime.toISOString() + "/" + endTime.toISOString(),
        "range": "LOOP_STOP",
        "step": "SYSTEM_CLOCK",
      }
    },
    {
      "id": 52010,
      "description": "Orbit of OreSat0",
      "availability": startTime.toISOString() + "/" + endTime.toISOString(),
      "billboard": {
        "show": true,
        "image": image,
        "scale": 1.5,
      },
      "position": {
        "epoch": startTime.toISOString(),
        "cartesian": res,
        "interpolationAlgorithm": "LAGRANGE",
        "interpolationDegree": 5,
        "referenceFrame": "INERTIAL",
      },
      "label": {
        "show": true,
        "text": tle[0],
        "horizontalOrigin": "LEFT",
        "pixelOffset": {
          "cartesian2": [
            12, 0
          ]
        },
        "fillColor": {
          "rgba": [
            255, 0, 255, 255
          ]
        },
        "font": "11pt Lucida Console",
        "outlineColor": {
          "rgba": [
            0, 0, 0, 255
          ]
        },
        "outlineWidth": 2,
      },
      "path": {
        "show": [
          {
            "interval": startTime.toISOString() + "/" + endTime.toISOString(),
            "boolean": true
          }
        ],
        "width": 1,
        "leadTime": leadTimeList,
        "trailTime": trailTimeList,
        "resolution": 120,
        "material": {
          "solidColor": {
            "color": {
              "rgba": [
                255, 0, 255, 255
              ]
            }
          }
        },
      },
    }
  ];

  return czml;
}
