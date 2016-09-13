const google = require('@google/maps');

// Expects the googleGeocode environment variable to be set
const googleMapsClient = google.createClient({ key: process.env.googleGeocode });

// Given some text, returns a promise that will be fulfilled by the
// google geocode api. The return object is much more complex than I expected it
// to be.
function geocode(text) {
  return new Promise((fulfill, reject) => {
    googleMapsClient.geocode({ address: text }, (err, response) => {
      if (err) reject(err);
      else {
        fulfill(response);
      }
    });
  });
}

exports.geocode = geocode;
