// iss_promised.js
const request = require('request-promise-native');

const fetchMyIP = () => {
  const link = 'https://api.ipify.org?format=json';
  return request(link);
};


/* 
 * Makes a request to freegeoip.app using the provided IP address, to get its geographical information (latitude/longitude)
 * Input: JSON string containing the IP address
 * Returns: Promise of request for lat/lon
 */
const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request (`https://freegeoip.app/json/${ip}`);
};

const fetchISSFlyOverTimes = function(body) {
  const coorparsed = JSON.parse(body);
  const coords = {
    latitude: coorparsed.latitude.toFixed(5),
    longitude: coorparsed.longitude.toFixed(5)
  }
  return request (`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`);
}

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
  .then (fetchCoordsByIP)
  .then (fetchISSFlyOverTimes)
  .then (body => {
    const response  = JSON.parse(body).response;
    return response;  
  });
};

module.exports = { nextISSTimesForMyLocation };
