const fetchMyIP = require('./iss').fetchMyIP;
const fetchCoordsByIP = require('./iss').fetchCoordsByIP;
let ipAdd = null;
let errIPMsg = null;
let errCoorMsg = null;
let posCoordinate = null;

fetchMyIP((error, ip) => error === null ? ipAdd = ip : errIPMsg = error);
// Wait 1 second to get the IP Address
setTimeout(() => errIPMsg === null
  ? fetchCoordsByIP(ipAdd, (error, coordinates) => error === null ? posCoordinate = coordinates : errCoorMsg = error)
  : console.log(`No IP is found: ${errIPMsg}`), 1000);

// Wait 2 seconds to get the IP Address and the coordinates
setTimeout(() => {
  if (errIPMsg === null) {
    if (errCoorMsg === null) {
      console.log(posCoordinate);
    } else {
      console.log(`No Coordinates is found: ${errCoorMsg}`);
    }
  }
}, 2000);
