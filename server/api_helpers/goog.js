// const google = require('googleapis');
const google = require('@google/maps');

const googleMapsClient = google.createClient({ key: process.env.googleGeocode });

// const geocoder = new google.maps.Geocoder();

// const gCloud = require('google-cloud');
// returns a promise that will (hopefully) be fulfilled by the Google API

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
