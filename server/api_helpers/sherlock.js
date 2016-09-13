const helpers = require('../api_helpers/general');

const qs = require('querystring');

// given a placename, returns all news articles with that entity in the title
// and body
function getByPlace(place) {
  // Base Alchemy News API endpoint
  let qUrl = 'https://gateway-a.watsonplatform.net/calls/data/GetNews';
  // Configure all of the individual queries for querying the endpoint
  // See the alchemy news api for what options are available
  let queries = {
    outputMode: 'json',
    start: 'now-1d',
    end: 'now',
    count: 100,
    return: 'enriched.url.title,enriched.url.text,original.url,enriched.url.entities,enriched.url.publicationDate.date',
    apikey: process.env.alchemy
  };
  // Turn all of the queries into a query string
  queries = qs.stringify(queries);
  // Append the queries to the base url
  qUrl = `${qUrl}?${queries}`;
  // Append the entity search to the base url.
  qUrl += `&q.enriched.url.entities.entity=|text=${place}|`;
  // return a promise from the helpers geturl function
  return helpers.getUrl(qUrl).then(d => JSON.parse(d).result);
}

exports.getByPlace = getByPlace;
