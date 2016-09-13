// const bing = require('./bing');

const sherlock = require('../api_helpers/sherlock');

const model = require('../db/model');

const goog = require('../api_helpers/goog');

// Given a list of entities from the Watson API,
// return an obj with lat and lng params.
function getGeo(ent) {
  let max = 0;
  const geo = { lat: 0, lng: 0 };
  // Look at each of the entities, if it has a lat and lon check
  // if it has a higher relevance than our previous max
  // If it does update the new max params
  ent.forEach(e => {
    if (e.disambiguated.geo && e.relevance > max) {
      max = e.relevance;
  // Watson returns lat/long as a single string with a ' ' separating the
  // numbers
      const inter = e.disambiguated.geo.split(' ');
      geo.lat = parseFloat(inter[0]);
      geo.lng = parseFloat(inter[1]);
    }
  });
  return geo;
}


function resultsToDb(results) {
  // trim results to the appropriate format
  // toAdd is an Array of results formatted to match the db schema
  const toAdd = results.docs.map(doc => {
    const d = doc.source;
    const geo = getGeo(d.enriched.url.entities);
    return {
  // this is all just mapping watson return values to db schema names
      category: d.enriched.url.keywords,
      title: d.enriched.url.title,
      description: d.enriched.url.text,
      url: d.original.url,
      lat: geo.lat,
      lng: geo.lng
    };
  });
  // pass toAdd to the db
  return model.news.add(toAdd);
}

function handleSearch(req, res, next) {
  // get the location search from the request
  let location = req.query.q;
  // Format the location correctly for HTTP transport
  location = location.split(' ').join('+');
  location = encodeURIComponent(location);
  // geocode the word so that we have a lat long
  const locResult = goog.geocode(location);

  // sherlock is the Watson API file
  // give it the word from the query
  // send the results to the db after some light parsing and then
  sherlock.getByPlace(location).then(d => resultsToDb(d)).then(
      () => {
  // wait for the geocoding api to return (if it hasn't already)
        locResult.then(l => {
            // get the latitutde and longitude out of the center of the geometry returned
            // by the geocoding api
          const toSearch = l.json.results[0].geometry.location;
            // models searches by a radius. This is just hard coded
            // this could be used as user input later
          toSearch.rad = 25;
          model.news.getByLocation(toSearch)
         .then(dbResponse => {
            // send the response from the db getbylocation as json
           res.json(dbResponse);
         });
        });
      })
    .catch(e => next(e));
}

exports.handleSearch = handleSearch;
