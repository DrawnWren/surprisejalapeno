// const bing = require('./bing');

const sherlock = require('../api_helpers/sherlock');

const model = require('../db/model');

const goog = require('../api_helpers/goog');


function getGeo(ent) {
  let max = 0;
  const geo = { lat: 0, lng: 0 };
  ent.forEach(e => {
    if (e.disambiguated.geo && e.relevance > max) {
      max = e.relevance;
      const inter = e.disambiguated.geo.split(' ');
      geo.lat = parseFloat(inter[0]);
      geo.lng = parseFloat(inter[1]);
    }
  });
  return geo;
}

function resultsToDb(results) {
  // trim results to the appropriate format
  const toAdd = results.docs.map(doc => {
    const d = doc.source;
    const geo = getGeo(d.enriched.url.entities);
    return {
      category: d.enriched.url.keywords,
      title: d.enriched.url.title,
      description: d.enriched.url.text,
      url: d.original.url,
      lat: geo.lat,
      lng: geo.lng
    };
  });
  return model.news.add(toAdd);
}

/*
function searchAndAdd(query) {
  return bing.search(query).then( // assumes that the results back from bing are correctly formatted
      d => resultsToDb(d)
  );
}

function handleSearch(req, res, next) {
  const location = goog.geocode(req.params.q);
  searchAndAdd(req.params.q).then(() => res.json(model.getByLocation(location)))
  .catch(e => next(e));
}
*/

function handleSearch(req, res, next) {
  const location = req.query.q;
  const locResult = goog.geocode(location); // probably needs to get parsed into lat/long

  sherlock.getByPlace(location).then(d => resultsToDb(d)).then(
      () => {
        locResult.then(l => {
          const toSearch = l.json.results[0].geometry.location;
          toSearch.rad = 25;
          model.news.getByLocation(toSearch)
         .then(dbResponse => {
           res.json(dbResponse);
         });
        });
      })
    .catch(e => next(e));
}

exports.handleSearch = handleSearch;
