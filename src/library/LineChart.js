/*
	LineChart:-
	X Axis : Linear scale on the values present in the json property(of the data), specified against x axis
	Y Axis : Linear scale on the values present in the json property(of the data), specified against y axis
*/
function LineChart (svg){
	this.svg = svg;
	this.chartName=null;
	this.newName = null;
	this.title = null;
	this.colorTable = [];
	this.xHasTime = false;
	this.border = {
		left: -75, 
		right: 190, 
		top: 10, 
		bottom: 85 
	};
	this.svg.attr("viewBox","-100 0 300 100");

	this.callback = null;
}


LineChart.prototype.setTitle = function(title){
	this.title = title;
}

LineChart.prototype.setData = function(json,className,groupOnProperty, legendLabel) { 
	/* If multiple line-graphs are to be plotted, specify the property on which the data should be grouped, specify a label for 
	the legend to show different groups*/
	var _this = this;
	if(this.chartName!== null) 
		this.newName = className;
	else{
		this.chartName = className;
		this.newName =className;
	}

	this.data = json;
	this.xHasTime = false;
	this.groupOnProperty = groupOnProperty;
	if (groupOnProperty !== undefined && groupOnProperty !== null){
		this.group = d3.set(this.data.map(function(d){ return d[_this.groupOnProperty]; })).values();
		this.color = d3.scale.category20().range();
		this.legendLabel = legendLabel || "";	
	}
	
}

LineChart.prototype.setColor = function(colorLst){
	this.color = d3.scale.ordinal()
		.domain(this.group)
		.range(colorLst);
}

LineChart.prototype.setAxes = function(propertyX, labelX, propertyY, labelY){
	this.axisX = propertyX;
	this.axisY = propertyY;
	this.labelX = labelX;
	this.labelY = labelY;

	

}

LineChart.prototype.setTimeDataInX = function(interval,times,timeFormat){
	this.xHasTime = true;
	if(interval === "month"){
		this.interval = d3.time.months;
	}
	else if(interval === "day"){
		this.interval = d3.time.days;
	}
	else if( interval === "hour"){
		this.interval = d3.time.hours;
	}
	this.multipleInterval = times;
	if(timeFormat === "12hr"){
		this.timeFormat = d3.time.format("%I %p");
	}
	else if (timeFormat === "MMM DD"){
		this.timeFormat = d3.time.format("%b %d");
	}
	else
		this.timeFormat = d3.time.format("%H");
}

LineChart.prototype.valueToDate = function(val){
	if(this.interval === d3.time.days || this.interval === d3.time.months){
		return new Date(val);
	}
	else if( this.interval === d3.time.hours){
		return new Date(0, 0, 0, +val, 0, 0, 0);
	}
}

LineChart.prototype.draw = function(){
	var _this = this;

	this.yScale = d3.scale.linear()
		.domain([0, d3.max(this.data, function(d){return +d[_this.axisY];})])
		.range([this.border.bottom, this.border.top]);
	this.svg.selectAll(".axis").remove();
    this.yAxis = d3.svg.axis()
    	.scale(this.yScale)
      	.orient("left");
	this.xScale = null;
	var line = null;
	if (this.xHasTime === true){
		this.xScale = d3.time.scale()
			.domain([d3.min(this.data, function(d){return _this.valueToDate(d[_this.axisX]);}),d3.max(this.data, function(d){return _this.valueToDate(d[_this.axisX]);})])
			.range([this.border.left, this.border.right]);
		console.log(this.xScale.domain());
		this.xAxis = d3.svg.axis()
	    	.scale(this.xScale)
	    	.ticks(_this.interval, _this.multipleInterval)
    		.tickFormat(_this.timeFormat)
	      	.orient("bottom");
	    line = d3.svg.line()
		    .x(function(d) { return _this.xScale(_this.valueToDate(d[_this.axisX])); })
		    .y(function(d) { return _this.yScale(+d[_this.axisY]); });
	}
	else{
		this.xScale = d3.scale.linear()
			.domain([0, d3.max(this.data, function(d){return +d[_this.axisX];})])
			.range([this.border.left, this.border.right]);
		this.xAxis = d3.svg.axis()
	    	.scale(this.xScale)
	      	.orient("bottom");
	    line = d3.svg.line()
		    .x(function(d) { return _this.xScale(+d[_this.axisX]); })
		    .y(function(d) { return _this.yScale(+d[_this.axisY]); });
	}
	
	
	
	
	
	this.removeLegend();
	if (this.groupOnProperty !== undefined && this.groupOnProperty !== null){
		var lst = d3.nest().key(function(d){return d[_this.groupOnProperty];}).entries(_this.data);
		
		var tooMany = (lst.length > 10)? true:false;

		/*Join new data*/
		var graph = this.svg.selectAll("." + this.chartName)
			.data(lst);
		
		/*Update old entries*/
		graph.attr("class", this.newName+" pointer line_stroke")
		.attr("d", function(d){
      		return line(d.values);
      	})
      	.attr("stroke", function(d){
      		return (tooMany)? "rgba(220,220,220,1.0)" : _this.color[d.key.hashCode() % 20];
      	});

      	/*Add new entries*/
      	graph.enter().append("path")
      		.attr("class",this.newName+" pointer line_stroke")
      		.attr("stroke", function(d){
      			return (tooMany)? "rgba(220,220,220,1.0)" : _this.color[d.key.hashCode() % 20];
      		})
      		.attr("d", function(d){
      			return line(d.values);
      		})
      		.on("mouseover", function(d) {
	      		if(this.callback != null)
	      			this.callback(d.key);
      		}.bind(this));
      	graph.exit().remove();
      	if (!tooMany)
      		this.addLegend();   // Add a legend if showing more than one group of data

	}
	else{
		/*Join new data*/
		var graph = this.svg.selectAll("." + this.chartName)
			.data([this.data]);
	
		/*Update old entries*/
		graph.attr("class",this.newName)
		.attr("d", function(d){
      		return line(d);
      	});
		
      	/*Add new entries*/
      	graph.enter().append("path")
      		.attr("class",this.newName)
      		.attr("d", function(d){
      			return line(d);
      		});
      	graph.exit().remove();
	}
	
	

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
	

LineChart.prototype.addLegend  =  function(){
	var _this = this;
	
	
	var legendSize = (this.border.bottom - this.border.top)/15.0;
	//svgHandle.selectAll(".legend").remove();
	legend = this.svg.selectAll(".legend")
  		.data(this.group);

  	
  	legendGrp = legend.enter().append("g")
  		.attr("class", "legend")
  		.attr("transform", function(d, i) { 
      		return "translate(" + (_this.border.right*0.95) + "," + (_this.border.top + i*legendSize) + ")"; 
    	});

	legendGrp.append("rect")
		.attr("x", 5)
	    .attr("width", legendSize)
	    .attr("height", legendSize)
	    .attr("y", legendSize)
	    //.style("stroke", "black")
	    .style("fill", function(d){
	    	return _this.color[d.hashCode() % 20];
	    });

	legendGrp.append("text")
	    .attr("y", legendSize*2)
	    //.attr("dy", ".4em")
	    .style("text-anchor","end")
	    .text(function(d){return d;});

	this.svg.select("#legendLabel").remove();
	this.svg.append("text")
		.attr("id", "legendLabel")
		.attr("transform", "translate(" + (_this.border.right*0.95) + "," + (_this.border.top) + ")")
		.attr("x", 5+legendSize)
		.attr("y", legendSize-2)
	    .style("text-anchor","end")
	    .text(_this.legendLabel);

}

LineChart.prototype.removeLegend = function(){
	this.svg.select("#legendLabel").remove();
	this.svg.selectAll(".legend").remove();
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