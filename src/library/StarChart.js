
function StarChart (svg){
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


StarChart.prototype.setTitle = function(title){
	this.title = title;
}

StarChart.prototype.setData = function(json,className) { 
	var _this = this;
	if(this.chartName!== null) 
		this.newName = className;
	else{
		this.chartName = className;
		this.newName =className;
	}

	this.data = json;
	this.radius = (this.border.bottom - this.border.top)/3.0 -2.0; 
	this.center = {x:(this.border.right+this.border.left)*0.5,y:(this.border.bottom + this.border.top)*0.55};
	this.hourPie = "111111111111111111111111".split("");
	this.color = ["rgba(50,50,60,1.0)","rgba(50,50,60,1.0)","rgba(50,50,60,1.0)","rgba(50,50,60,1.0)","rgba(50,50,60,1.0)","rgba(50,50,60,1.0)",
					"rgba(140,140,120,1.0)","rgba(140,140,120,1.0)","rgba(140,140,120,1.0)","rgba(140,140,120,1.0)","rgba(140,140,120,1.0)","rgba(140,140,120,1.0)",
					"rgba(140,140,30,1.0)","rgba(140,140,30,1.0)","rgba(140,140,30,1.0)","rgba(140,140,30,1.0)","rgba(140,140,30,1.0)","rgba(140,140,30,1.0)",
					"rgba(90,70,70,1.0)","rgba(90,70,70,1.0)","rgba(90,70,70,1.0)","rgba(90,70,70,1.0)","rgba(90,70,70,1.0)","rgba(90,70,70,1.0)"];
}

StarChart.prototype.setProperty = function(propertyTheta, propertyR){
	var _this = this;
	this.propertyTheta = propertyTheta;
	this.propertyR = propertyR;


}

StarChart.prototype.draw = function(){
	var _this = this;
	this.svg.selectAll("." + _this.chartName).remove();
	this.arc = d3.svg.arc()
	    .outerRadius(this.radius+5)
	    .innerRadius(0);

	this.pie = d3.layout.pie()
		.sort(null)
		.value(function(d) { return d; });

	
	this.thetaScale = d3.scale.linear()
		.domain([0, d3.max(this.data, function(d){return +d[_this.propertyTheta];})])
		.range([2*Math.PI,0]);
	this.rScale = d3.scale.linear()
		.domain([0, d3.max(this.data, function(d){return +d[_this.propertyR];})])
		.range([0, this.radius]);

	var line = d3.svg.line()
		    .x(function(d) { return _this.center.x - Math.sin(_this.thetaScale(+d[_this.propertyTheta])) * _this.rScale(+d[_this.propertyR]); })
		    .y(function(d) { return _this.center.y - Math.cos(_this.thetaScale(+d[_this.propertyTheta])) * _this.rScale(+d[_this.propertyR]); });

	var commas = d3.format(",");
		
	var graph = this.svg.selectAll("." + _this.newName)
	  	.data(_this.pie(_this.hourPie));
		
	var arcGrp = graph.enter().append("g")
		.attr("transform", "translate(" + _this.center.x + "," + _this.center.y + ")")
	  	.attr("class",  _this.newName);

	arcGrp.append("path")
      	.attr("d", _this.arc)
      	.style("fill", function(d,i) { return _this.color[i]; })
	arcGrp.append("text")
		.attr("transform", function(d) {
		    var labelR = _this.radius + 10;
		    return "translate(" + (Math.sin(d.startAngle) *labelR) +  ',' +
		       (-Math.cos(d.startAngle) * labelR) +  ")"; 
		})
		.attr("text-anchor", "middle")
		.attr("dy", function(d,i){
			return (d.startAngle >= Math.PI*0.5 && d.startAngle <= Math.PI*1.5)? ( -d3.round(Math.cos(d.startAngle) * 0.6,2)) + "em":( -d3.round(Math.cos(d.startAngle) * 0.2,2)) + "em";
		})
		.attr("dx", function(d,i){
			return (d3.round(Math.sin(d.startAngle),2)) + "em";
		})
		.text(function(d, i){ 
			var format = d3.time.format("%I %p")
			return (i%2===0)? format(new Date(0, 0, 0, i, 0, 0, 0)):"" ;
		});	



    /*Join new data*/
	var graph = this.svg.append("path")
  		.attr("class",this.newName)
  		.attr("d", line(this.data))
  		.style("fill", "rgba(230,200,230,0.3)");

	/*Set title for graph */
	if(this.title!== null){
		this.svg.selectAll(".title").remove();
		this.svg.append("text")
			.attr("class", "title")
			.attr("transform", "translate(" + _this.center.x + "," + (_this.border.top) + ")")
		    .style("text-anchor","middle")
		    .text(_this.title);
	}

	if (this.newName!==null){
		this.chartName = this.newName; 

	}
	
}
	

