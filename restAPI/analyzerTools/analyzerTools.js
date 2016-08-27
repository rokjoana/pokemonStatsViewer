/**
* This module represents the set of functions that will make the analysis on
* the data.
**/
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("analyzerTools/pokemonInfo",function(err){
	if(err){
			console.log(err);
	}
});

var table = "pokemon_list";

// constants with the names of the columns of the table
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

module.exports.averageAttr = averageAttr;
