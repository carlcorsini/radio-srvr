const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8000;
const cors = require('cors');
const Helpers = require('./helpers');

const dns = require('dns');
const util = require('util');
const resolveSrv = util.promisify(dns.resolveSrv);
const posts = [
  {
    name: 'Berlin',
    latitude: '52.520008',
    longitude: '13.404954',
  },
  {
    name: 'Hamburg',
    latitude: '53.551086',
    longitude: '9.993682',
  },
  {
    name: 'München',
    latitude: '48.135124',
    longitude: '11.581981',
  },
  {
    name: 'Lübeck',
    latitude: '53.865467',
    longitude: '10.686559',
  },
  {
    name: 'Schwerin',
    latitude: '53.635502',
    longitude: '11.401250',
  },
];
var closeStations = [];
var centerLat = 38.346169;
var centerLng = -122.696472;

let serverEndPoint
// https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates

/**
 * Get a list of base urls of all available radio-browser servers
 * Returns: array of strings - base urls of radio-browser servers
 */
function get_radiobrowser_base_urls() {
    return resolveSrv("_api._tcp.radio-browser.info").then(hosts => {
        hosts.sort();
        return hosts.map(host => "https://" + host.name);
    });
}

/**
 * Get a random available radio-browser server.
 * Returns: string - base url for radio-browser api
 */
function get_radiobrowser_base_url_random() {
    return get_radiobrowser_base_urls().then(hosts => {
        var item = hosts[Math.floor(Math.random() * hosts.length)];
        return item;
    });
}

get_radiobrowser_base_urls().then(hosts => {
    console.log("All available urls")
    console.log("------------------")
    for (let host of hosts) {
        console.log(host);
    }
    console.log();

    return get_radiobrowser_base_url_random();
}).then(random_host => {
    console.log("Random base url")
    console.log("------------------")
    console.log(random_host);
    serverEndPoint = random_host
});

if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '15mb' }));
app.use(cors());


app.get('/radio', async (req, res) => {
  let helper = new Helpers(centerLat, centerLng)

  
  
  
  const params = {
    countrycode: 'US',
    // state: 'CA'
};


  const options = {
    method: 'POST',
    mode: 'cors', 
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(params),
  }
  
  console.log('radio is loud and clear')
  // console.log(serverEndPoint)
  let response = await fetch("http://de1.api.radio-browser.info/json/stations/bycountrycodeexact/US", options)
  let result = await response.json()
  result.forEach((station) => {
    if (helper.getDistanceFromLatLonInKm(station.geo_lat, station.geo_long) < 150) {
      closeStations.push(station);
    }
  });
  
  res.status(200).send(closeStations)
});

app.post('/radio', async (req, res) => {
  const helpers = new Helpers()
  // get radio data
  // look for radio stations
  // return list of radio stations

  
  const params = {
    countrycode: 'US',
};


  // const options = {
  //   method: 'POST',
  //   mode: 'cors', 
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   redirect: 'follow',
  //   referrerPolicy: 'no-referrer',
  //   body: JSON.stringify(params),
  // }
  
  // console.log('radio is loud and clear')
  // console.log(serverEndPoint)
  // let response = await fetch("http://de1.api.radio-browser.info/json/stations/bycountrycodeexact/US", options)
  // let result = await response.json()
  console.log(result)
  res.status(200).send(result)
});



app.all('*', (req, res, next) => res.sendStatus(404));

app.use((err, req, res, next) => {
  res.status(err.status).json(err);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Radio Server is running on ${port}!`);
  });
}

module.exports = app;