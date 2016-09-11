const helpers = require('../api_helpers/general');
const model = require('../db/model');

const baseUrl = 'https://api.cognitive.microsoft.com/bing/v5.0/news/search';

function search(query) {
  let escapedQuery = query.split(' ').join('+');
  escapedQuery = encodeURIComponent(escapedQuery);
  const qUrl = `${baseUrl}?q=${escapedQuery}`;
  return helpers.getUrl(qUrl, { 'Ocp-Apim-Subscription-Key': process.env.bing });
}

function searchHandler(req, res, next) {
  search(req.query.q)
  .then(d => res.json(d)) // add db logic
  .catch(err => next(err));
}


exports.search = search;
exports.searchHandler = searchHandler;
