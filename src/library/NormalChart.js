/*
	LineChart:-
	X Axis : Linear scale on the values present in the json property(of the data), specified against x axis
	Y Axis : Linear scale on the values present in the json property(of the data), specified against y axis
*/
function NormalChart (svg){
	this.svg = svg;
	this.chartName=null;
	this.newName = null;
	this.title = null;
	this.border = {
		left: -75, 
		right: 190, 
		top: 10, 
		bottom: 85, 
		left2: 200,
		right2: 290
	};
	this.svg.attr("viewBox","-100 0 400 100");
}


NormalChart.prototype.setTitle = function(title){
	this.title = title;
}

NormalChart.prototype.setData = function(json,className, propertyX) { 
	var _this = this;
	if(this.chartName!== null) 
		this.newName = className;
	else{
		this.chartName = className;
		this.newName =className;
	}
	this.axisX = propertyX;
	
	this.labelY = "Frequency";
	
	var array = json.map(function(d){ return +d[propertyX];});
	var msv = meanSdVar(array);
	this.msv = msv;
	this.quartiles = getQuartiles(array);
	this.labelX = "SD (=" +d3.format(",")(parseInt(_this.msv.sd)) + ")"
	var normals = array.map(function(d){ return (d - msv.mean)/msv.sd;});

	this.xScale = d3.scale.linear()
    	.domain([-3.0, 3.0])
		.range([this.border.left, this.border.right]);
	this.data = d3.layout.histogram()
	    .bins(this.xScale.ticks(20))
	    .frequency(true)
	    (normals);

	this.yScale = d3.scale.linear()
    	.domain([0, d3.max(this.data, function(d) { return d.y; })])
		.range([this.border.bottom, this.border.top+5]);
	this.xAxis = d3.svg.axis()
    	.scale(this.xScale)
    	.ticks(20)
      	.orient("bottom");
    this.yAxis = d3.svg.axis()
    	.scale(this.yScale)
      	.orient("left");

	
}



NormalChart.prototype.draw = function(){
	
	var _this = this;
	this.svg.selectAll("." + this.chartName).remove();
	this.svg.selectAll(".axis").remove();
	bars = this.svg.selectAll("." + this.newName)
		.data(this.data);

	console.log(this.data);


	bars.enter().append("rect")
		.attr("class",this.newName)
		.attr("transform", function(d){
			return "translate(" + (_this.xScale(d.x)) +","+ (_this.yScale(d.y)) + ")";
		})
		.attr("x", 1)
		.attr("width", _this.xScale(_this.data[1].x) - _this.xScale(_this.data[0].x) -2)
		.attr("height", function(d){
			return _this.border.bottom - _this.yScale(d.y);
		});


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

	var legendSize = (this.border.bottom - this.border.top)/15.0;
	var format = d3.format(",");
	legend = this.svg.selectAll(".legend").remove();

	legend = this.svg.append("g")
		.attr("class", "legend");
		//.attr("transform", "translate(" + (_this.border.right)+ "," + (_this.border.top) + ")");

	legend.append("text")
		.attr("x", _this.xScale(0)-2)
		.attr("y",_this.border.top + 10)
	    .style("text-anchor","end")
	    .text("Mean : " + format(parseInt(_this.msv.mean)));
	

	this.svg.append("line")
		.attr("class", _this.newName)
		.style("stroke", "rgba(190,190,230,1.0)")
		.attr("x1", _this.xScale(0))
		.attr("x2", _this.xScale(0))
		.attr("y1", _this.border.bottom)
		.attr("y2", _this.border.top);

	this.drawBox();

	if (this.newName!==null){
		this.chartName = this.newName; 

	}
}


NormalChart.prototype.drawBox = function(){
	this.svg.selectAll(".box").remove();
	var yscale = d3.scale.linear()
		.domain([this.quartiles[0], this.quartiles[4]])
		.range([this.border.bottom,this.border.top]);

	boxGrp = this.svg.append("g")
		.attr("class", "box")
		.attr("transform", "translate(" + ((this.border.left2 + this.border.right2)*0.5) + "," + (this.border.top/5) + ")");

	boxGrp.append("line")
		.attr("x1", 0)
		.attr("y1", this.border.bottom)
		.attr("x2", 12)
		.attr("y2", this.border.bottom);
	boxGrp.append("line")
		.attr("x1", 0)
		.attr("y1", this.border.top)
		.attr("x2", 12)
		.attr("y2", this.border.top);
	boxGrp.append("rect")
		.attr("x",1)
		.attr("y", yscale(this.quartiles[3]))
		.attr("width",10)
		.attr("height", yscale(this.quartiles[1]) - yscale(this.quartiles[3]))
	boxGrp.append("line")
		.style("stroke-dasharray","2,2")
		.attr("x1", 6)
		.attr("y1", this.border.top)
		.attr("x2", 6)
		.attr("y2", yscale(this.quartiles[3]));
	boxGrp.append("line")
		.style("stroke-dasharray","2,2")
		.attr("x1", 6)
		.attr("y1", this.border.bottom)
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


function mean(array){
	var sum = array.reduce(function(previousValue, currentValue, index, array) {
  		return previousValue + currentValue;
	});

	var mn = sum/array.length;
	return mn;
}

function meanSdVar(array){
	
	var mn = mean(array);
	var meanDifSquares = array.map(function(d){
		var temp = d - mn;
		return temp * temp;
	})

	var variance = mean(meanDifSquares);
	var msv =  {mean: mn, variance:variance, sd:Math.sqrt(variance)};
	return msv;
}
/*
	BarChart:-
	X Axis : Ordinal scale on the values present in the json property(of the data), specified against x axis
	Y Axis : Linear scale on the values present in the json property(of the data), specified against y axis
*/

function getQuartiles(array){
	var sArray = array.sort(function(a,b){ return a - b;});
	var temp = [];
	temp.push(sArray[0]);
	temp.push(pickMid(sArray.slice(0,parseInt(sArray.length/2))));
	temp.push(pickMid(sArray));
	temp.push(pickMid(sArray.slice(parseInt(sArray.length/2)+1, sArray.length)));
	temp.push(sArray[sArray.length - 1]);
	return temp;
}

function pickMid(array){
	var mid = parseInt(array.length/2);
	if (array.length % 2 === 1)
		return array[mid];
	else
		return (array[mid] + array[mid+1])/2.0;
}



