const helpers = require('../api_helpers/general');

const qs = require('querystring');

// given a placename, returns all news articles with that entity in the title
// and body
function getByPlace(place) {
  let qUrl = `https://gateway-a.watsonplatform.net/calls/data/GetNews`;
  let queries = {
    outputMode: 'json',
    start: 'now-1d',
    end: 'now',
    count: 100,
    return: 'enriched.url.title,enriched.url.text,original.url,enriched.url.entities,enriched.url.publicationDate.date',
    apikey: process.env.alchemy
  };
  let escapedPlace = place.split(' ').join('+');
  escapedPlace = encodeURIComponent(escapedPlace);
  queries = qs.stringify(queries);
  qUrl = `${qUrl}?${queries}`;
  qUrl += `&q.enriched.url.entities.entity=|text=${escapedPlace}|`;
  return helpers.getUrl(qUrl).then(d => JSON.parse(d).result);
}

exports.getByPlace = getByPlace;
