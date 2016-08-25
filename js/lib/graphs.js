/**
* This javascript presents the data for the statistics graphs, using nvd3.
* @author Joana Roque
*/

/**
 * Defines the colors that each type is normally associated with
 * @type {Object} typeName: colorValue
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
 * Defines the endpoint of the api to retrieve data
 * @type {String}
 */
var apiEndpoint = "http://localhost:3030";

/**
 * This function is used to build a MultiBarGraph in the interface.
 * @param  {String} urlApi the url that retrieves the data from the
 * application API
 * @param  {String} divName name of the div where the chart is associated
 */
function makeMultiBarGraph(urlApi, divName){
  // Retrieve data from the API
  $.ajax({
    url: apiEndpoint+urlApi,
    type: 'GET',
    success: function(data) {
      //console.log(JSON.stringify(data));
      // after the data was retrieved present it in a nv d3 graph
      nv.addGraph(function(){
        var chart = nv.models.multiBarChart()
          .x(function(d){ return d.label; })
          .y(function(d){ return d.value; })
          .groupSpacing(0.1)
          .staggerLabels(true)
          .barColor(function(d, i){
            // retrieve each color for each type. if color is not defined send a
            // default color
            return (pokeColors[d.label] !== undefined)?
              pokeColors[d.label]: '#68A090';
          })
          .duration(250);

        d3.select(divName)
          .datum(data)
          .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
      });
    }
  });
}

/**
 * This function is used to build a bar chart in the interface.
 * @param  {String} urlApi  The url that retrieves the data from the
 * application API
 * @param  {String} divName Name of the div where the chart is associated
 */
function makeDiscreteBarGraph(urlApi, divName){
  // Retrieve data from the API
  $.ajax({
    url: apiEndpoint+urlApi,
    type: 'GET',
    success: function(data) {
      //console.log(JSON.stringify(data));
      // after the data was retrieved present it in a nv d3 graph
      nv.addGraph(function(){
        var chart = nv.models.discreteBarChart()
          .x(function(d){ return d.label; })
          .y(function(d){ return d.value; })
          .color(function(d, i){
            // retrieve each color for each type. if color is not defined send a
            // default color
            return (pokeColors[d.label] !== undefined)?
              pokeColors[d.label]: '#68A090';
          })
          .staggerLabels(true)
          .showValues(true)
          .duration(250);

        d3.select(divName)
          .datum(data)
          .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
      });
    }
  });
}


$( function(){
  makeDiscreteBarGraph('/api/stats/average?attribute=hp', '#chartAvgHP');
  makeDiscreteBarGraph(
    '/api/stats/average?attribute=total', '#chartAvgTotal');
  makeDiscreteBarGraph(
    '/api/stats/average?attribute=speed', '#chartAvgSpeed');
  makeMultiBarGraph(
    '/api/stats/average?attribute=attack,defense', '#chartAvgAD');
  makeMultiBarGraph(
    '/api/stats/average?attribute=specialAttack,specialDefense',
      '#chartAvgSpeAD');
});
