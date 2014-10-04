/*
	LineChart:-
	X Axis : Linear scale on the values present in the json property(of the data), specified against x axis
	Y Axis : Linear scale on the values present in the json property(of the data), specified against y axis
*/
function LineChart (svg, name){
	this.svg = svg;
	this.chartName = name;
	this.border = {
		left: -75, 
		right: 180, 
		top: 5, 
		bottom: 85 
	};
	this.svg.attr("viewBox","-100 0 300 100");
}

LineChart.prototype.setData = function(json,groupOnProperty, legendLabel) { 
	/* If multiple line-graphs are to be plotted, specify the property on which the data should be grouped, specify a label for 
	the legend to show different groups*/
	var _this = this;
	this.data = json;
	this.groupOnProperty = groupOnProperty;
	this.group = d3.set(this.data.map(function(d){ return d[_this.groupOnProperty]; })).values();
	this.color = d3.scale.category20().domain(this.group);
	this.legendLabel = legendLabel;
}

LineChart.prototype.setAxes = function(propertyX, labelX, propertyY, labelY){
	this.axisX = propertyX;
	this.axisY = propertyY;
	this.labelX = labelX;
	this.labelY = labelY;
	this.xScale = d3.scale.linear()
		.domain([0, d3.max(this.data, function(d){return +d[propertyX];})])
		.range([this.border.left, this.border.right]);
	this.yScale = d3.scale.linear()
		.domain([0, d3.max(this.data, function(d){return +d[propertyY];})])
		.range([this.border.bottom, this.border.top]);
	this.xAxis = d3.svg.axis()
    	.scale(this.xScale)
      	.orient("bottom");
    this.yAxis = d3.svg.axis()
    	.scale(this.yScale)
      	.orient("left");

}

LineChart.prototype.draw = function(){
	
	var _this = this;
	var line = d3.svg.line()
		    .x(function(d) { return _this.xScale(+d[_this.axisX]); })
		    .y(function(d) { return _this.yScale(+d[_this.axisY]); });

	if (this.groupOnProperty !== undefined && this.groupOnProperty !== null){
		var lst = d3.nest().key(function(d){return d[_this.groupOnProperty];}).entries(_this.data);
		console.log(lst);
		var graph = this.svg.selectAll("." + this.chartName)
			.data(lst)
			.enter().append("g")
			.attr("class",this.chartName)

      	graph.append("path")
      		.attr("stroke", function(d){
      			return _this.color(d.key);
      		})
      		.attr("d", function(d){
      			return line(d.values);
      		});
      	this.addLegend();   // Add a legend if showing more than one group of data

	}
	else{
		var graph = this.svg.append("path")
		.datum(this.data)
		.attr("class",this.chartName)
      	.attr("d", line);
	}
	
	// create X axis
	this.svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(" + 0 +","+ (this.border.bottom) + ")")
	    .call(this.xAxis)
	    .append("text")
	    	.attr("x", this.border.right-5 )
	    	.attr("y", -this.border.top)
	    	.style("text-anchor", "middle")
	    	.text(this.labelX);
	this.svg.append("g")
	    .attr("class", "y axis")
	    .attr("transform", "translate(" + (this.border.left) +","+ 0+ ")")
	    .call(this.yAxis)
	    .append("text")
	    	.attr("x", -this.border.top)
	    	.attr("y", 8)
	    	.attr("transform", "rotate(-90)")
	    	.style("text-anchor", "end")
	    	.text(this.labelY);
}
	

LineChart.prototype.addLegend  =  function(){
	var _this = this;
	
	
	var legendSize = (this.border.bottom - this.border.top)/15.0;
	//svgHandle.selectAll(".legend").remove();
	legend = this.svg.selectAll(".legend")
  		.data(this.group)
  		.enter().append("g")
  		.attr("class", "legend")
  		.attr("transform", function(d, i) { 
      		return "translate(" + (_this.border.right*0.95) + "," + (_this.border.top + i*legendSize) + ")"; 
    	});

	legend.append("rect")
		.attr("x", 5)
	    .attr("width", legendSize)
	    .attr("height", legendSize)
	    .attr("y", legendSize)
	    //.style("stroke", "black")
	    .style("fill", function(d){
	    	return _this.color(d);
	    });

	legend.append("text")
	    .attr("y", legendSize*2)
	    //.attr("dy", ".4em")
	    .style("text-anchor","end")
	    .text(String);

	this.svg.append("text")
		.attr("id", "legendLabel")
		.attr("transform", "translate(" + (_this.border.right*0.95) + "," + (_this.border.top) + ")")
		.attr("x", 5+legendSize)
		.attr("y", legendSize-2)
	    .style("text-anchor","end")
	    .text(_this.legendLabel);

}