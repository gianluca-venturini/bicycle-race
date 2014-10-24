function NormalChart2 (svg){
	this.svg = svg;
	this.chartName=null;
	this.newName = null;
	this.title = null;
	
	this.border = {
		left: -75, 
		right: 140, 
		top: 10, 
		bottom: 85, 
		left2: 150,
		right2: 300,
		top2: 20, 
		bottom2: 75
	};
	this.svg.attr("viewBox","-100 0 400 110");
}


NormalChart2.prototype.setTitle = function(title){
	this.title = title;
}

NormalChart2.prototype.setData = function(json,className){
	var _this = this;
	if(this.chartName!== null) 
		this.newName = className;
	else{
		this.chartName = className;
		this.newName =className;
	}
	this.data = json;
	
}

NormalChart2.prototype.setAxes = function(propertyX, labelX, propertyY, labelY){
	var _this = this;
	this.axisX = propertyX;
	this.axisY = propertyY;
	this.labelX = labelX;
	this.labelY = labelY;
	
	
	var maxX = d3.max(this.data,function(d){
		return +d[propertyX];
	});
	this.xScale = d3.scale.linear()
		.domain([0,maxX])
		.range([this.border.left, this.border.right]);
	var maxY = d3.max(this.data,function(d){
		return +d[propertyY];
	});
	this.yScale = d3.scale.linear()
		.domain([0,maxY])
		.range([this.border.bottom, this.border.top+5]);


	this.xAxis = d3.svg.axis()
    	.scale(this.xScale)
    	.ticks(10)
    	.tickSize(2)
      	.orient("bottom");
    this.yAxis = d3.svg.axis()
    	.scale(this.yScale)
      	.orient("left");

    this.getQuartiles();
} 



NormalChart2.prototype.draw = function(){
	
	var _this = this;
	this.svg.selectAll("." + this.chartName).remove();
	this.svg.selectAll(".axis").remove();
	bars = this.svg.selectAll("." + this.newName)
		.data(this.data);

	bars.enter().append("rect")
		.attr("class",this.newName)
		.attr("transform", function(d){
			return "translate(" + (_this.xScale(+d[_this.axisX])) +","+ (_this.yScale(+d[_this.axisY])) + ")";
		})
		.attr("x", -(_this.xScale(+_this.data[1][_this.axisX]) - _this.xScale(+_this.data[0][_this.axisX])))
		.attr("width", _this.xScale(+_this.data[1][_this.axisX]) - _this.xScale(+_this.data[0][_this.axisX])-1)
		.attr("height", function(d){
			return _this.border.bottom - _this.yScale(+d[_this.axisY]);
		});


	// create X axis
	var xaxis = this.svg.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + 0 +","+ (this.border.bottom) + ")")
	    .call(this.xAxis);
	xaxis.selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-15)" 
        });
	xaxis.append("text")
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

	var legendSize = (this.border.bottom - this.border.top)/15.0;
	var format = d3.format(",");
	legend = this.svg.selectAll(".legend").remove();

	legend = this.svg.append("g")
		.attr("class", "legend");
		//.attr("transform", "translate(" + (_this.border.right)+ "," + (_this.border.top) + ")");
	
	legend.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", _this.xScale(_this.mean)-2)
		.attr("x",-(_this.border.bottom-10))
	    //.style("text-anchor","end")
	    .text("Mean : " + format(parseInt(_this.mean)));
	
	

	this.svg.append("line")
		.attr("class", _this.newName)
		.style("stroke", "rgba(190,190,230,1.0)")
		.attr("x1", _this.xScale(_this.mean))
		.attr("x2",_this.xScale(_this.mean))
		.attr("y1", _this.border.bottom)
		.attr("y2", _this.border.top);

	this.drawBox();

	if (this.newName!==null){
		this.chartName = this.newName; 

	}
}


NormalChart2.prototype.drawBox = function(){
	this.svg.selectAll(".box").remove();
	var yscale = d3.scale.linear()
		.domain([this.quartiles[0], this.quartiles[4]])
		.range([this.border.bottom2,this.border.top2]);

	boxGrp = this.svg.append("g")
		.attr("class", "box")
		.attr("transform", "translate(" + ((this.border.left2 + this.border.right2)*0.5) + "," + (this.border.top2/5) + ")");

	boxGrp.append("line")
		.attr("x1", 0)
		.attr("y1", this.border.bottom2)
		.attr("x2", 12)
		.attr("y2", this.border.bottom2);
	boxGrp.append("line")
		.attr("x1", 0)
		.attr("y1", this.border.top2)
		.attr("x2", 12)
		.attr("y2", this.border.top2);
	boxGrp.append("rect")
		.attr("x",1)
		.attr("y", yscale(this.quartiles[3]))
		.attr("width",10)
		.attr("height", yscale(this.quartiles[1]) - yscale(this.quartiles[3]))
	boxGrp.append("line")
		.style("stroke-dasharray","2,2")
		.attr("x1", 6)
		.attr("y1", this.border.top2)
		.attr("x2", 6)
		.attr("y2", yscale(this.quartiles[3]));
	boxGrp.append("line")
		.style("stroke-dasharray","2,2")
		.attr("x1", 6)
		.attr("y1", this.border.bottom2)
		.attr("x2", 6)
		.attr("y2", yscale(this.quartiles[1]));
	boxGrp.append("line")
		.attr("x1", 1)
		.attr("y1", yscale(this.quartiles[2]))
		.attr("x2", 11)
		.attr("y2",  yscale(this.quartiles[2]));
	boxGrpText = boxGrp.selectAll("text")
		.data(this.quartiles);
	boxGrpText.enter()
		.append("text")
		.attr("x",-5)
		.attr("y", function(d){return yscale(d);})
		.attr("dy","0.35em")
		.text(function(d){return d3.format(",")(d);});


}






NormalChart2.prototype.getQuartiles = function(){
	var _this = this;
	var totalCount = 0;
	var summation = 0
	this.data.forEach(function(d){ 
		totalCount = totalCount + +d[_this.axisY] ;
		summation = summation + (+d[_this.axisX] * +d[_this.axisY]);
	});
	this.mean = summation/totalCount;
	
	var quartile1 = totalCount/4;
	var valFor1 = 0;
	var median = totalCount/2;
	var valFor2 = 0;
	var quartile3 = totalCount*0.75;
	var valFor3 = 0;
	var valFor4 = 0;
	var tempTot = 0;
	this.data.forEach(function(d){ 
		tempTot = tempTot + +d[_this.axisY] ;
		if (tempTot < quartile1)
			valFor1 = +d[_this.axisX];
		if (tempTot < median)
			valFor2 = +d[_this.axisX];
		if (tempTot < quartile3)
			valFor3 = +d[_this.axisX];
		if (+d[_this.axisY] !== 0)
			valFor4 = +d[_this.axisX];
	});
	
	
	var temp = [];

	temp.push(0);
	temp.push(valFor1);
	temp.push(valFor2);
	temp.push(valFor3);
	temp.push(valFor4);
	this.quartiles = temp;
}



