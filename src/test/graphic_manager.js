function GraphicManager() {
    this.lat = 41.8749077;
    this.lon = -87.6368363;
    this.scale = 10;
    this.mapId = null;

    this.svgs = [];
    this.divs = [];
    this.graphicManagers = [];
    this.markers = [];

}

/*
	Create the map and attach it to the div specified in htmlId (without "#")
	map type:

*/
GraphicManager.prototype.createMap = function (htmlId, type) {
    this.mapId = htmlId;
    this.map = L.map(htmlId).setView([this.lat, this.lon], this.scale);

    // Load the map
    this.addLayer(type);

    this.mapWidth = +d3.select("#" + htmlId).style("width").slice(0, -2);
    this.mapHeight = +d3.select("#" + htmlId).style("height").slice(0, -2);
};

GraphicManager.prototype.addLayer = function (type) {
    switch (type) {
    case "normal":
        this.mapLayer = L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
            attribution: ''
        }).addTo(this.map);
        break;

    case "satellitar":
        this.mapLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: ''
        }).addTo(this.map);
        break;

    case "grey":
        this.mapLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            attribution: ''
        }).addTo(this.map);
        break;

    default:
        this.mapLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: '',
            maxZoom: 16
        }).addTo(this.map);
    }
};

GraphicManager.prototype.removeLayer = function () {
    this.map.removeLayer(this.mapLayer);
};

GraphicManager.prototype.changeLayer = function (type) {
    this.removeLayer();
    this.addLayer(type);
};

/*
	Create an SVG in the percentage coordinates (x,y) with (width,height)
	ex: addSvg(0.1, 0.2, 0.25, 0.25) will position the svg at 10% 20% with width 25% and height 25% 
*/
GraphicManager.prototype.addSvg = function (x, y, width, height) {

    var svg = d3.select("#" + this.mapId).append("svg");

    svg.attr("_height", height)
        .attr("_width", width)
        .attr("_x", x)
        .attr("_y", y)
        .style("position", "absolute")
        .attr("viewBox", "0 0 100 100");

    this.svgs.push(svg);

    return svg;
};

GraphicManager.prototype.addSubMap = function (x, y, width, height, mapId, type) {
    var div = d3.select("#" + this.mapId).append("div");
    div.attr("_height", height)
        .attr("_width", width)
        .attr("_x", x)
        .attr("_y", y)
        .style("position", "absolute")
        .attr("id", mapId)
        .attr("class", "submap");

    var gm = new GraphicManager();

    this.divs.push(div);
    this.positionDIVs();

    gm.createMap(mapId, type);

    this.graphicManagers.push(gm);
};

/*
	Position svgs translating from percentage to actual pixels
*/
GraphicManager.prototype.positionSVGs = function () {
    for (var s in this.svgs) {
        var svg = this.svgs[s];
        svg.attr("height", svg.attr("_height") * this.mapHeight + "px")
            .attr("width", svg.attr("_width") * this.mapWidth + "px")
            .style("margin-left", svg.attr("_x") * this.mapWidth + "px")
            .style("margin-top", svg.attr("_y") * this.mapHeight + "px");
    }
};

/*
	Position svgs translating from percentage to actual pixels
*/
GraphicManager.prototype.positionDIVs = function () {
    for (var s in this.divs) {
        var div = this.divs[s];
        div.style("height", div.attr("_height") * this.mapHeight + "px")
            .style("width", div.attr("_width") * this.mapWidth + "px")
            .style("margin-left", div.attr("_x") * this.mapWidth + "px")
            .style("margin-top", div.attr("_y") * this.mapHeight + "px");
    }
};

/**
 *  Refresh the markers, updating their size and position based on windows size
 */
GraphicManager.prototype.refreshMarkers = function () {
    for (var m in this.markers) {
        var marker = this.markers[m];
        marker.options.icon.options.iconSize = [this.mapWidth / 15, this.mapHeight / 15];
        marker.options.icon.options.iconAnchor = [this.mapWidth / 15 / 2, this.mapHeight / 15];
        marker.setIcon(marker.options.icon);
    }
};

/*
	Call this function when the window is resized
*/
GraphicManager.prototype.updateWindow = function () {
    // Set the new dimension
    this.mapWidth = +d3.select("#" + this.mapId).style("width").slice(0, -2);
    this.mapHeight = +d3.select("#" + this.mapId).style("height").slice(0, -2);

    this.positionSVGs();
    this.positionDIVs();
    this.refreshMarkers();

    // Update other GraphicManagers
    for (var g in this.graphicManagers) {
        var gm = this.graphicManagers[g];
        gm.updateWindow();
    }
};

/**
 *
 */
GraphicManager.prototype.drawMarkers = function (type) {
    switch (type) {
    case "popularity":
        // TODO loop on all stations
        var marker = L.marker([41.868450, -87.666515], {
            icon: new Icon({
                iconUrl: '/icons/stations_popularity/station_5.svg',
                iconSize: [this.mapWidth / 15, this.mapHeight / 15],
                iconAnchor: [this.mapWidth / 15 / 2, this.mapHeight / 15], // to point exactly at lat/lon
            }),
        }).addTo(this.map);
        this.markers.push(marker);

        break;
    }

};