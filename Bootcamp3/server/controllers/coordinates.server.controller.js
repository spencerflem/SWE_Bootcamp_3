var config = require('../config/config'),
  request = require('request');



module.exports = function (req, res, next) {
  if (req.body.address) {
    //This code just formats the address so that it doesn't have space and commas using escape characters
    var address = req.body.address;

    //Setup your options q and key are provided. Feel free to add others to make the JSON response less verbose and easier to read 
    var options = {
      q: encodeURIComponent(address),
      key: config.openCage.key,
      limit: 1,
      no_annotations: 1,
    }

    //Setup your request using URL and options - see ? for format
    request({
      url: `https://api.opencagedata.com/geocode/v1/json`,
      qs: options
    }, function (error, response, body) {
      //For ideas about response and error processing see https://opencagedata.com/tutorials/geocode-in-nodejs
      if (error) {
        // Since longitude and lattitude are not required in the schema, if there is an error continue
        next();
      }
      //JSON.parse to get contents. Remember to look at the response's JSON format in open cage data
      let contents = JSON.parse(body);
      /*Save the coordinates in req.results -> 
        this information will be accessed by listings.server.model.js 
        to add the coordinates to the listing request to be saved to the database.

        Assumption: if we get a result we will take the coordinates from the first result returned
      */
      if (contents && contents.results && contents.results.length > 0) {
        req.results = contents.results[0].geometry;
      }
      next();
    });
  } else {
    next();
  }
};  