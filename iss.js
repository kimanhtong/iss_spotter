
const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = (callback) => {
  // use request to fetch IP address from JSON API
  const link = 'https://api.ipify.org?format=json';
  request(link, (errLink, response, body) => {
    if (errLink) {
      const errMsg1 = `Site for IP searched doesn't exist: ${errLink.message}`;
      return callback(errMsg1, null);
    }
    if (response.statusCode !== 200) {
      const resMsg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(resMsg, null);
    }
    try {
      const ip = JSON.parse(body).ip;
      return callback(null, ip);
    } catch (errFile) {
      const errMsg2 = `Unexpected IP file format: ${errFile.message}`;
      return callback(errMsg2, null);
    }
  });
}
// https://freegeoip.app/json/70.49.35.154

const fetchCoordsByIP = (ip, callback) => {
  const link = `https://freegeoip.app/json/${ip}`;
  request(link, (error, response, body) => {
    if (error) {
      const errMsg1 = `Site for coordinates searched doesn't exist: ${error}`;
      return callback(errMsg1, null);
    }
    if (response.statusCode !== 200) {
      const resMsg = `Status Code ${response.statusCode} when fetching Coordinates for IP. Response: ${body}`;
      return callback(resMsg, null);
    }
    try {
      const coorparsed = JSON.parse(body);
      const coordinates = {
        latitude: coorparsed.latitude.toFixed(5),
        longitude: coorparsed.longitude.toFixed(5)
      }
      return callback(null, coordinates);
    } catch (errFile) {
      const errMsg2 = `Unexpected Coordinate file format: ${errFile.message}`;
      return callback(errMsg2, null);
    }
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function (coords, callback) {
  const link = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(link, (error, response, body) => {
    if (error) {
      const errMsg1 = `Site for flies searched doesn't exist: ${error}`;
      return callback(errMsg1, null);
    }
    if (response.statusCode !== 200) {
      const resMsg = `Status Code ${response.statusCode} when fetching Flies for Coordinate. Response: ${body}`;
      return callback(resMsg, null);
    }
    try {
      const flyOverTimes = JSON.parse(body).response;
      return callback(null, flyOverTimes);
    } catch (errFile) {
      const errMsg2 = `Unexpected Fly file format: ${errFile.message}`;
      return callback(errMsg2, null);
    }
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
const nextISSTimesForMyLocation = function(callback) {
  let ipAdd = null;
  let posCoordinate = null;
  let flyOTimes = null;
  let errIPMsg = null;
  let errCoorMsg = null;
  let errFOTMsg = null;

  fetchMyIP((error, ip) => error === null ? ipAdd = ip : errIPMsg = error);
  // Wait 1 second to get the IP Address
  setTimeout(() => errIPMsg === null
    ? fetchCoordsByIP(ipAdd, (error, coordinates) => error === null ? posCoordinate = coordinates : errCoorMsg = error)
    : console.log(`No IP is found: ${errIPMsg}`), 600);

  // Wait 2 seconds to get the coordinates
  setTimeout(() => {
    if (errIPMsg === null) {
      if (errCoorMsg === null) {
        fetchISSFlyOverTimes(posCoordinate, (error, flyOverTimes) => error === null ? flyOTimes = flyOverTimes : errFOTMsg = error)
      } else {
        console.log(`No Coordinates is found: ${errCoorMsg}`);
      }
    }
  }, 2000);

  // Wait 3 seconds to get the flies over times
  setTimeout(() => {
    if (errCoorMsg === null) {
      if (errFOTMsg === null) {
        console.log(flyOTimes);
        flyOTimes.forEach(flyOverTime => {
          const datetime = new Date(0);
          datetime.setUTCSeconds(flyOverTime.risetime);
          console.log(`Next pass at ${datetime} for ${flyOverTime.duration} seconds!`);
        });
      } else {
        console.log(`No Flies Over TIme are found: ${errFOTMsg}`);
      }
    }
  }, 3000);
}

module.exports = {
  nextISSTimesForMyLocation
}
