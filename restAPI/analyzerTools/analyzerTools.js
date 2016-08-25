/**
* This module represents the set of functions that will make the analysis on
* the data.
*
* TODO change to use sqlite3
*
**/
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("analyzerTools/pokemonInfo",function(err){
	if(err){
			console.log(err);
	}
});

var table = "pokemon_list";

// constants with the names of the columns of the table
// TODO check if necessary
var colId = "id";
var colName = "pok_name";
var colType = "pok_type";
var colTotal = "pok_total";
var colHp = "pok_hp";
var colAttack = "pok_attack";
var colDefense = "pok_defensse";
var colSpeAttack = "pok_special_attack";
var colSpeDefense = "pok_special_defense";
var colSpeed = "pok_speed";

// Constant list with the attr collumn positions
// TODO check if necessary
var attrColNames = {
	"total": colTotal,
	"hp": colHp,
	"attack": colAttack,
	"defense": colDefense,
	"specialAttack": colSpeAttack,
	"specialDefense": colSpeDefense,
	"speed": colSpeed
};

// --------- Module functions ---------

/**
 * The function that retrieves the average of a pokemon attribute, for the
 * pokemons of a certain type. If no type is provided, the metric is
 * calculated for all pokemons.
 * @param  {string}   pokAttr  The name of the attributes to compute the metric
 * @param  {Function} callback Function with an argument.
 * @return {number}
 */
var averageAttr = function(pokAttrs, callback){

	if(callback === undefined){
		throw "The callback function needs to be defined!";
	}

	if(pokAttrs.length > 0){
		var colName = pokAttrs[0];
		var querySql = "SELECT "+colType+" as pokType, avg("+attrColNames[colName]+") as "+colName;
		var i = 0;
		for(i = 1; i < pokAttrs.length; i++){
			colName = pokAttrs[i];
			querySql += ", avg("+attrColNames[colName]+") as "+colName;
		}

		querySql += " FROM "+table+" GROUP BY "+colType+";";

		db.all(querySql, function(err, rows) {
			if(err){
				console.log(err);
				return;
			}else{
				callback(rows);
			}
	  });
	}

};

/**
 * Counts all of the pokemons of a certain type.
 * @param  {string}   pokType  The type of the pokemons to include
 * @param  {Function} callback Function with an argument.
 * @return {number}
 */
var getPokCount = function(pokType,callback){
	var querySql = "SELECT count("+colId+") as count FROM "+table+" WHERE "+colType+" = '"+pokType+"';";

	db.each(querySql, function(err, row) {
		if(err){
			console.log(err);
			return;
		}else{
			callback(row.count);
		}
  });
};



/**
	* allback is a  It
	* must have a parameter.
	* Result: an array of {id:"", value:0}

/**
 * Retrieves the all of the HP of the pokemons of a certain type.
 * @param  {[type]}   pokType  [description]
 * @param  {Function} callback [Function that manipulates the rows when they are retrieved.]
 * @return {[type]}            [description]

var getHPData = function(pokType,callback){
	var querySql = "SELECT \""+colId+"\", \""+colHp+"\" FROM \""+table
		+"\" WHERE \""+colType+"\" = '"+pokType+"';";
	var data = [];

	//connect to database
  pg.connect(connString, function(err,client,done){
		//send query
		var queryConn = client.query(querySql);
		// when each row is received
		queryConn.on('row',function(row){
			var newVal = {
				"id": row[colId],
				"value": parseInt(row[colHp])
			};
			data.push(newVal);
		});

		// when in error
		queryConn.on('error', function(error){
			handleErrors(error,client,done);
		});

		// when all rows retrieved
		queryConn.on('end', function(){
			callback(data);
			done(client);
		});
	});
}
**/



/**
* Get all of the types of the pokemons in the database

var getAllTypes = function(callback){
	var querySql = "SELECT DISTINCT \""+colType+"\" FROM \""+table+"\";";
	var data = [];

	//connect to database
  pg.connect(connString, function(err,client,done){
		//send query
		var queryConn = client.query(querySql);
		// when each row is received
		queryConn.on('row',function(row){
			data.push(row[colType]);
		});

		// when in error
		queryConn.on('error', function(error){
			handleErrors(error,client,done);
		});

		// when all rows retrieved
		queryConn.on('end', function(){
			callback(data);
			done(client);
		});
	});
};
**/

module.exports.averageAttr = averageAttr;
module.exports.getPokCount = getPokCount;
