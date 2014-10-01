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
    this.markers = [];

    this.communityAreaMapURL = "chicago_community_district_map.json";

    this.communityAreaLayer = null;

}

/*
	Create the map and attach it to the div specified in htmlId (without "#")
	map type:

*/
GraphicManager.prototype.createMap = function (type) {
    this.map = L.map(this.mapId , {
            zoomControl:false
        }).setView([this.lat, this.lon], this.scale);

    // Load the map
    this.addLayer(type);

    this.mapWidth = +d3.select("#" + this.mapId ).style("width").slice(0, -2);
    this.mapHeight = +d3.select("#" + this.mapId ).style("height").slice(0, -2);
};

GraphicManager.prototype.addLayer = function (type) {
    switch (type) {
    case "normal":
        this.mapLayer = L.tileLayer('http://a{s}.acetate.geoiq.com/tiles/terrain/{z}/{x}/{y}.png', {
            attribution: '',
            minZoom: 10,
            maxZoom: 16
        }).addTo(this.map);
        break;

    case "satellitar":
        this.mapLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '',
            minZoom: 10,
            maxZoom: 16
        }).addTo(this.map);
        break;

    case "grey":
        this.mapLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            attribution: '',
            minZoom: 10,
            maxZoom: 16
        }).addTo(this.map);
        break;

    default:
        this.mapLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: '',
            minZoom: 10,
            maxZoom: 16
        }).addTo(this.map);
    }
    var Acetate_roads = L.tileLayer('http://a{s}.acetate.geoiq.com/tiles/acetate-roads/{z}/{x}/{y}.png', {
        attribution: '&copy;2012 Esri & Stamen, Data from OSM and Natural Earth',
        subdomains: '0123',
        minZoom: 2,
        maxZoom: 18
    });
    /*
    var topPane = this.map._createPane('leaflet-top-pane', this.map.getPanes().mapPane);
    var topLayer = Acetate_roads.addTo(this.map);
    topPane.appendChild(topLayer.getContainer());
    topLayer.setZIndex(4);
    */
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
        .attr("viewBox", "0 0 100 100")
        //.style("background-color","rgba(89, 89, 89, 0.5)")
    ;

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

	var gm = new GraphicManager(mapId);

    this.divs.push(div);
    this.positionDIVs();

	gm.createMap(type);

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
                iconUrl: '/icon/stations_popularity/station_5.svg',
                iconSize: [this.mapWidth / 15, this.mapHeight / 15],
                iconAnchor: [this.mapWidth / 15 / 2, this.mapHeight / 15], // to point exactly at lat/lon
            }),
        }).addTo(this.map);
        this.markers.push(marker);

        break;
    }

};

GraphicManager.prototype.addCommunityMap = function() {

    if(this.communityAreaLayer != null) {
        this.map.addLayer(this.communityAreaLayer);
        this.communityAreaLayer.bringToFront();
    }
    else
        d3.json(this.communityAreaMapURL, function(error, geojsonFeature) {

            function onEachFeature(feature, layer) {
                // A function to reset the colors when a neighborhood is not longer 'hovered'
                function resetHighlight(e) {
                  var layer = e.target;
                  layer.setStyle({
                    weight: 1,
                    opacity: 1,
                    color: '#09F',
                    //dashArray: '3',
                    fillOpacity: 0.7,
                    fillColor: '#FEB24C'
                  });
                }
                // Set hover colors
                function highlightFeature(e) {
                  var layer = e.target;
                  layer.setStyle({
                    weight: 2,
                    opacity: 1,
                    color: '#09F',
                    //dashArray: '3',
                    fillOpacity: 0.7,
                    fillColor: '#1abc9c'
                  });
                }

                layer.bindPopup(feature.id);
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight
                });
            }

            this.communityAreaLayer = L.geoJson(geojsonFeature,{
                            onEachFeature: onEachFeature,
                            weight: 1,
                            opacity: 1,
                            color: '#09F',
                            //dashArray: '3',
                            fillOpacity: 0.7,
                            fillColor: '#FEB24C'
                        }).addTo(this.map);

        }.bind(this));
    
}

GraphicManager.prototype.removeCommunityMap = function() {
    if(this.communityAreaLayer != null)
        this.map.removeLayer(this.communityAreaLayer);
}

GraphicManager.prototype.pointInArea = function(point, coordinates) {
    return gju.pointInMultiPolygon({"type":"Point","coordinates": point},
                 {"type":"MultiPolygon", "coordinates": coordinates})
}
