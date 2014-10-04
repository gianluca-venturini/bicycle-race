/*
	BarChart:-
	X Axis : Ordinal scale on the values present in the json property(of the data), specified against x axis
	Y Axis : Linear scale on the values present in the json property(of the data), specified against y axis
*/
function BarChart (svg, name){
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

BarChart.prototype.setData = function(json) {
	this.data = json;
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
		.data(this.data)
		.enter().append("g")
		.attr("class",this.chartName);
	bars.append("rect")
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
