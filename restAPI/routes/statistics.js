/**
 * This class is the routing module to publish the API for the pokemon data.
 * The data is sent in the format to be used in the nvd3 charts.
 */
var express = require('express');
var router = express.Router();

var analyzerTools = require("../analyzerTools/analyzerTools.js");

// adds the headers to solve the cross-browser issues
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, DELETE, PUT");
  next();
});

/**
 * Define the series names to be used in the donuts presentation
 * @type {Object}
 */
var seriesNames = {
	'hp': 'HP',
	'total': 'Total',
	'speed': 'Speed',
	'attack': 'Attack',
	'defense': 'Defense',
	'specialAttack': 'Special Attack',
	'specialDefense': 'Special Defense'
};

/**
 * Retrieves the average per type of an attribute list.
 * The result is a list of pairs _id and avg+attributeName.
 * @param  {[string]} attributes the attribute list
 * @param  {Function} callback  callback function to process the result.
 * Receives one argument.
 */
function retrieveAvgData(attributes, callback){
  var i;
  // retrieve average from the database
	for(i = 0; i < attributes.length; i++){

	}

}

/**
 * Verifies if all of the values passed as parameter are zero. This makes the
 * values array unusable in the chart frontend.
 * @param  {[type]} values   the array that is returned by the database
 * @param  {[type]} attrName the name of the attribute to verify the values
 * @return {boolean}         A boolean indicating that all of the values are
 * zero.
 */
function verifyAllValuesAsZero(values, attrName){
	var allZero = true;
	for(var val in values){
		var value = values[val];
		if(value !== undefined){
			if(value[attrName] !== undefined){
				if(allZero && value[attrName] !== 0){
					allZero = false;
				}
			}
		}
	}
	return allZero;
}


/**
* GET method to return the average of an attribute, for all pokemons of a
* designated type.
* query string: ?attribute=. If there is no query string returns
* the overall average of the attribute.
**/
router.get('/stats/average',function(req,res){
  if(req.query.attribute !== undefined){
    var attrList = req.query.attribute.split(',');

    analyzerTools.averageAttr(attrList, function(data){
			var jsonDatum = [];
      var i, j;
      for(i = 0; i < attrList.length ; i++){
        var attr = attrList[i].trim();

				if(!verifyAllValuesAsZero(data, attr)){
					var attrJson = {
	          key: seriesNames[attr],
	          values: []
	        };

	        for(j = 0; j < data.length ; j++){
	          var val = data[j];
	          attrJson.values.push({
	            'label': val.pokType.trim(),
	            'value': val[attr]
	          });
	        }
	        jsonDatum.push(attrJson);

				}
      }
      res.json(jsonDatum);
    });
  }else{
    res.send();
  }
});



module.exports = router;
