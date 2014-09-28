function GraphicManager(htmlId) {
	this.lat = 41.8749077;
	this.lon = -87.6368363;
	this.scale = 10;

	this.mapId = htmlId;


	this.map = null;
	this.mapLayer = null;

	this.svgs = [];
	this.divs = [];
	this.graphicManagers = [];

}

/*
	Create the map and attach it to the div specified in htmlId (without "#")
	map type:

*/
GraphicManager.prototype.createMap = function(type) {
	if(this.map == null)
		this.map = L.map(this.mapId).setView([this.lat, this.lon], this.scale);

	if(this.mapLayer != null)
		this.map.removeLayer(this.mapLayer);

	// Load the map
	switch(type) {
		case "normal":
			this.mapLayer = L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
					minZoom: 10,
					maxZoom: 18,
					attribution: ''
				});
			this.mapLayer.addTo(this.map);
			break;

		case "satellitar":

			this.mapLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
				minZoom: 10,
				maxZoom: 18,
				attribution: ''
			});
			this.mapLayer.addTo(this.map);
			break;

		default:

			this.mapLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
				minZoom: 10,
				maxZoom: 18,
				attribution: ''		
			});
			this.mapLayer.addTo(this.map);
	}

	this.mapWidth = +d3.select("#"+this.mapId).style("width").slice(0, -2);
	this.mapHeight = +d3.select("#"+this.mapId).style("height").slice(0, -2);
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
	   .attr("viewBox","0 0 100 100")
	   .style("background-color", "rgba(200,200,200,0.5)");

	this.svgs.push(svg);

	return svg;
}

GraphicManager.prototype.addSubMap = function(x, y, width, height, mapId, type) {
	var div = d3.select("#"+this.mapId).append("div");
	div.attr("_height", height)
	   .attr("_width", width)
	   .attr("_x", x)
	   .attr("_y", y)
	   .style("position", "absolute")
	   .attr("id",mapId)
	   .attr("class","submap");

	var gm = new GraphicManager(mapId);

	this.divs.push(div);
	this.positionDIVs();

	gm.createMap(type);

	
	this.graphicManagers.push(gm);
}

/*
	Position svgs translating from percentage to actual pixels
*/
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
	Position svgs translating from percentage to actual pixels
*/
GraphicManager.prototype.positionDIVs = function() {
	for(var s in this.divs) {
		var div = this.divs[s];
		div.style("height", div.attr("_height") * this.mapHeight + "px")
		   .style("width", div.attr("_width") * this.mapWidth + "px")
		   .style("margin-left", div.attr("_x") * this.mapWidth + "px")
		   .style("margin-top", div.attr("_y") * this.mapHeight + "px");
	}
}

/*
	Call this function when the window is resized
*/
GraphicManager.prototype.updateWindow = function() {
	// Set the new dimension
	this.mapWidth = +d3.select("#"+this.mapId).style("width").slice(0, -2);
	this.mapHeight = +d3.select("#"+this.mapId).style("height").slice(0, -2);

	this.positionSVGs();
	this.positionDIVs();

	// Update other GraphicManagers
	for(var g in this.graphicManagers) {
		var gm = this.graphicManagers[g];
		gm.updateWindow();
	}
}

/*
	Test function that add a marker with a default icon
*/
GraphicManager.prototype.addMarker = function(lat, lon) {
	var icon = L.icon({
	    iconUrl: "http://cdn.leafletjs.com/leaflet-0.7.3/images/marker-icon.png",

	    iconSize:     [23, 41], // size of the icon
	    iconAnchor:   [10, 41], // point of the icon which will correspond to marker's location
	});

	var marker = L.marker([lat, lon], {
		icon: icon
	}).addTo(this.map);
}

