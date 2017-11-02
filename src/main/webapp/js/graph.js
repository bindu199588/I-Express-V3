var trendsChart=null;
var constructGraph=function(seriesArray){	
	  if(trendsChart){
		  trendsChart.destroy();
		  trendsChart=null;
		  console.log("TIME CHART NOT NULL");
	  }
	  var chart = {
		      type: 'spline',
			  animation: Highcharts.svg, // don't animate in IE < IE 10.
		      marginRight: 10
	  };
	  var title = {
	    text: 'Trends of Sentiments'   
	  };   
	   var xAxis = {
	      type: 'datetime'
	   };
	   var yAxis = {
	      title: {
	         text: 'Value'
	      },
	      plotLines: [{
	         value: 0,
	         width: 1,
	         color: '#808080'
	      }]
	   };
	   var plotOptions = {
	      area: {
	         pointStart: 1940,
	         marker: {
	            enabled: false,
	            symbol: 'circle',
	            radius: 2,
	            states: {
	               hover: {
	                 enabled: true
	               }
	            }
	         }
	      }
	   };
	   var legend = {
	      enabled: true
	   };
	   var exporting = {
	      enabled: false
	   };
	   var series= seriesArray 
	   var json={}
	   json.chart = chart; 
	   json.title = title;
	   json.xAxis = xAxis;
	   json.yAxis = yAxis; 
	   json.legend = legend;  
	   json.exporting = exporting;   
	   json.series = series;
	   json.plotOptions = plotOptions;
	   json.credits= {enabled: false};
	   Highcharts.setOptions({
	      global: {
	         useUTC: false
	      }
	   });
	  trendsChart= Highcharts.chart('trendsContainer', json);				  
	  		  
}