
function ImbalanceChart (svg){
	this.svg = svg;
	this.chartName = null;
	this.newName = null;
	this.title = null;
	this.border = {
		left: -75, 
		right: 190, 
		top: 10, 
		bottom: 85, 
		midY: 47
		
	};
	this.svg.attr("viewBox","-100 0 300 100");
	
}

ImbalanceChart.prototype.setTitle = function(title){
	this.title = title;
}

ImbalanceChart.prototype.setData = function(json, className) {
	this.data = json;
	if(this.chartName!== null) 
		this.newName = className;
	else{
		this.chartName = className;
		this.newName =className;
	}
	this.color = d3.scale.category20().range();


}

ImbalanceChart.prototype.setColor = function(colorLst){
	this.color = colorLst;
}

ImbalanceChart.prototype.setAxes = function(propertyX, labelX, propertyY1, labelY1, propertyY2, labelY2){
	this.axisX = propertyX;
	this.axisY1 = propertyY1;
	this.axisY2 = propertyY2;
	this.labelX = labelX;
	this.labelY1 = labelY1;
	this.labelY2 = labelY2;
	var yMax = d3.max(this.data, function(d){return +d[propertyY1];});
	var yMax2 = d3.max(this.data, function(d){return +d[propertyY2];});
	if (yMax2 > yMax)
		yMax = yMax2;
	this.xScale = d3.scale.ordinal()
		.domain(this.data.map(function(d,i){ return d[propertyX];}))
		.rangeRoundBands([this.border.left, this.border.right], 0.2, 6.0/(this.data.length));
	this.yScale1 = d3.scale.linear()
		.domain([0, yMax])
		.range([this.border.midY, this.border.top]);
	this.yScale2 = d3.scale.linear()
		.domain([0, yMax])
		.range([this.border.midY, this.border.bottom]);
	this.xAxis = d3.svg.axis()
    	.scale(this.xScale)
      	.orient("bottom");
    this.yAxis1 = d3.svg.axis()
    	.scale(this.yScale1)
    	.ticks(4)
      	.orient("left");
     this.yAxis2 = d3.svg.axis()
    	.scale(this.yScale2)
    	.ticks(4)
      	.orient("left");

}

ImbalanceChart.prototype.draw = function(){
	
	var _this = this;
	this.svg.selectAll("." + this.chartName).remove();
	bars = this.svg.selectAll("." + this.newName)
		.data(this.data);

	barGrp = bars.enter()
		.append("g")
		.attr("class", this.newName);

	barGrp.append("rect")
		.attr("class",this.newName + "up")
		.attr("x", function(d,i){
			return _this.xScale(d[_this.axisX]);
		})
		.attr("y", function(d,i){
			return _this.yScale1(d[_this.axisY1]);
		})
		.attr("width", _this.xScale.rangeBand())
		.attr("fill", function(d){
			return _this.color[(d[_this.axisX]+"").hashCode() % _this.color.length];
		})
		.attr("height", function(d){
			return _this.border.midY - _this.yScale1(d[_this.axisY1]);
		});
	barGrp.append("rect")
		.attr("class",this.newName + "down")
		.attr("x", function(d,i){
			return _this.xScale(d[_this.axisX]);
		})
		.attr("y", _this.border.midY)
		.attr("width", _this.xScale.rangeBand())
		.attr("fill", function(d){
			return _this.color[(d[_this.axisX]+"").hashCode() % _this.color.length];
		})
		.attr("height", function(d){
			return _this.yScale2(d[_this.axisY2]) - _this.border.midY;
		});	

	this.svg.selectAll(".axis").remove();
	/*this.svg.append("line")
		.attr("class", "axis")
		//.attr("stroke", "rgba(0,0,0,1.0)")
		.attr("x1", this.border.left)
		.attr("y1", this.border.midY)
		.attr("x2", this.border.right)
		.attr("y2", this.border.midY);*/

	// create X axis
	var xaxisGrp = this.svg.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + 0 +","+ (this.border.bottom) + ")");

	xaxisGrp.call(this.xAxis);
	xaxisGrp.append("line")
		//.attr("class", "axis")
		//.attr("stroke", "rgba(0,0,0,1.0)")
		.attr("x1", this.border.left)
		.attr("y1", this.border.midY-this.border.bottom)
		.attr("x2", this.border.right)
		.attr("y2", this.border.midY-this.border.bottom);
	xaxisGrp.append("text")
	    	.attr("x", this.border.right-5 )
	    	.attr("y", -this.border.top/2.0)
	    	.style("text-anchor", "middle")
	    	.text(this.labelX);
	

	this.svg.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + (this.border.left) +","+ 0+ ")")
	    .call(this.yAxis1)
	    .append("text")
	    	.attr("x", -this.border.top)
	    	.attr("y", 8)
	    	.attr("transform", "rotate(-90)")
	    	.style("text-anchor", "end")
	    	.text(this.labelY1);
	this.svg.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + (this.border.left) +","+ 0+ ")")
	    .call(this.yAxis2)
	    .append("text")
	    	.attr("x", -this.border.bottom)
	    	.attr("y", 8)
	    	.attr("transform", "rotate(-90)")
	    	.style("text-anchor", "start")
	    	.text(this.labelY2);
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

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};