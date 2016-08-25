/**
* This javascript presents the data for the donuts with the values that are
* presented in the pokemon information pages, using nvd3.
* @author JICR
*/

/**
 * Defines the colors that each type is normally associated with
 * @type {Object} typeName: colorValue
 * TODO retrieve this information from mongoDBtypeName: colorValue
 */
var pokeColors = {};
pokeColors.DARK = '#705848';
pokeColors.GHOST = '#705898';
pokeColors.ELECTRIC = '#F8D030';
pokeColors.ICE = '#98D8D8';
pokeColors.ROCK = '#B8A038';
pokeColors.GROUND = '#E0C068';
pokeColors.NORMAL = '#A8A878';
pokeColors.WATER = '#6890F0';
pokeColors.BUG = '#A8B820';
pokeColors.POISON = '#A040A0';
pokeColors.FIRE = '#F08030';
pokeColors.FAIRY = '#EE99AC';
pokeColors.STEEL = '#B8B8D0';
pokeColors.DRAGON = '#7038F8';
pokeColors.FIGHTING = '#B92E26';
pokeColors.FLYING = '#A890F0';
pokeColors.PSYCHIC = '#F85888';
pokeColors.GRASS = '#78C850';

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
 * This function makes a Gauge Chart using the percentile of a certain
 * attribute for a pokemon.
 * @param  {String} pokid    The Id of the pokemon which data is being displayed
 * @param  {String} type     The Type of the pokemon which data is being
 * displayed
 * @param  {String} attrName The attribute which value is being displayed in
 * the chart
 * @param  {String} divName  Name of the div where the chart is associated
 */
function makeGaugeChart(pokid, type, attrName, divName){
  var url = 'http://localhost:3000/api/stats/percentile?pokid='+
    pokid+'&type='+type+'&attribute='+attrName;

  // Retrieve percentile data
  $.ajax({
    url: url,
    type: 'GET',
    success: function(data) {
      nv.addGraph(function(){
        // create Chart
        var chart = nv.models.pieChart()
          .x(function(d){return d.key})
          .y(function(d){return d.y})
          .donut(true)
          .title(seriesNames[attrName]+': '+data.value);

        // Make it half circle, like a gauge
        chart.pie
          .startAngle(function(d){return d.startAngle/2 - Math.PI/2;})
          .endAngle(function(d){return d.endAngle/2 - Math.PI/2;});

        d3.select(divName)
          .datum(data.datum)
          .transition().duration(1200)
          .call(chart);

        return chart;

      });
    }
  });
}

$( function(){
  // Retrieve pokid and type from DOM
  var pokidVal = $('#pokid').text().trim();
  var pokType = $('#type').text().trim();

  // invoke functions to create the charts
  makeGaugeChart(pokidVal, pokType, 'hp','#gaugeHP svg');
  makeGaugeChart(pokidVal, pokType, 'speed','#gaugeSpeed svg');
  makeGaugeChart(pokidVal, pokType, 'attack','#gaugeAttack svg');
  makeGaugeChart(pokidVal, pokType, 'defense','#gaugeDefense svg');
  makeGaugeChart(pokidVal, pokType, 'specialAttack','#gaugeSpeAttack svg');
  makeGaugeChart(pokidVal, pokType, 'specialDefense','#gaugeSpeDefense svg');

});
