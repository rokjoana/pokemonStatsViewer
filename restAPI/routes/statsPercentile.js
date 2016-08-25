/**
 * Returns the percentile of a pokemon for a certain attribute.
 * This means that the value for this pokemon is better than X% of the total
 * pokemons.
 * @author JICR
 */

/**
 * Retrieves the percentile of a pokemon for a certain attribute.
 * The result is a pair attribute and the percentile as percentage.
 * This does not use the view.query() function but instead uses mongoose
 * directly.
 * @param  {String} pokid       The Id of the pokemon which data is being
 * displayed
 * @param  {String} type        The Type of the pokemon which data is being
 * displayed
 * @param  {String} attribute   The attribute which value is being displayed in
 * the chart
 * @param  {Function} callback  Callback function to process the results.
 * Should have two parameters, one should be the percentile percentage and the
 * other should be the value of the percentile.
 */
function retrievePercentile(pokid, type, attribute, callback) {
	var keystone = require('keystone');
	var Pokemon = keystone.list('pokemons');

	// retrieve pokemon data
	var queryPok = Pokemon.model.where({
		pokid: pokid,
		type: type
	});

	queryPok.findOne(function(err, pokemon) {
		if (err) {
			console.log(err);
		}

		// return nothing if pokemon does not exist
		if (pokemon != null) {
			var matchQuery = {};
			matchQuery[attribute] = {
				'$lte': pokemon[attribute]
			};

			Pokemon.model.aggregate({
					$match: matchQuery
				}, {
					$group: {
						_id: null,
						count: {
							$sum: 1
						}
					}
				},
				function(err, res) {
					if (err) {
						console.log(err);
					}

					var pokCount = res[0].count - 1;

					Pokemon.model.count().exec(function(err, countAll) {
						if (err) {
							console.log(err);
						}
						// pass result to callback
						callback((pokCount / countAll) * 100, pokemon[attribute]);
					});
				});
		} else {
			callback(undefined, undefined);
		}


	});
}

/**
 * Controller that receives an pokemon id, a pokemon type and an attribute name
 * and computes the percentile of the pokemon for that attribute.
 * @param  {Object} req the object that contains the data of the request
 * @param  {Object} res the object that should contain the information of the
 * response
 */
exports = module.exports = function(req, res) {
	if (req.query.pokid !== undefined &&
		req.query.type !== undefined &&
		req.query.attribute !== undefined) {

		retrievePercentile(req.query.pokid.trim(), req.query.type.trim(),
			req.query.attribute.trim(),
			function(percentile, val) {
				//verify if percentile and val are undefined, if so send nothing
				if (percentile != undefined && val != undefined) {
					var jsonDatum = {
						datum: [{
							key: 'Percentile',
							y: percentile
						}, {
							key: 'Total',
							y: 100
						}],
						value: val
					};

					res.json(jsonDatum);

				}else{
					console.log('Pokemon undefined');
					res.json({});
				}
			});
	}

};
