function GraphicManager(htmlId) {
    this.lat = 41.8749077;
    this.lon = -87.6368363;
    this.scale = 10;

    this.mapId = htmlId;

    this.map = null;
    this.mapLayer = null;
    this.type = "popularity";

    // Graphs
    this.dayWeekBarGraph = null;
    this.bikesHourDay = null;
    this.bikesHourDayComparison = null;
    this.bikesDayYear = null;

    this.svgs = [];
    this.divs = [];
    this.graphicManagers = [];
    this.markers = [];
    this.bikesCoordinate = [];
    this.bikes = [];

    this.communityAreaMapURL = "/data/chicago_community_district_map.json";

    this.communityAreaLayer = null;

    this.dm = new DataManager("http://data.divvybikeschicago.com/trip.php",
        "http://data.divvybikeschicago.com/station.php");
}

/*
	Create the map and attach it to the div specified in htmlId (without "#")
	map type:

*/
GraphicManager.prototype.createMap = function (type) {
    this.map = L.map(this.mapId, {
        zoomControl: false,
        doubleClickZoom: false
    }).setView([this.lat, this.lon], this.scale);

    // Load the map
    this.addLayer(type);

    this.mapWidth = +d3.select("#" + this.mapId).style("width").slice(0, -2);
    this.mapHeight = +d3.select("#" + this.mapId).style("height").slice(0, -2);
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

    svg.attr("class", "default")
        .attr("_height", height)
        .attr("_width", width)
        .attr("_x", x)
        .attr("_y", y)
        .style("position", "absolute")
        .attr("viewBox", "0 0 100 100")
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .style("background-color", "rgba(89, 89, 89, 0.6)");

    this.svgs.push(svg);

    return svg;
};

GraphicManager.prototype.addExternalSVGs = function (callback) {
    var self = this;
    d3.xml("/icon/calendar.svg", "image/svg+xml", function (xmlCalendar) {
        d3.xml("/icon/zoom.svg", "image/svg+xml", function (xmlZoom) {
            d3.xml("/icon/stationControl.svg", "image/svg+xml", function (xmlStation) {

                document.getElementById(self.mapId).appendChild(xmlCalendar.documentElement);
                var svg = d3.select("#calendar");

                svg.attr("_height", 0.24)
                    .attr("_width", 0.07)
                    .attr("_x", 0)
                    .attr("_y", 0.31 + 0.005)
                    .style("position", "absolute")
                    .style("background-color", "rgba(89, 89, 89, 0.6)");

                self.svgs.push(svg);

                var calendarControl = new CalendarControl();
                calendarControl.draw();

                ////////////////////////////////////

                document.getElementById(self.mapId).appendChild(xmlZoom.documentElement);
                svg = d3.select("#zoom");

                svg.attr("_height", 0.24)
                    .attr("_width", 0.035)
                    .attr("_x", 0)
                    .attr("_y", 1 - 0.24)
                    .style("position", "absolute")
                    .style("background-color", "rgba(89, 89, 89, 0.6)");

                self.svgs.push(svg);

                zoomControl.draw();

                ////////////////////////////////////

                document.getElementById(self.mapId).appendChild(xmlStation.documentElement);
                svg = d3.select("#stationControl");

                svg.attr("_height", 0.45)
                    .attr("_width", 0.07)
                    .attr("_x", 0.072)
                    .attr("_y", 0.250)
                    .style("position", "absolute")
                    .style("background-color", "rgba(89, 89, 89, 0.6)");

                self.svgs.push(svg);

                stationControl.draw();

                ////////////////////////////////////

                callback();
            });
        });
    });


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
        if (svg.attr("_height") !== null) {
            svg.attr("height", svg.attr("_height") * this.mapHeight + "px")
                .attr("width", svg.attr("_width") * this.mapWidth + "px");
        }
        svg.style("margin-left", svg.attr("_x") * this.mapWidth + "px")
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
    this.iconWidth = this.mapHeight / 18;
    this.iconHeight = this.mapHeight / 18 / (268 / 383);
    for (var m in this.markers) {
        var marker = this.markers[m];
        //marker.options.icon.options.iconSize = [this.mapWidth / 15, this.mapHeight / 15];
        //marker.options.icon.options.iconAnchor = [this.mapWidth / 15 / 2, this.mapHeight / 15];
        marker.options.icon.options.iconSize = [this.iconWidth, this.iconHeight];
        marker.options.icon.options.iconAnchor = [this.iconWidth / 2, this.iconHeight];
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
    this.type = type;
    this.dm.getStations(this.drawMarkersCallback.bind(this));
};

GraphicManager.prototype.drawMarkersCallback = function (stations) {
    this.iconWidth = this.mapHeight / 18;
    this.iconHeight = this.mapHeight / 18 / (268 / 383);
    switch (this.type) {
    case "popularity":
        for (var s in stations) {
            var level = Math.floor(stations[s].popularity * 5);
            if (level === 5) level = 4; // to restrict the most popular to the last level
            var marker = L.marker([stations[s].latitude, stations[s].longitude], {
                icon: new Icon({
                    //iconUrl: '/icon/stations_popularity/station_' + (level + 1) + '.svg',
                    //iconSize: [this.mapHeight / 15, this.mapHeight / 15],
                    //iconAnchor: [this.mapWidth / 15 / 2, this.mapHeight / 15], // to point exactly at lat/lon
                    iconUrl: '/icon/stations_popularity/station_' + (level + 1) + '.png',
                    iconSize: [this.iconWidth, this.iconHeight],
                    iconAnchor: [this.iconWidth / 2, this.iconHeight], // to point exactly at lat/lon
                }),
            }).addTo(this.map);
            this.markers.push(marker);

            //Set the station id
            marker.id = stations[s].id;

            //Add callback
            marker.on("mousedown", function (e) {
                this.selectedStation(e.target.id);
            }.bind(this));
        }
        break;
    }

};

GraphicManager.prototype.selectedStation = function (stationId) {
    console.log(stationId);

    var selectedStations = this.dm.selectedStations;
    if (selectedStations.indexOf(stationId) == -1) {
        // Add the stations to selected
        selectedStations.push(stationId);
    } else {
        selectedStations.slice(selectedStations.indexOf(stationId), 1);
    }

    this.updateGraphs();
};

/*
    Add the community area layer and set the callback.
    When an area will be selected the callback will be called.
*/
GraphicManager.prototype.addCommunityMap = function (callback) {

    if (this.communityAreaLayer !== null) {
        this.map.addLayer(this.communityAreaLayer);
        this.communityAreaLayer.bringToFront();
    } else
        d3.json(this.communityAreaMapURL, function (error, geojsonFeature) {

            function onEachFeature(feature, layer) {
                // A function to reset the colors when a neighborhood is not longer 'hovered'
                function resetHighlight(e) {
                    var layer = e.target;
                    layer.setStyle({
                        weight: 1,
                        opacity: 1,
                        color: '#09F',
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
                        fillOpacity: 0.7,
                        fillColor: '#1abc9c'
                    });
                }

                layer.bindPopup(feature.id);
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: function (e) {
                        callback(feature.id);
                    }
                });
            }

            this.communityAreaLayer = L.geoJson(geojsonFeature, {
                onEachFeature: onEachFeature,
                weight: 1,
                opacity: 1,
                color: '#09F',
                fillOpacity: 0.7,
                fillColor: '#FEB24C'
            }).addTo(this.map);

        }.bind(this));

};

GraphicManager.prototype.removeCommunityMap = function () {
    if (this.communityAreaLayer !== null)
        this.map.removeLayer(this.communityAreaLayer);
};

GraphicManager.prototype.pointInArea = function (point, coordinates) {
    return gju.pointInMultiPolygon({
        "type": "Point",
        "coordinates": point
    }, {
        "type": "MultiPolygon",
        "coordinates": coordinates
    });
};

GraphicManager.prototype.selectAllStationsInArea = function (areaId) {
    // TODO for cycle on all the stations and add to the selected if pointInArea TRUE
};

GraphicManager.prototype.drawLinesBetweenStations = function (data) {

};

GraphicManager.prototype.zoomIn = function () {
    this.map.zoomIn(1);
};

GraphicManager.prototype.zoomOut = function () {
    this.map.zoomOut(1);
};

/*
    Draw bikes
*/
GraphicManager.prototype.drawBikes = function () {

    // Remove all bikes
    for (var b in this.bikes) {
        this.map.removeLayer(this.bikes[b]);
    }


    // Draw new bikes
    for (var b in this.bikesCoordinate) {
        var coordinate = this.bikesCoordinate[b];
        var circle = L.circle(coordinate, 20, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
        }).addTo(this.map);

        this.bikes.push(circle);
    }
};

GraphicManager.prototype.drawBikesInMoment = function () {
    this.dm.getBikes(this.bikesCallback.bind(this));
};

GraphicManager.prototype.bikesCallback = function (data) {

    // Empty bikes coordinates
    this.bikesCoordinate = [];

    // Parse every row and find the position of the bike
    for (i in data) {
        var d = data[i];
        var minStart = parseInt(d.starttime.substring(0, 2)) * 60 + parseInt(d.starttime.substring(3, 5));
        var minStop = parseInt(d.stoptime.substring(0, 2)) * 60 + parseInt(d.stoptime.substring(3, 5));
        var min = parseInt(this.dm.hour.substring(0, 2)) * 60 + parseInt(this.dm.hour.substring(3, 5));
        var latStart = parseFloat(d.from_lat);
        var lonStart = parseFloat(d.from_lon);
        var latStop = parseFloat(d.to_lat);
        var lonStop = parseFloat(d.to_lon);

        // If it is not in the interval
        if (minStart > min || minStop < min)
            continue;

        // Interpolate coordinates
        var curLat = latStart * (1 - (min - minStart) / (minStop - minStart)) +
            latStop * (min - minStart) / (minStop - minStart);
        var curLon = lonStart * (1 - (min - minStart) / (minStop - minStart)) +
            lonStop * (min - minStart) / (minStop - minStart);

        // Add to bikes coordinates
        this.bikesCoordinate.push([curLat, curLon]);
    }

    console.log(this.bikesCoordinate);

    this.drawBikes();
}

GraphicManager.prototype.removeBikes = function () {
    // Empty bikes coordinates
    this.bikesCoordinate = [];
    this.drawBikes();
}

/*
    This function will update all graphs
*/
GraphicManager.prototype.updateGraphs = function() {
    if( this.dayWeekBarGraph != null)
        this.dm.getBikesWeek( function(data) {
            // Right order of the days
            var days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
            function compare(a,b) {
              if (days.indexOf(a.day) < days.indexOf(b.day))
                 return -1;
              if (days.indexOf(a.day) > days.indexOf(b.day))
                return 1;
              return 0;
            }
            data.sort(compare);

            this.dayWeekBarGraph.setData(data);
            this.dayWeekBarGraph.setAxes("day", "Day", "count", "Rides");
            this.dayWeekBarGraph.draw();

            //document.getElementById(this.mapId).style.webkitTransform = 'scale(1)';
            $(window).trigger('resize');
        }.bind(this));

    if( this.bikesHourDay != null)
        this.dm.getBikesHourDay( function(data) {
            // Single line chart
            this.bikesHourDay.setData(data.sort(function(a,b){
                return (+a.hour) - (+b.hour);
            }));
            this.bikesHourDay.setAxes("hour","Hour", "count", "Rides");
            this.bikesHourDay.draw();

            // Multiple line chart
            var d = (data.sort(function(a,b){
                return (+a.hour) - (+b.hour);
            }));
            console.log(d);
            lineChart2.setData(d.sort(function(a,b){
                return (+a.hour) - (+b.hour);
            }), "fromStation", "Station" );
            this.bikesHourDayComparison.setAxes("hour","Hour", "count", "Rides");
            this.bikesHourDayComparison.draw();

            document.getElementById(this.mapId).style.webkitTransform = 'scale(1)';
            $(window).trigger('resize');
        }.bind(this));

    
    gm.bikesHourDayComparison = lineChart2;

    /*
    this.dayWeekBarGraph = null;
    this.bikesHourDay = null;
    this.bikesDayYear = null;
    */

}

