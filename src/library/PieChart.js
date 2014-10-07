/*
	LineChart:-
	X Axis : Linear scale on the values present in the json property(of the data), specified against x axis
	Y Axis : Linear scale on the values present in the json property(of the data), specified against y axis
*/
function PieChart (svg){
	this.svg = svg;
	this.chartName=null;
	this.newName = null;
	this.title = null;
	this.border = {
		left: -75, 
		right: 75, 
		top: 10, 
		bottom: 95 
	};
	this.svg.attr("viewBox","-80 0 160 100");
}


PieChart.prototype.setTitle = function(title){
	this.title = title;
}


PieChart.prototype.setData = function(valuesLst, nameLst, className, legendLabel){
	if(this.chartName!== null) 
		this.newName = className;
	else{
		this.chartName = className;
		this.newName =className;
	}

	this.data = valuesLst;
	this.legendNames = nameLst;
	this.legendLabel = legendLabel;
	this.radius = (this.border.bottom - this.border.top)/2.0 -2.0; 

	this.color = d3.scale.category20()
		.domain(this.legendNames);

	this.arc = d3.svg.arc()
	    .outerRadius(this.radius)
	    .innerRadius(0);

	this.pie = d3.layout.pie()
		.sort(null)
		.value(function(d) { return d; });


}

PieChart.prototype.draw = function(){
	var _this = this;
	_this.svg.selectAll("." + _this.chartName).remove();
	this.removeLegend();
	var commas = d3.format(",");
		
	var graph = this.svg.selectAll("." + _this.newName)
	  	.data(_this.pie(_this.data));
		
	var arcGrp = graph.enter().append("g")
		.attr("transform", "translate(" + ((_this.border.left + _this.border.right)*0.5) + "," + (_this.border.bottom - _this.radius) + ")")
	  	.attr("class",  _this.newName);

	arcGrp.append("path")
      	.attr("d", _this.arc)
      	.style("fill", function(d,i) { return _this.color(_this.legendNames[i]); })
		      	

  	arcGrp.append("text")
      	.attr("transform", function(d) { return "translate(" + _this.arc.centroid(d) + ")"; })
      	.attr("dy", ".35em")
      	.style("text-anchor", "middle")
      	.text(function(d) { return commas(d.data); });


	/*Set title for graph */
	if(this.title!== null){
		this.svg.selectAll(".title").remove();
		this.svg.append("text")
			.attr("class", "title")
			.attr("transform", "translate(" + (_this.border.left*0.5) + "," + (_this.border.top) + ")")
		    .style("text-anchor","middle")
		    .text(_this.title);
	}

	this.addLegend();
	if (this.newName!==null){
		this.chartName = this.newName; 

	}
	
}
	

PieChart.prototype.addLegend  =  function(){
	var _this = this;
	
	
	var legendSize = (this.border.bottom - this.border.top)/15.0;
	//svgHandle.selectAll(".legend").remove();
	legend = this.svg.selectAll(".legend")
  		.data(this.legendNames);

  	
  	legendGrp = legend.enter().append("g")
  		.attr("class", "legend")
  		.attr("transform", function(d, i) { 
      		return "translate(" + (_this.border.right*0.85) + "," + (_this.border.top + i*legendSize) + ")"; 
    	});

	legendGrp.append("rect")
		.attr("x", 5)
	    .attr("width", legendSize)
	    .attr("height", legendSize)
	    .attr("y", legendSize)
	    //.style("stroke", "black")
	    .style("fill", function(d){
	    	return _this.color(d);
	    });

	legendGrp.append("text")
	    .attr("y", legendSize*2)
	    //.attr("dy", ".4em")
	    .style("text-anchor","end")
	    .text(function(d){return d;});

	this.svg.select("#legendLabel").remove();
	this.svg.append("text")
		.attr("id", "legendLabel")
		.attr("transform", "translate(" + (_this.border.right*0.85) + "," + (_this.border.top) + ")")
		.attr("x", 5+legendSize)
		.attr("y", legendSize-2)
	    .style("text-anchor","end")
	    .text(_this.legendLabel);

}

PieChart.prototype.removeLegend = function(){
	this.svg.select("#legendLabel").remove();
	this.svg.selectAll(".legend").remove();
}
