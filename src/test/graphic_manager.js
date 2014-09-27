function GraphicManager() {
	this.lat = 41.8749077;
	this.lon = -87.6368363;
	this.scale = 10;
	this.mapId = null;

	this.svgs = [];

}

/*
	Create the map and attach it to the div specified in htmlId (without "#")
*/
GraphicManager.prototype.createMap = function(htmlId) {
	this.mapId = htmlId;
	this.map = L.map(htmlId).setView([this.lat, this.lon], this.scale);

	// Load the map
	var Thunderforest_OpenCycleMap = L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
		}).addTo(this.map);

	this.mapWidth = +d3.select("#"+htmlId).style("width").slice(0, -2);
	this.mapHeight = +d3.select("#"+htmlId).style("height").slice(0, -2);
}

/*
	Create an SVG in the percentage coordinates (x,y) with (width,height)
	ex: addSvg(0.1, 0.2, 0.25, 0.25) will position the svg at 10% 20% with width 25% and height 25% 
*/
GraphicManager.prototype.addSvg = function(x, y, width, height) {

	var svg = d3.select("#"+this.mapId).append("svg");

	svg.attr("_height", height)
	   .attr("_width", width)
	   .attr("_x", x)
	   .attr("_y", y)
	   .style("position", "absolute")
	   .attr("viewBox","0 0 100 100");

	this.svgs.push(svg);
	   /*
		.style("position","relative")
		.style("margin-left", x+"px")
		.style("margin-top", y+"px")
		.style("position", "absolute")
		*/

		// Decomment in order to disable drag under SVGs
		/*.on("mousedown", function() {
		 	d3.event.stopPropagation();
		})	// Disable mouse interacion*/

	return svg;
}

GraphicManager.prototype.positionSVGs = function() {
	for(var s in this.svgs) {
		var svg = this.svgs[s];
		svg.attr("height", svg.attr("_height") * this.mapHeight + "px")
		   .attr("width", svg.attr("_width") * this.mapWidth + "px")
		   .style("margin-left", svg.attr("_x") * this.mapWidth + "px")
		   .style("margin-top", svg.attr("_y") * this.mapHeight + "px");
	}
}

/*
	Call this function when the window is resized
*/
GraphicManager.prototype.updateWindow = function() {
	// Set the new dimension
	this.mapWidth = +d3.select("#"+this.mapId).style("width").slice(0, -2);
	this.mapHeight = +d3.select("#"+this.mapId).style("height").slice(0, -2);
	console.log(this.mapWidth, this.mapHeight);

	this.positionSVGs();
}
