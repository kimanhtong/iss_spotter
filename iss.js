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
  const link = `https://api.ipify.org?format=json`;
  request(link, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const resMsg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(resMsg, null);
    }
    const ip = JSON.parse(body).ip;
    return callback(null, ip);
    // return callback(null, body);
  });
}
module.exports = { fetchMyIP };
