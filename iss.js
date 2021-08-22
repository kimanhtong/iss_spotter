
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

module.exports = {
  fetchMyIP,
  fetchCoordsByIP
}
