'use strict';

var Q       = require('q');
var request = require('request');
var cheerio = require('cheerio');

/*
 * Remove leading and trailing whitespace,
 * remove any newlines or returns,
 * then remove any extra spaces.
 */
function formatText(text) {

  text = text.trim();
  text = text.replace(/\r?\n|\r/g, '');
  text = text.replace(/ +(?= )/g, '');

  return text;

}

/* ====================================================== */

exports.search = function(query) {

  var mainDeferred = Q.defer();

  /*
   * Web scraping must be used on bandcamp.com/search due to lack of public API.
   * 1. iterate over all results inside .results > .result-items
   * 2. only process results of class `searchresult track`
   *      - title of track is a link inside div of class `heading`
   *      - artist and album are inside div of class `subhead`, of the format
   *        "from <album name> by <artist>"
   *      - track URL is a link inside div of class `itemurl`
   *
   * @param {String} searchQuery
   * @param {Number} pageNumber
   * @param {Number} maxPages
   * @param {Array} searchResults
   */
  var getSearchResults = function(searchQuery, pageNumber, maxPages, searchResults) {
    if ( typeof searchResults === 'undefined' ) {
      searchResults = [];
    }
    var deferred = Q.defer();
    var albumArtistRegex = /from (.+?) by (.+)/i;
    var searchUrl = 'http://bandcamp.com/search?';
    var subheadText;
    var regexResult;
    var trackResult;

    // format query for Bandcamp search
    if ( pageNumber > 1 ) {
      searchUrl += 'page=' + pageNumber;
    }
    searchQuery = searchQuery.replace('%20', '+').replace(' ', '+');
    searchUrl += '&q=' + searchQuery;

    // retrieve and scrape Bandcamp search results page
    request(searchUrl, function(error, response, body){
      if ( error ) {
        deferred.reject(error);
      }

      var $ = cheerio.load(body);

      // process each search result
      if( $('.searchresult.track').length ) {
        $('.searchresult.track').each(function() {
          subheadText = formatText($(this).find('.subhead').text());
          regexResult = albumArtistRegex.exec(subheadText);

          trackResult = {
            source: 'bandcamp',
            url: formatText($(this).find('.itemurl').text()),
            title: formatText($(this).find('.heading').text()),
            album: regexResult ? regexResult[1] : null,
            artist: regexResult ? regexResult[2] : null
          };

          searchResults.push(trackResult);
        });

        // Recurse as long as there are still results and we aren't at max page number
        if ( pageNumber !== maxPages ) {
          deferred.resolve(getSearchResults(searchQuery, pageNumber + 1, maxPages, searchResults));
        }
      }
      // If no more results, return the results we've collected
      deferred.resolve(searchResults);
    });

    return deferred.promise;
  };

  // Search Bandcamp starting at page 1, max pages of 2, and with an empty array of results
  getSearchResults(query, 1, 2, []).then(function(results) {
    mainDeferred.resolve(results);
  }, function(error) {
    mainDeferred.reject(error);
  });

  return mainDeferred.promise;

};

/* ====================================================== */

exports.stream = function(req, res) {

  var bandcampUrl = decodeURIComponent(req.params.songUrl);

  /*
   * parse the page loaded by bandcampUrl
   * direct link to the mp3 is in a script tag,
   * within an object called `TralbumData`,
   * a nested object called `trackinfo`,
   * at the key `mp3-128`
   *
   * @param {String} url
   */
  var getTrackFile = function(url) {
    var deferred = Q.defer();
    var trackRegex = /{"mp3-128":"(.+?)"/ig;
    var urlResults;

    request(url, function(error, response, body) {
      if ( error ) {
        deferred.reject('Unable to retrieve the MP3 file for the specified URL.');
      }

      urlResults = trackRegex.exec(body);

      if ( urlResults !== null ) {
        deferred.resolve(request.get(urlResults[1]));
      } else {
        deferred.reject('Unable to retrieve the MP3 file for the specified URL.');
      }
    });

    return deferred.promise;
  };

  getTrackFile(bandcampUrl).then(function(trackUrl) {
    trackUrl.pipe(res);
  }, function(error) {
    res.status(500).send(error);
  });

};