const helpers = require('../api_helpers/general');

// This is a remnant from another API that we stopped using when we found that
// Watson had news articles inside it already.
// It should be mostly functional.
const baseUrl = 'https://api.cognitive.microsoft.com/bing/v5.0/news/search';

function search(query) {
  let escapedQuery = query.split(' ').join('+');
  escapedQuery = encodeURIComponent(escapedQuery);
  const qUrl = `${baseUrl}?q=${escapedQuery}`;
  return helpers.getUrl(qUrl, { 'Ocp-Apim-Subscription-Key': process.env.bing });
}

function searchHandler(req, res, next) {
  search(req.query.q)
  .then(d => res.json(d)) // db logic in the news controller
  .catch(err => next(err));
}


exports.search = search;
exports.searchHandler = searchHandler;
