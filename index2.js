const { nextISSTimesForMyLocation } = require (`./iss_promised`);

const printPassTimes = (passTimes) => {
  passTimes.forEach(passTime => {
    const datetime = new Date(0);
    datetime.setUTCSeconds(passTime.risetime);
    console.log(`Next pass at ${datetime} for ${passTime.duration} seconds!`);
  });
};
nextISSTimesForMyLocation ()
.then ((response) => {printPassTimes(response)})
.catch((error) => {
  console.log("It didn't work: ", error.message);
});
