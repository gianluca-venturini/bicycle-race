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
    this.bikesDayYearComparison = null;
    this.tripsGender = null;
    this.tripsAge = null;
    this.tripsCustomerType = null;

    this.svgs = [];
    this.divs = [];
    this.graphicManagers = [];
    this.stations = null;
    this.markers = [];
    this.bikesCoordinate = [];
    this.bikes = [];
    this.linesBetweenStations = [];

    this.communityAreaMapURL = "/data/chicago_community_district_map.json";

    this.communityAreaLayer = null;
    this.lineBetweenStations = null;

    this.dm = new DataManager("http://data.divvybikeschicago.com/trip.php",
        "http://data.divvybikeschicago.com/station.php",
        "http://data.divvybikeschicago.com/weather.php");

    this.lastSelected = null;
    this.showStation = false;
    this.stationControl = null;
    this.calendarControl = null;
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
        .style("background-color", "rgba(64, 64, 64, 0.7)");

    this.svgs.push(svg);

    return svg;
};

GraphicManager.prototype.addExternalSVGs = function (callback) {
    var self = this;
    d3.xml("/icon/calendar.svg", "image/svg+xml", function (xmlCalendar) {
        d3.xml("/icon/zoom.svg", "image/svg+xml", function (xmlZoom) {
            d3.xml("/icon/stationControl.svg", "image/svg+xml", function (xmlStation) {
                d3.xml("/icon/day.svg", "image/svg+xml", function (xmlDay) {

                    document.getElementById(self.mapId).appendChild(xmlCalendar.documentElement);
                    var svg = d3.select("#calendar");

                    svg.attr("_height", 0.24)
                        .attr("_width", 0.07)
                        .attr("_x", 0)
                        .attr("_y", 0.31 + 0.005)
                        .style("position", "absolute")
                        .style("background-color", "rgba(64, 64, 64, 0.7)");

                    self.svgs.push(svg);

                    var calendarControl = new CalendarControl();

                    self.calendarControl = calendarControl;
                    calendarControl.setCallbackSetDate(self.callbackSetDate.bind(self));

                    calendarControl.draw();

                    ////////////////////////////////////

                    document.getElementById(self.mapId).appendChild(xmlZoom.documentElement);
                    svg = d3.select("#zoom");

                    svg.attr("_height", 0.24)
                        .attr("_width", 0.035)
                        .attr("_x", 0)
                        .attr("_y", 1 - 0.24)
                        .style("position", "absolute")
                        .style("background-color", "rgba(64, 64, 64, 0.7)");

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
                        .style("background-color", "rgba(64, 64, 64, 0.7)");

                    self.svgs.push(svg);

                    self.stationControl = stationControl;
                    stationControl.setCallbackCompareAll(self.selectCompareAll.bind(self));

                    stationControl.draw();

                    ////////////////////////////////////

                    document.getElementById(self.mapId).appendChild(xmlDay.documentElement);
                    svg = d3.select("#dayControl");

                    svg.attr("_height", 0.24 + 0.005)
                        .attr("_width", 0.1)
                        .attr("_x", 0.072)
                        .attr("_y", 0)
                        .style("position", "absolute")
                        .style("background-color", "rgba(64, 64, 64, 0.7)");

                    self.svgs.push(svg);

                    self.dayControl = dayControl;
                    dayControl.setCallbackDayClose(self.callbackDayClose.bind(self));

                    dayControl.draw();
                    self.dayControl.enabled = false;
                    //TODO hide

                    var svgSlider = self.addSvg.call(self, 0.072, 0.24 + 0.005 - 0.06, 0.1, 0.06);
                    callback();
                    self.slider = new Slider(svgSlider);
                    self.slider.draw();
                    self.slider.setCallbackSetHour(self.callbackSetHour.bind(self));

                    ////////////////////////////////////

                    callback();
                });
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

////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
GraphicManager.prototype.drawMarkers = function (type) {
    this.type = type;
    this.dm.getStations(this.drawMarkersCallback.bind(this));
};

GraphicManager.prototype.drawMarkersCallback = function (stations) {
    var self = this;
    this.stations = stations;
    this.iconWidth = this.mapHeight / 18;
    this.iconHeight = this.mapHeight / 18 / (268 / 383);
    switch (this.type) {
    case "popularity":
        for (var s in stations) {
            var level = Math.floor(stations[s].popularity * 6);
            if (level === 6) level = 5; // to restrict the most popular to the last level
            stations[s].popularityLevel = level; // store value
            var marker = L.marker([stations[s].latitude, stations[s].longitude], {
                icon: new Icon({
                    //iconUrl: '/icon/stations_popularity/station_' + (level + 1) + '.svg',
                    //iconSize: [this.mapHeight / 15, this.mapHeight / 15],
                    //iconAnchor: [this.mapWidth / 15 / 2, this.mapHeight / 15], // to point exactly at lat/lon
                    iconUrl: '/icon/stations_popularity/station_' + (level) + '.png',
                    iconSize: [this.iconWidth, this.iconHeight],
                    iconAnchor: [this.iconWidth / 2, this.iconHeight], // to point exactly at lat/lon
                }),
            }).addTo(this.map);
            // Store station into marker
            marker.station = stations[s];
            // Store marker into station
            stations[s].marker = marker;
            this.markers.push(marker);

            //Set the station id
            marker.id = stations[s].id;
            marker.deselectedUrl = '/icon/stations_popularity/station_' + (level) + '.png';
            marker.selectedUrl = '/icon/stations_popularity/station_' + (level) + '_selected.png';
            marker.selected = false;

            //Add callback
            marker.on("click", function (e) {

                try {
                    if (this.lastSelected.id !== e.target.id) {
                        // Invert previous marker's icon and selection
                        if (this.lastSelected.selected) {
                            this.lastSelected.selected = !this.lastSelected.selected;
                        }
                    }
                } catch (err) {
                    // do nothing
                }

                // Change status of the current marker
                e.target.selected = !e.target.selected;

                // Update last selected marker
                this.lastSelected = e.target;

                // Pass info to the controller of the button
                this.stationControl.selectedStation = e.target.station;

                this.drawSelectedMarkers();

                // Redraw current station's info
                this.selectedStation(e.target.station);

            }.bind(this));
        }
        break;
    }

};

/**
 *   Redraws all of the stations' markers acccording to which have been selected
 */
GraphicManager.prototype.drawSelectedMarkers = function () {

    var selectedStations = this.dm.selectedStations;
    var stations = this.stations;

    var ids = [];
    for (var id = 0; id < selectedStations.length; id++) {
        ids.push(selectedStations[id].id);
    }

    for (var s in stations) {
        if (ids.indexOf(stations[s].id) !== -1) {
            stations[s].marker.options.icon.options.iconUrl = '/icon/stations_popularity/station_' + stations[s].popularityLevel + '_compareAll.png';
            stations[s].marker.setIcon(stations[s].marker.options.icon);
        } else {
            stations[s].marker.options.icon.options.iconUrl = '/icon/stations_popularity/station_' + stations[s].popularityLevel + '.png';
            stations[s].marker.setIcon(stations[s].marker.options.icon);
        }
    }

};

GraphicManager.prototype.selectedStation = function (station) {

    var marker = station.marker;
    if (marker.selected) {
        d3.select('#stationControl').style('opacity', '1');
        marker.options.icon.options.iconUrl = marker.selectedUrl;
        marker.setIcon(marker.options.icon);
    } else {
        d3.select('#stationControl').style('opacity', '0');
        this.drawSelectedMarkers();
    }

    // Show station info
    this.updateStationControl(station);

};

GraphicManager.prototype.selectCompareAll = function (station) {

    var selectedStations = this.dm.selectedStations;

    // Retrieve IDs of the selected
    var ids = [];
    for (var id = 0; id < selectedStations.length; id++) {
        ids.push(selectedStations[id].id);
    }

    // Update selected stations
    if (ids.indexOf(station.id) == -1) {
        // Add the stations to selected
        selectedStations.push(station);
    } else {
        selectedStations.splice(ids.indexOf(station.id), 1);
    }

    // Retrieve IDs of the selected
    var ids = [];
    for (var id = 0; id < selectedStations.length; id++) {
        ids.push(selectedStations[id].id);
    }

    // Debug
    var ss = [];
    for (var i = 0; i < selectedStations.length; i++)
        ss.push(selectedStations[i].id);
    console.log("Selected stations: " + ss);

    if (ids.indexOf(station.id) !== -1) {
        station.marker.options.icon.options.iconUrl = '/icon/stations_popularity/station_' + station.popularityLevel + '_compareAll.png';
        station.marker.setIcon(station.marker.options.icon);
    } else {
        station.marker.options.icon.options.iconUrl = '/icon/stations_popularity/station_' + station.popularityLevel + '.png';
        station.marker.setIcon(station.marker.options.icon);
    }

    // TEST
    this.hideLineBetweenStations();
    this.showLineBetweenStations();

    this.updateGraphs();
};

GraphicManager.prototype.updateStationControl = function (station) {
    d3.select('#station_name').text(station.name);
    d3.select('#station_id').text(station.id);
    d3.select('#station_pop').text(d3.format('%')(station.popularity));

};

/////////////////////// CONTROLS CALLBACKS ///////////////////////////////////////////

GraphicManager.prototype.selectAll = function () {
    this.dm.selectedStations = this.stations;
    this.drawSelectedMarkers();
    this.updateGraphs();
};

GraphicManager.prototype.deselectAll = function () {
    this.dm.selectedStations = [];
    this.drawSelectedMarkers();
    this.updateGraphs();
};

GraphicManager.prototype.callbackSetDate = function () {

    // Set the date
    var cal = this.calendarControl;
    var date = "2013-" + cal.month + "-" + cal.dayCounter;
    this.dm.date = date;

    // Make control visible and active
    if (!this.dayControl.enabled) {
        d3.selectAll(".day_box")
            .style("opacity", "1")
            .style("pointer-events", "all");
        this.dayControl.enabled = true;
    }

    // Show date
    var month = cal.month < 10 ? "0" + cal.month : cal.month;
    var day = cal.dayCounter < 10 ? "0" + cal.dayCounter : cal.dayCounter;
    var textDate = month + "/" + day + "/2013";
    d3.select('#day_name').text(textDate);

    this.updateGraphs();
};

GraphicManager.prototype.callbackDayClose = function () {

    d3.selectAll(".day_box")
        .style("opacity", "0")
        .style("pointer-events", "none");

    this.dayControl.enabled = false;
    this.slider.reset();
    this.dm.date = null;
    this.dm.hour = null;

    this.updateGraphs();
};

GraphicManager.prototype.callbackSetHour = function () {

    // Set hour
    this.dm.hour = this.slider.hour;
    this.updateGraphs();

};

////////////////////////////////////////////////////////////////////////////////////////


/*
    Add the community area layer and set the callback.
    When an area will be selected the callback will be called.
*/
GraphicManager.prototype.addCommunityMap = function () {

    var callback = this.selectAllStationsInArea.bind(this);

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
    var res = gju.pointInPolygon({
        "type": "Point",
        "coordinates": point
    }, {
        "type": "Polygon",
        "coordinates": coordinates[0]
    });
    console.log(res);
    return res;
};

GraphicManager.prototype.selectAllStationsInArea = function (area) {
    this.selectedArea = area;
    this.dm.getStations(this.selectStationsInAreaCallback.bind(this));
};


GraphicManager.prototype.selectStationsInAreaCallback = function (stations) {
    this.stations = stations;
    d3.json(this.communityAreaMapURL, function (error, geojsonFeature) {
        var multipoligon = null;
        var features = geojsonFeature.features;
        for (var i in features) {
            var feature = features[i];
            if (feature.id == this.selectedArea) {
                multipoligon = feature.geometry.coordinates;
                break;
            }
        }
        if (multipoligon === null)
            return;

        console.log(this.stations);
        for (var i in this.stations) {
            var station = this.stations[i];
            var coord = [station.longitude, station.latitude];

            if (this.pointInArea(coord, multipoligon)) {
                this.dm.selectedStations.push(station);
            }
        }

        this.updateGraphs();
        this.drawSelectedMarkers();

    }.bind(this));
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
    this.bikes = [];

    // Remove all lines
    for (var l in this.linesBetweenStations) {
        this.map.removeLayer(this.linesBetweenStations[l]);
    }
    this.linesBetweenStations = [];

    // Draw new lines (station to station)
    for (var b in this.bikesCoordinate) {
        var coordinate = this.bikesCoordinate[b];

        var from = L.latLng(coordinate[2], coordinate[3]);
        var to = L.latLng(coordinate[4], coordinate[5]);

        // Draw line
        var line = L.polyline([from, to], {
            color: 'black',
            fillColor: 'black',
            fillOpacity: 0.5,
            weight: 1
        }).addTo(this.map);

        this.linesBetweenStations.push(line);
    }

    // Draw new lines (station to bike)
    for (var b in this.bikesCoordinate) {
        var coordinate = this.bikesCoordinate[b];

        var from = L.latLng(coordinate[2], coordinate[3]);
        var to = L.latLng(coordinate[0], coordinate[1]);

        // Draw line
        var line = L.polyline([from, to], {
            color: 'red',
            fillColor: 'red',
            fillOpacity: 0.5,
            weight: 3
        }).addTo(this.map);

        this.linesBetweenStations.push(line);
    }

    // Draw new bikes
    for (var b in this.bikesCoordinate) {
        var coordinate = this.bikesCoordinate[b];

        // Draw circle
        var circle = L.circle([coordinate[0], coordinate[1]], 20, {
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
        this.bikesCoordinate.push([curLat, curLon, latStart, lonStart, latStop, lonStop]);
    }

    console.log(this.bikesCoordinate);

    this.drawBikes();
};

GraphicManager.prototype.removeBikes = function () {
    // Empty bikes coordinates
    this.bikesCoordinate = [];
    this.drawBikes();
};

/*
    This function will update all graphs
*/
GraphicManager.prototype.updateGraphs = function () {
    if (this.dayWeekBarGraph != null)
        this.dm.getBikesWeek(function (data) {
            // Right order of the days
            var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

            function compare(a, b) {
                if (days.indexOf(a.day) < days.indexOf(b.day))
                    return -1;
                if (days.indexOf(a.day) > days.indexOf(b.day))
                    return 1;
                return 0;
            }
            data.sort(compare);

            // Sum up all the day of the week
            var d = [];
            var k = 0;
            for (var i in days) {
                var day = days[i];
                var line = {};
                line.day = day;
                line.count = 0;
                while (k < data.length && data[k].day == day) {
                    line.count += data[k].count;
                    k += 1;
                }
                d.push(line);
            }

            this.dayWeekBarGraph.setData(d, "daysOfWeek");
            this.dayWeekBarGraph.setAxes("day", "Day", "count", "Rides");
            this.dayWeekBarGraph.draw();

            //document.getElementById(this.mapId).style.webkitTransform = 'scale(1)';
            $(window).trigger('resize');
        }.bind(this));

    if (this.bikesHourDay != null)
        this.dm.getBikesHourDay(function (data) {
            // Single line chart
            // Sum up the data of the hours
            var dd = data.sort(function (a, b) {
                return (+a.hour) - (+b.hour);
            });
            var d = [];
            var hour = 0;
            var k = 0;
            while (hour < 24) {
                var line = {};
                line.hour = "" + hour;
                line.count = 0;
                while (k < dd.length && dd[k].hour == "" + hour) {
                    line.count += dd[k].count;
                    k += 1;
                }
                d.push(line);
                hour += 1;
            }

            this.bikesHourDay.setData(d, "hourOfDay");
            this.bikesHourDay.setAxes("hour", "Hour", "count", "Rides");
            this.bikesHourDay.draw();

            // Multiple line chart
            var d = (data.sort(function (a, b) {
                return (+a.hour) - (+b.hour);
            }));
            this.bikesHourDayComparison.setData(d.sort(function (a, b) {
                return (+a.hour) - (+b.hour);
            }), "hourOfDayMany", "fromStation", "Station");
            this.bikesHourDayComparison.setAxes("hour", "Hour", "count", "Rides");
            this.bikesHourDayComparison.draw();

            document.getElementById(this.mapId).style.webkitTransform = 'scale(1)';
            $(window).trigger('resize');
        }.bind(this));

    // Gender data
    if (this.tripsGender != null ||
        this.tripsAge != null ||
        this.tripsCustomerType != null)
        this.dm.getStationsDemographic(function (data) {
            console.log(data);
            var d = {};
            d.male = 0;
            d.female = 0;
            d.unknown = 0;
            d.customer = 0;
            d.subscriber = 0;
            for (var i in data) {
                d.male += +data[i].male;
                d.female += +data[i].female;
                d.unknown += +data[i].unknown;
                d.customer += +data[i].customer;
                d.subscriber += +data[i].subscriber;
            }

            if (this.tripsGender != null) {
                this.tripsGender.setData([+d.male, +d.female, +d.female], ["Male", "Female", "Unknown"],
                    "demographic",
                    "Gender");
                this.tripsGender.setTitle("Demographic");
                this.tripsGender.draw();
            }

            if (this.tripsCustomerType != null) {
                this.tripsCustomerType.setData([+d.male, +d.female], ["Customer", "Subscriber"],
                    "customer_type",
                    "Customer");
                this.tripsCustomerType.setTitle("Customer type");
                this.tripsCustomerType.draw();
            }
        }.bind(this));

    if (this.bikesDayYearComparison != null)
        this.dm.getBikesDayYear(function (data) {
            // Multiple line chart
            var dd = data;
            this.bikesDayYearComparison.setData(dd, "dayOfYearMany", "fromStation", "Station");
            this.bikesDayYearComparison.setAxes("day", "Day", "count", "Rides");
            this.bikesDayYearComparison.draw();
        }.bind(this));


    gm.bikesHourDayComparison = lineChart2;

    /*
    this.dayWeekBarGraph = null;
    this.bikesHourDay = null;
    this.bikesDayYear = null;
    */

};

GraphicManager.prototype.showLineBetweenStations = function () {
    if (this.lineBetweenStations == null && this.dm.selectedStations.length == 2) {
        this.dm.getStations(this.showLineBetweenStationsCallback.bind(this));

    }
};

GraphicManager.prototype.showLineBetweenStationsCallback = function (stations) {
    if (this.lineBetweenStations != null) {
        this.hideLineBetweenStations();
    }
    var origin = null;
    var destination = null;
    for (var i in stations) {
        var station = stations[i];
        if (this.dm.selectedStations[0] == station.id) {
            origin = L.latLng(station.latitude, station.longitude);
        }
        if (this.dm.selectedStations[1] == station.id) {
            destination = L.latLng(station.latitude, station.longitude);
        }
    }
    if (origin != null && destination != null)
        this.lineBetweenStations = L.polyline([origin, destination], {
            color: 'red'
        }).addTo(this.map);
};

GraphicManager.prototype.hideLineBetweenStations = function () {
    if (this.lineBetweenStations != null) {
        this.map.removeLayer(this.lineBetweenStations);
        this.lineBetweenStations = null;
    }
};