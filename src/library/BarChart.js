/*
	BarChart:-
	X Axis : Ordinal scale on the values present in the json property(of the data), specified against x axis
	Y Axis : Linear scale on the values present in the json property(of the data), specified against y axis
*/
function BarChart (svg){
	this.svg = svg;
	this.chartName = null;
	this.newName = null;
	this.title = null;
	this.border = {
		left: -75, 
		right: 190, 
		top: 10, 
		bottom: 85 
	};
	this.svg.attr("viewBox","-100 0 300 100");
	
}

BarChart.prototype.setTitle = function(title){
	this.title = title;
}

BarChart.prototype.setData = function(json, className) {
	this.data = json;
	if(this.chartName!== null) 
		this.newName = className;
	else{
		this.chartName = className;
		this.newName =className;
	}

}

BarChart.prototype.setAxes = function(propertyX, labelX, propertyY, labelY){
	this.axisX = propertyX;
	this.axisY = propertyY;
	this.labelX = labelX;
	this.labelY = labelY;
	this.xScale = d3.scale.ordinal()
		.domain(this.data.map(function(d,i){ return d[propertyX];}))
		.rangeRoundBands([this.border.left, this.border.right], 0.4, 0.6);
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

BarChart.prototype.draw = function(){
	
	var _this = this;
	bars = this.svg.selectAll("." + this.chartName)
		.data(this.data);

	bars.attr("class",this.newName)
		.attr("x", function(d,i){
			return _this.xScale(d[_this.axisX]);
		})
		.attr("y", function(d,i){
			return _this.yScale(d[_this.axisY]);
		})
		.attr("width", _this.xScale.rangeBand())
		.attr("height", function(d){
			return _this.border.bottom - _this.yScale(d[_this.axisY]);
		});


	bars.enter().append("rect")
		.attr("class",this.newName)
		.attr("x", function(d,i){
			return _this.xScale(d[_this.axisX]);
		})
		.attr("y", function(d,i){
			return _this.yScale(d[_this.axisY]);
		})
		.attr("width", _this.xScale.rangeBand())
		.attr("height", function(d){
			return _this.border.bottom - _this.yScale(d[_this.axisY]);
		})
	bars.exit().remove();
	
	this.svg.selectAll(".axis").remove();

	// create X axis
	this.svg.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + 0 +","+ (this.border.bottom) + ")")
	    .call(this.xAxis)
	    .append("text")
	    	.attr("x", this.border.right-5 )
	    	.attr("y", -this.border.top/2.0)
	    	.style("text-anchor", "middle")
	    	.text(this.labelX);
	this.svg.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + (this.border.left) +","+ 0+ ")")
	    .call(this.yAxis)
	    .append("text")
	    	.attr("x", -this.border.top)
	    	.attr("y", 8)
	    	.attr("transform", "rotate(-90)")
	    	.style("text-anchor", "end")
	    	.text(this.labelY);
	/*Set title for graph */
	if(this.title!== null){
		this.svg.selectAll(".title").remove();
		this.svg.append("text")
			.attr("class", "title")
			.attr("transform", "translate(" + ((_this.border.right + _this.border.left)*0.5) + "," + (_this.border.top) + ")")
		    .style("text-anchor","middle")
		    .text(_this.title);
	}

	if (this.newName!==null){
		this.chartName = this.newName; 

	}
}
