function GraphicManager(htmlId) {
    /*this.lat = 41.8749077;
    this.lon = -87.6368363;*/
    this.lat = 41.8741372;
    this.lon = -87.5845267;

    this.scale = 10;

    this.mapId = htmlId;

    this.map = null;
    this.mapLayer = null;
    this.markerType = "popularity";

    // Graphs
    this.dayWeekBarGraph = null;
    this.bikesHourDay = null;
    this.bikesHourDayComparison = null;
    this.bikesDayYear = null;
    this.bikesDayYearComparison = null;
    this.tripsGender = null;
    this.tripsAge = null;
    this.tripsCustomerType = null;

    this.legend = null;

    this.timeDistribution = null;
    this.dinstanceDistribution = null;
    this.tripsDistanceDistribution = null;

    this.imbalance = null;

    this.momentDay = null;

    this.svgs = [];
    this.divs = [];
    this.graphicManagers = [];
    this.stations = null;
    this.markers = [];
    this.bikesCoordinate = [];
    this.bikes = [];
    this.linesBetweenStations = [];

    this.communityAreaMapURL = "./data/chicago_community_district_map.json";

    this.communityAreaLayer = null;
    this.lineBetweenStations = null;

    this.dm = new DataManager("http://data.divvybikeschicago.com/trip.php",
        "http://data.divvybikeschicago.com/station.php",
        "http://data.divvybikeschicago.com/weather.php",
        "http://data.divvybikeschicago.com/time.php",
        "http://data.divvybikeschicago.com/distance.php",
        "http://data.divvybikeschicago.com/station_age.php",
        "http://data.divvybikeschicago.com/flow.php",
        "http://data.divvybikeschicago.com/ride.php");

    this.selected = null;
    this.lastSelected = null;
    this.lastInflow = null;
    this.lastOutflow = null;
    this.showStation = false;
    this.stationControl = null;
    this.calendarControl = null;
    this.weather = null;
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

    // Refresh markers wehn zoom end
    this.map.on('zoomend', function (e) {
        this.refreshMarkers();
    }.bind(this));
};

GraphicManager.prototype.addLayer = function (type) {
    switch (type) {
    case "normal":
        this.mapLayer = L.tileLayer('http://a{s}.acetate.geoiq.com/tiles/terrain/{z}/{x}/{y}.png', {
            attribution: '',
            minZoom: 10,
            maxZoom: 16,
            zoom: 15
        }).addTo(this.map);
        break;

    case "satellitar":
        this.mapLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '',
            minZoom: 10,
            maxZoom: 16,
            zoom: 15
        }).addTo(this.map);
        break;

    case "grey":
        this.mapLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            attribution: '',
            minZoom: 10,
            maxZoom: 16,
            zoom: 15
        }).addTo(this.map);
        break;

    default:
        this.mapLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: '',
            minZoom: 10,
            maxZoom: 16,
            zoom: 15
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

    this.map.setZoom(11);
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
        .style("background-color", "rgba(10, 10, 10, 0.8)");

    this.svgs.push(svg);

    return svg;
};

GraphicManager.prototype.addDiv = function (x, y, width, height) {

    var div = d3.select("#" + this.mapId).append("div");

    div.attr("class", "default")
        .attr("_height", height)
        .attr("_width", width)
        .attr("_x", x)
        .attr("_y", y)
        .style("position", "absolute")
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .style("background-color", "rgba(10, 10, 10, 0.8)");

    this.divs.push(div);

    return div;
};

GraphicManager.prototype.addSvgChart = function (x, y, width, height) {

    var svg = d3.select("#" + this.mapId).append("svg");

    var gm = this;

    svg.attr("class", "default unselectable")
        .attr("class", "chart")
        .attr("_height", height)
        .attr("_width", width)
        .attr("_x", x)
        .attr("_y", y)
        .style("position", "absolute")
        .attr("viewBox", "0 0 100 100")
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .on("mousedown", function () {
            console.log("mousedown " + d3.mouse(this));
            this.mouse = d3.mouse(this);
            d3.event.stopPropagation();
        })
        .on("mouseup", function () {
            console.log("mouseup " + d3.mouse(this));
            this.mouse = undefined;
            d3.event.stopPropagation();
        })
        .on("mouseenter", function () {
            this.mouse = undefined;
            d3.event.stopPropagation();
        })
        .on("mousemove", function () {
            var mouse = this.mouse;
            if (this.mouse != undefined) {
                mouseNow = d3.mouse(this);
                var pdx = mouseNow[0] - this.mouse[0];
                var dx = pdx / gm.mapWidth;
                var pdy = mouseNow[1] - this.mouse[1];
                var dy = pdy / gm.mapHeight;
                console.log(pdx, pdy);




                //svg.attr("_x", +parseFloat(svg.attr("_x"))+dx);
                //svg.attr("_y", +parseFloat(svg.attr("_y"))+dy);
                svg.style("margin-left", parseFloat(svg.style("margin-left")) + pdx + "px");
                svg.style("margin-top", parseFloat(svg.style("margin-top")) + pdy + "px");
                //this.mouse = undefined;
                //gm.positionSVGs();

                d3.event.stopPropagation();

                mouseNow = d3.mouse(this);
                this.mouse = mouseNow;
            }
        });

    this.svgs.push(svg);

    return svg;
};

GraphicManager.prototype.addExternalSVGs = function (callback) {
    var self = this;
    d3.xml("./icon/calendar.svg", "image/svg+xml", function (xmlCalendar) {
        d3.xml("./icon/zoom.svg", "image/svg+xml", function (xmlZoom) {
            d3.xml("./icon/stationControl.svg", "image/svg+xml", function (xmlStation) {
                d3.xml("./icon/day.svg", "image/svg+xml", function (xmlDay) {
                    d3.xml("./icon/title.svg", "image/svg+xml", function (xmlTitle) {
                        d3.xml("./icon/multiMap.svg", "image/svg+xml", function (xmlMultimap) {

                            document.getElementById(self.mapId).appendChild(xmlCalendar.documentElement);
                            var svg = d3.select("#calendar");

                            svg.attr("_height", 0.24)
                                .attr("_width", 0.07)
                                .attr("_x", 0)
                                .attr("_y", 0.31 + 0.005 + 0.145)
                                .style("position", "absolute")
                                .style("background-color", "rgba(10, 10, 10, 0.8)");

                            self.svgs.push(svg);

                            var calendarControl = new CalendarControl();

                            self.calendarControl = calendarControl;
                            calendarControl.setCallbackSetDate(self.callbackSetDate.bind(self));

                            calendarControl.draw();

                            ////////////////////////////////////

                            document.getElementById(self.mapId).appendChild(xmlZoom.documentElement);
                            svg = d3.select("#zoom");

                            svg.attr("_height", 0.12)
                                .attr("_width", 0.07)
                                .attr("_x", 0)
                                .attr("_y", 1 - 0.12)
                                .style("position", "absolute")
                                .style("background-color", "rgba(10, 10, 10, 0.8)");

                            self.svgs.push(svg);

                            zoomControl.draw();

                            ////////////////////////////////////

                            document.getElementById(self.mapId).appendChild(xmlStation.documentElement);
                            svg = d3.select("#stationControl");

                            svg.attr("_height", 0.45)
                                .attr("_width", 0.1)
                                .attr("_x", 0.072)
                                .attr("_y", 0.250)
                                .style("position", "absolute")
                                .style("background-color", "rgba(10, 10, 10, 0.8)");

                            self.svgs.push(svg);

                            self.stationControl = stationControl;
                            stationControl.setCallbackCompareAll(self.selectCompareAll.bind(self));
                            stationControl.setCallbackCompareTwo(self.selectCompareTwo.bind(self));
                            stationControl.setCallbackOutflow(self.selectOutflow.bind(self));
                            stationControl.setCallbackInflow(self.selectInflow.bind(self));

                            stationControl.draw();

                            ////////////////////////////////////

                            document.getElementById(self.mapId).appendChild(xmlDay.documentElement);
                            svg = d3.select("#dayControl");

                            svg.attr("_height", 0.24 + 0.005)
                                .attr("_width", 0.1)
                                .attr("_x", 0.072)
                                .attr("_y", 0)
                                .style("position", "absolute")
                                .style("background-color", "rgba(10, 10, 10, 0.8)");

                            self.svgs.push(svg);

                            self.dayControl = dayControl;
                            dayControl.setCallbackDayClose(self.callbackDayClose.bind(self));

                            dayControl.draw();
                            self.dayControl.enabled = false;

                            var svgSlider = self.addSvg.call(self, 0.072, 0.24 + 0.005 - 0.06, 0.1, 0.06);
                            callback();
                            self.slider = new Slider(svgSlider);
                            self.slider.draw();
                            self.slider.setCallbackSetHour(self.callbackSetHour.bind(self));

                            ////////////////////////////////////

                            document.getElementById(self.mapId).appendChild(xmlTitle.documentElement);
                            var svg = d3.select("#title");

                            svg.attr("_height", 0.12)
                                .attr("_width", 0.07)
                                .attr("_x", 0)
                                .attr("_y", 0)
                                .style("position", "absolute")
                                .style("background-color", "rgba(0, 151, 201, 0.7");

                            self.svgs.push(svg);

                            ////////////////////////////////////

                            document.getElementById(self.mapId).appendChild(xmlMultimap.documentElement);
                            var svg = d3.select("#multimap");

                            svg.attr("_height", 0.17)
                                .attr("_width", 0.07)
                                .attr("_x", 0)
                                .attr("_y", 0.705)
                                .style("position", "absolute")
                                .style("background-color", "rgba(10, 10, 10, 0.8)");

                            self.svgs.push(svg);

                            d3.select('#multimap').on("click", function () {
                                self.showMaps();
                                d3.event.stopPropagation();
                            }.bind(self))
                                .style('-webkit-user-select', 'none');

                            //var multimapControl = new MultimapControl();

                            //multimapControl.setCallbackSetDate(self.callbackSetDate.bind(self));

                            //multimapControl.draw();

                            callback();
                        });
                    });
                });
            });
        });
    });


};

GraphicManager.prototype.addExternalSVGsCharts = function (callback) {
    var self = this;
    d3.xml("./icon/filter_gender.svg", "image/svg+xml", function (xmlGender) {
        d3.xml("./icon/filter_age.svg", "image/svg+xml", function (xmlAge) {
            d3.xml("./icon/filter_user.svg", "image/svg+xml", function (xmlUser) {

                document.getElementById(self.mapId).appendChild(xmlGender.documentElement);
                var svg = d3.select("#filter_gender");

                svg.attr("_height", 0.12)
                    .attr("_width", 0.07)
                    .attr("_x", 0.585 + 0.07 * 2 + 0.002 * 2)
                    .attr("_y", 1 - 0.12)
                    .style("position", "absolute")
                    .style("background-color", "rgba(10, 10, 10, 0.8)");

                self.svgs.push(svg);
                var filterGenderControl = new FilterGenderControl();
                self.filterGenderControl = filterGenderControl;
                filterGenderControl.draw();

                filterGenderControl.setCallbackSetMale(self.callbackSetMale.bind(self));
                filterGenderControl.setCallbackSetFemale(self.callbackSetFemale.bind(self));

                ////////////////////////////////////

                document.getElementById(self.mapId).appendChild(xmlAge.documentElement);
                var svg = d3.select("#filter_age");

                svg.attr("_height", 0.12)
                    .attr("_width", 0.1)
                    .attr("_x", 0.585 + 0.07 * 3 + 0.002 * 3)
                    .attr("_y", 1 - 0.12)
                    .style("position", "absolute")
                    .style("background-color", "rgba(10, 10, 10, 0.8)")
                    .attr("viewBox", "0 0 100 57");

                self.svgs.push(svg);

                var svgSliderDouble = self.addSvg.call(self, 0.585 + 0.07 * 3 + 0.002 * 3, 1 - 0.065, 0.1, 0.06);
                callback();
                self.sliderDouble = new SliderDouble(svgSliderDouble);
                self.sliderDouble.draw();
                self.sliderDouble.setCallbackSetAge(self.callbackSetAge.bind(self));

                ////////////////////////////////////

                document.getElementById(self.mapId).appendChild(xmlUser.documentElement);
                var svg = d3.select("#filter_user");

                svg.attr("_height", 0.12)
                    .attr("_width", 0.07)
                    .attr("_x", 0.585 + 0.07 * 4 + 0.002 * 4 + 0.03)
                    .attr("_y", 1 - 0.12)
                    .style("position", "absolute")
                    .style("background-color", "rgba(10, 10, 10, 0.8)");

                self.svgs.push(svg);
                var filterUserControl = new FilterUserControl();
                self.filterUserControl = filterUserControl;
                filterUserControl.draw();

                filterUserControl.setCallbackSetCustomer(self.callbackSetCustomer.bind(self));
                filterUserControl.setCallbackSetSubscriber(self.callbackSetSubscriber.bind(self));

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

    return gm;
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

    var zoom = this.map.getZoom();
    var scale;
    if (zoom < 13) {
        scale = 50;
    } else if (zoom >= 11 && zoom < 13) {
        scale = 34;
    } else if (zoom >= 13 && zoom < 15) {
        scale = 24;
    } else if (zoom >= 15) {
        scale = 18;
    }

    this.iconWidth = this.mapHeight / scale;
    this.iconHeight = this.mapHeight / scale / (268 / 383);
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
    //$(window).trigger('resize');
};

////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
GraphicManager.prototype.drawMarkers = function (type) {
    this.markerType = type;
    this.dm.getStations(this.drawMarkersCallback.bind(this));
};

GraphicManager.prototype.drawMarkersCallback = function (stations) {
    var self = this;
    this.stations = stations;

    var zoom = this.map.getZoom();
    var scale;
    if (zoom < 13) {
        scale = 50;
    } else if (zoom >= 11 && zoom < 13) {
        scale = 34;
    } else if (zoom >= 13 && zoom < 15) {
        scale = 24;
    } else if (zoom >= 15) {
        scale = 18;
    }

    this.iconWidth = this.mapHeight / scale;
    this.iconHeight = this.mapHeight / scale / (268 / 383);
    switch (this.markerType) {
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
                    iconUrl: './icon/stations_popularity/station_' + (level) + '.png',
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
            marker.selected = false;

            //Add callback
            marker.on("click", function (e) {
                self.highlightStationByMarker(e.target);
                //}.bind(this));
            });

        }
        break;
    }

};

/**
 *   Highlight in yellow the current selected station
 */
GraphicManager.prototype.highlightStationByMarker = function (marker) {

    // Disable active flows when highlighting new station
    this.markerType = "popularity";
    d3.select("#station_inflow_rect").style("stroke", "none");
    d3.select("#station_outflow_rect").style("stroke", "none");
    this.drawSelectedMarkers();

    try {
        if (this.lastSelected.id !== marker.id) {
            // Invert previous marker's selection
            if (this.lastSelected.selected) {
                this.lastSelected.selected = !this.lastSelected.selected;
            }
        }
    } catch (err) {
        // do nothing
    }

    // Change status of the current marker
    marker.selected = !marker.selected;

    // Update last selected marker
    this.lastSelected = marker;

    // Pass info to the controller of the button
    this.stationControl.selectedStation = marker.station;

    this.drawSelectedMarkers();

    // Redraw current station's info
    this.selectedStation(marker.station);

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

    switch (this.markerType) {

    case "popularity":

        for (var s in stations) {
            if (ids.indexOf(stations[s].id) !== -1) {
                if (this.dm.selectionMode === "MULTIPLE")
                    stations[s].marker.options.icon.options.iconUrl = './icon/stations_popularity/station_' + stations[s].popularityLevel + '_compareAll.png';
                else
                    stations[s].marker.options.icon.options.iconUrl = './icon/stations_popularity/station_' + stations[s].popularityLevel + '_compare2.png';
                stations[s].marker.setIcon(stations[s].marker.options.icon);
            } else {
                stations[s].marker.options.icon.options.iconUrl = './icon/stations_popularity/station_' + stations[s].popularityLevel + '.png';
                stations[s].marker.setIcon(stations[s].marker.options.icon);
            }
        }
        break;

    case "inflow":

        for (var s in stations) {
            if (ids.indexOf(stations[s].id) !== -1) {
                if (this.dm.selectionMode === "MULTIPLE")
                    stations[s].marker.options.icon.options.iconUrl = './icon/stations_inflow/station_' + stations[s].inflowLevel + '_compareAll.png';
                else
                    stations[s].marker.options.icon.options.iconUrl = './icon/stations_inflow/station_' + stations[s].inflowLevel + '_compare2.png';
                stations[s].marker.setIcon(stations[s].marker.options.icon);
            } else {
                stations[s].marker.options.icon.options.iconUrl = './icon/stations_inflow/station_' + stations[s].inflowLevel + '.png';
                stations[s].marker.setIcon(stations[s].marker.options.icon);
            }
        }
        break;

    case "outflow":

        for (var s in stations) {
            if (ids.indexOf(stations[s].id) !== -1) {
                if (this.dm.selectionMode === "MULTIPLE")
                    stations[s].marker.options.icon.options.iconUrl = './icon/stations_outflow/station_' + stations[s].outflowLevel + '_compareAll.png';
                else
                    stations[s].marker.options.icon.options.iconUrl = './icon/stations_outflow/station_' + stations[s].outflowLevel + '_compare2.png';
                stations[s].marker.setIcon(stations[s].marker.options.icon);
            } else {
                stations[s].marker.options.icon.options.iconUrl = './icon/stations_outflow/station_' + stations[s].outflowLevel + '.png';
                stations[s].marker.setIcon(stations[s].marker.options.icon);
            }
        }
        break;

    }

};

GraphicManager.prototype.selectedStation = function (station) {

    this.selected = station;
    var selectedUrl = null;
    var deselectedUrl = null;
    switch (this.markerType) {
    case "popularity":
        selectedUrl = './icon/stations_popularity/station_' + station.popularityLevel + '_selected.png';
        deselectedUrl = './icon/stations_popularity/station_' + station.popularityLevel + '.png';
        break;
    case "inflow":
        selectedUrl = './icon/stations_inflow/station_' + station.inflowLevel + '_selected.png';
        deselectedUrl = './icon/stations_inflow/station_' + station.inflowLevel + '.png';
        break;
    case "outflow":
        selectedUrl = './icon/stations_outflow/station_' + station.outflowLevel + '_selected.png';
        deselectedUrl = './icon/stations_outflow/station_' + station.outflowLevel + '.png';
        break;
    }

    var marker = station.marker;
    if (marker.selected) {
        d3.select('#stationControl').style('opacity', '1')
            .style("pointer-events", "all");
        marker.options.icon.options.iconUrl = selectedUrl;
        marker.setIcon(marker.options.icon);
    } else {
        d3.select('#stationControl').style('opacity', '0')
            .style("pointer-events", "none");
        this.drawSelectedMarkers();
    }

    // Show station info
    this.updateStationControl(station);

};

GraphicManager.prototype.selectCompareAll = function (station) {

    // Highlight click
    d3.select("#station_compareAll_rect").style("stroke", "red").transition().delay(400).style("stroke", "none");

    // Set mode
    if (this.dm.selectionMode === null) {
        this.dm.selectionMode = "MULTIPLE";
    }
    // Switch of mode
    if (this.dm.selectionMode === "DOUBLE") {
        this.dm.selectedStations = [];
        this.dm.selectionMode = "MULTIPLE";
    }

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

    // TEST
    this.hideLineBetweenStations();
    this.showLineBetweenStations();

    this.drawSelectedMarkers();
    this.updateGraphs();
};

GraphicManager.prototype.selectCompareTwo = function (station) {

    // Highlight click
    d3.select("#station_compare2_rect").style("stroke", "lightgreen").transition().delay(400).style("stroke", "none");

    // Set mode
    if (this.dm.selectionMode === null) {
        this.dm.selectionMode = "DOUBLE";
    }
    // Switch of mode
    if (this.dm.selectionMode === "MULTIPLE") {
        this.dm.selectedStations = [];
        this.dm.selectionMode = "DOUBLE";
    } else {
        if (this.dm.selectedStations.length === 2 && this.dm.selectedStations[0].id !== station.id && this.dm.selectedStations[1].id !== station.id) {
            // Remove the oldest one
            this.dm.selectedStations.splice(0, 1);
        }
    }
    console.log(this.dm.selectionMode);

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
        station.marker.options.icon.options.iconUrl = './icon/stations_popularity/station_' + station.popularityLevel + '_compare2.png';
        station.marker.setIcon(station.marker.options.icon);
    } else {
        station.marker.options.icon.options.iconUrl = './icon/stations_popularity/station_' + station.popularityLevel + '.png';
        station.marker.setIcon(station.marker.options.icon);
    }

    this.drawSelectedMarkers();
    this.updateGraphs();
};

GraphicManager.prototype.updateStationControl = function (station) {
    d3.select('#station_name').text(station.name);
    d3.select('#station_id').text(station.id);
    d3.select('#station_pop').text(d3.format('%')(station.popularity));

};

/////////////////////// CONTROLS CALLBACKS ///////////////////////////////////////////

GraphicManager.prototype.selectAll = function () {
    // Automatically switch to compareAll mode
    this.dm.selectionMode = "MULTIPLE";
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

    // Show weather
    this.dm.getWeather(this.weatherCallback.bind(this));

    // Show sunrise and sunset
    var jdate = new Date(2013, month - 1, day, 12);
    var times = SunCalc.getTimes(jdate, 41.8369, -87.6847);

    var h = times.sunrise.getHours();
    var m = times.sunrise.getMinutes();
    var sunrise = this.toAmericanHour(h, m);
    h = times.sunset.getHours();
    m = times.sunset.getMinutes();
    var sunset = this.toAmericanHour(h, m);

    d3.select("#day_sunrise").text(sunrise);
    d3.select("#day_sunset").text(sunset);

    this.updateGraphs();
};

GraphicManager.prototype.toAmericanHour = function (h, m) {
    var suffix = (h >= 12 && h <= 24) ? "PM" : "AM";
    var hh = (h >= 13 && h <= 24) ? h - 12 : h;
    if (+hh === 0) hh = 12;
    hh = hh < 10 ? "0" + hh : hh;
    m = m < 10 ? "0" + m : m;
    var hour = hh + ":" + m + " " + suffix;
    return hour;
};

GraphicManager.prototype.weatherCallback = function (weather) {

    this.weather = weather;

    // Find the most frequent weather condition in this day
    var nested_data = d3.nest()
        .key(function (d) {
            return d.conditions;
        })
        .rollup(function (leaves) {
            return leaves.length;
        })
        .entries(weather);

    var vals = [];
    for (var i = 0; i < nested_data.length; i++) {
        vals.push(nested_data[i].values);
    }
    var max = Math.max.apply(null, vals);
    var weather_day = nested_data[vals.indexOf(max)].key;

    d3.select('#day_image').attr('xlink:href', this.getWeatherIcon(weather_day));
    d3.select('#day_weather').text(weather_day);

};

GraphicManager.prototype.getWeatherIcon = function (weather) {
    var icon = null;
    switch (weather) {
    case "Clear":
        icon = "./icon/weather/clear.png";
        break;
    case "Drizzle":
        icon = "./icon/weather/drizzle.png";
        break;
    case "Fog":
        icon = "./icon/weather/fog.png";
        break;
    case "Haze":
        icon = "./icon/weather/fog.png";
        break;
    case "Heavy Drizzle":
        icon = "./icon/weather/drizzle.png";
        break;
    case "Heavy Rain":
        icon = "./icon/weather/heavy_rain.png";
        break;
    case "Heavy Thunderstorms and Rain":
        icon = "./icon/weather/heavy_thunderstorm.png";
        break;
    case "Light Drizzle":
        icon = "./icon/weather/drizzle.png";
        break;
    case "Light Freezing Drizzle":
        icon = "./icon/weather/drizzle.png";
        break;
    case "Light Rain":
        icon = "./icon/weather/rain.png";
        break;
    case "Light Snow":
        icon = "./icon/weather/light_snow.png";
        break;
    case "Light Thunderstorms and Rain":
        icon = "./icon/weather/thunderstorm.png";
        break;
    case "Mist":
        icon = "./icon/weather/fog.png";
        break;
    case "Mostly Cloudy":
        icon = "./icon/weather/mostly_cloudy.png";
        break;
    case "Overcast":
        icon = "./icon/weather/overcast.png";
        break;
    case "Partly Cloudy":
        icon = "./icon/weather/partly_cloudy.png";
        break;
    case "Rain":
        icon = "./icon/weather/rain.png";
        break;
    case "Scattered Clouds":
        icon = "./icon/weather/partly_cloudy.png";
        break;
    case "Smoke":
        icon = "./icon/weather/fog.png";
        break;
    case "Snow ":
        icon = "./icon/weather/snow.png";
        break;
    case "Thunderstorm":
        icon = "./icon/weather/thunderstorm.png";
        break;
    case "Thunderstorms and Rain":
        icon = "./icon/weather/thunderstorm.png";
        break;
    default:
        ;
        break;
    }
    return icon;
}

GraphicManager.prototype.getWeatherByHour = function () {

    // Data from the weather service
    var weather = this.weather;
    for (var i in weather) {
        var hour = weather[i].date.split(" ")[1];
        var h = hour.split(":")[0];
        var m = hour.split(":")[1];
        weather[i].hour = +(h + m);
    }

    // Data selected by the user
    var hour_ = this.dm.hour;
    var h_ = hour_.split(":")[0];
    var m_ = hour_.split(":")[1];
    var hour_user = +(h_ + m_);

    var weather_user = null;
    var temperature_user = null;
    var temp = 0;
    for (var i in weather) {
        if (weather[i].hour <= hour_user && weather[i].hour > temp) {
            temp = weather[i].hour;
            weather_user = weather[i].conditions;
            temperature_user = weather[i].temperature;
        }
    }

    d3.select('#day_image').attr("xlink:href", this.getWeatherIcon(weather_user));
    d3.select('#day_weather').text(weather_user);
    if (temperature_user === null)
        d3.select('#day_temperature').text("");
    else
        d3.select('#day_temperature').text(temperature_user + "°");

};

GraphicManager.prototype.callbackDayClose = function () {

    d3.selectAll(".day_box")
        .style("opacity", "0")
        .style("pointer-events", "none");

    this.dayControl.enabled = false;
    this.slider.reset();
    this.dm.date = null;
    this.dm.hour = null;

    this.removeBikes();
    this.updateGraphs();
};

GraphicManager.prototype.callbackSetHour = function () {

    // Set hour
    this.dm.hour = this.slider.hour;
    this.drawBikesInMoment();

    //this.dm.getWeather(this.weatherCallback.bind(this));
    this.getWeatherByHour();

};

GraphicManager.prototype.callbackSetAge = function () {

    // Set age
    this.dm.age = this.sliderDouble.age;
    this.updateGraphs();

};

GraphicManager.prototype.selectInflow = function (station) {
    // Invert the behavior
    if (this.markerType === "inflow" && this.lastInflow === station.id) {
        // Disable flow view and legend
        d3.select("#station_inflow_rect").style("stroke", "none");
        this.hideLegend();
        this.lastInflow = station.id;
        this.markerType = "popularity";
        this.drawSelectedMarkers();
        this.selectedStation(this.selected);
        return;
    }
    this.lastInflow = station.id;
    d3.select("#station_inflow_rect").style("stroke", "red");
    d3.select("#station_outflow_rect").style("stroke", "none");
    this.dm.getFlow(this.selectInflowCallback.bind(this), station.id, "IN");
};

GraphicManager.prototype.selectOutflow = function (station) {
    // Invert the behavior
    if (this.markerType === "outflow" && this.lastOutflow === station.id) {
        d3.select("#station_outflow_rect").style("stroke", "none");
        this.hideLegend();
        this.lastOutflow = station.id;
        this.markerType = "popularity";
        this.drawSelectedMarkers();
        this.selectedStation(this.selected);
        return;
    }
    this.lastOutflow = station.id;
    d3.select("#station_outflow_rect").style("stroke", "lightgreen");
    d3.select("#station_inflow_rect").style("stroke", "none");
    this.dm.getFlow(this.selectOutflowCallback.bind(this), station.id, "OUT");
};

GraphicManager.prototype.selectInflowCallback = function (flow) {

    // Set the marker type
    this.markerType = "inflow";

    var nums = [];
    for (var i in flow) {
        nums.push(+flow[i].count);
    }
    var max = Math.max.apply(null, nums);

    // Normalize the flow value
    for (var i in flow) {
        flow[i].flow = +flow[i].count / max;
    }

    // Store the info into the stations
    for (var s in this.stations) {
        this.stations[s].inflowLevel = 0; // store default value
        for (var f in flow) {
            if (+flow[f].id === this.stations[s].id) {
                var level = Math.floor(+flow[f].flow * 6);
                if (level === 6) level = 5;
                this.stations[s].inflowLevel = level; // store value
            }
            //break;
        }
    }

    this.drawSelectedMarkers();
    this.selectedStation(this.selected);

    this.showLegend();
    this.legend.draw("stations_inflow", 0, max);

};

GraphicManager.prototype.selectOutflowCallback = function (flow) {

    // Set the marker type
    this.markerType = "outflow";

    var nums = [];
    for (var i in flow) {
        nums.push(+flow[i].count);
    }
    var max = Math.max.apply(null, nums);

    // Normalize the flow value
    for (var i in flow) {
        flow[i].flow = +flow[i].count / max;
    }

    // Store the info into the stations
    for (var s in this.stations) {
        this.stations[s].outflowLevel = 0; // store default value
        for (var f in flow) {
            if (+flow[f].id === this.stations[s].id) {
                var level = Math.floor(+flow[f].flow * 6);
                if (level === 6) level = 5;
                this.stations[s].outflowLevel = level; // store value
            }
            //break;
        }
    }

    this.drawSelectedMarkers();
    this.selectedStation(this.selected);

    this.showLegend();
    this.legend.draw("stations_outflow", 0, max);

};

GraphicManager.prototype.callbackSetMale = function () {
    var self = this.filterGenderControl;
    if (self.gender === "MALE") {
        self.gender = null;
        this.dm.gender = null;
        d3.select("#filter_male").style("stroke", "none");
    } else {
        self.gender = "MALE";
        this.dm.gender = "MALE";
        d3.select("#filter_male").style("stroke", "white");
        d3.select("#filter_female").style("stroke", "none");
    }
    this.updateGraphs();
}

GraphicManager.prototype.callbackSetFemale = function () {
    var self = this.filterGenderControl;
    if (self.gender === "FEMALE") {
        self.gender = null;
        this.dm.gender = null;
        d3.select("#filter_female").style("stroke", "none");
    } else {
        self.gender = "FEMALE";
        this.dm.gender = "FEMALE";
        d3.select("#filter_female").style("stroke", "white");
        d3.select("#filter_male").style("stroke", "none");
    }
    this.updateGraphs();
}

GraphicManager.prototype.callbackSetCustomer = function () {
    var self = this.filterUserControl;
    if (self.user === "CUSTOMER") {
        self.user = null;
        this.dm.customerType = null;
        d3.select("#filter_customer").style("stroke", "none");
    } else {
        self.user = "CUSTOMER";
        this.dm.customerType = "CUSTOMER";
        d3.select("#filter_customer").style("stroke", "white");
        d3.select("#filter_subscriber").style("stroke", "none");
    }
    this.updateGraphs();
}

GraphicManager.prototype.callbackSetSubscriber = function () {
    var self = this.filterUserControl;
    if (self.user === "SUBSCRIBER") {
        self.user = null;
        this.dm.customerType = null;
        d3.select("#filter_subscriber").style("stroke", "none");
    } else {
        self.user = "SUBSCRIBER";
        this.dm.customerType = "SUBSCRIBER";
        d3.select("#filter_subscriber").style("stroke", "white");
        d3.select("#filter_customer").style("stroke", "none");
    }
    this.updateGraphs();
}

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

                //layer.bindPopup(feature.id);
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
    //console.log(res);
    return res;
};

GraphicManager.prototype.selectAllStationsInArea = function (area) {
    // Automatically switch to compareAll mode
    this.dm.selectionMode = "MULTIPLE";
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

        //console.log(this.stations);
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
            color: '#3DB5E7',
            fillColor: '#3DB5E7',
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
            color: '#3DB5E7',
            fillColor: '#3DB5E7',
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

    //console.log(this.bikesCoordinate);

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

            this.dayWeekBarGraph.setTitle("Bikes out per day of the week");
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

            this.bikesHourDay.setTitle("Sum of bikes out per hour of day");
            this.bikesHourDay.setData(d, "hourOfDay");
            this.bikesHourDay.setAxes("hour", "Hour", "count", "Rides");
            this.bikesHourDay.setTimeDataInX("hour", 2, "12hr");
            //this.bikesHourDay.setColor(["#FFAABB","#AABBCC"]);
            this.bikesHourDay.draw();

            // Multiple line chart
            var d = (data.sort(function (a, b) {
                return (+a.hour) - (+b.hour);
            }));
            this.bikesHourDayComparison.setTitle("Bikes out per hour of day");
            this.bikesHourDayComparison.setData(d.sort(function (a, b) {
                return (+a.hour) - (+b.hour);
            }), "hourOfDayMany", "fromStation", "Station");
            this.bikesHourDayComparison.setAxes("hour", "Hour", "count", "Rides");
            this.bikesHourDayComparison.setTimeDataInX("hour", 2, "12hr");
            this.bikesHourDayComparison.draw();

            document.getElementById(this.mapId).style.webkitTransform = 'scale(1)';
            $(window).trigger('resize');
        }.bind(this));

    // Gender data
    if (this.tripsGender != null ||
        this.tripsCustomerType != null)
        this.dm.getStationsDemographic(function (data) {
            //console.log(data);
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
                this.tripsGender.setData([+d.male, +d.female, +d.unknown], ["Male", "Female", "Unknown"],
                    "demographic",
                    "Gender");
                this.tripsGender.setTitle("Demographic");
                //this.tripsGender.setColor(["#52B5CC", "#FFC3C0"]);
                this.tripsGender.draw();
            }

            if (this.tripsCustomerType != null) {
                this.tripsCustomerType.setData([+d.customer, +d.subscriber], ["Customer", "Subscriber"],
                    "demographic",
                    "Customer");
                this.tripsCustomerType.setTitle("Customer type");
                this.tripsCustomerType.draw();
            }
            $(window).trigger('resize');
        }.bind(this));

    if (this.tripsAge != null)
        this.dm.getStationsAge(function (data) {
            var a = {};
            a.a0_20 = 0;
            a.a21_30 = 0;
            a.a31_40 = 0;
            a.a41_50 = 0;
            a.a51_60 = 0;
            a.a61_70 = 0;
            a.a71p = 0;
            for (var i in data) {
                var station = data[i];
                for (var j in station.ages) {
                    var ag = station.ages[j];
                    var count = +ag.count;
                    var age = +ag.age;
                    if (age <= 20)
                        a.a0_20 += count;
                    if (age >= 21 && age <= 30)
                        a.a21_30 += count;
                    if (age >= 31 && age <= 40)
                        a.a31_40 += count;
                    if (age >= 41 && age <= 50)
                        a.a41_50 += count;
                    if (age >= 51 && age <= 60)
                        a.a51_60 += count;
                    if (age >= 61 && age <= 70)
                        a.a61_70 += count;
                    if (age >= 71)
                        a.a71p += count;
                }
            }
            this.tripsAge.setData([a.a0_20, a.a21_30, a.a31_40, a.a41_50, a.a51_60, a.a61_70, a.a71p], ["0-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71+"],
                "demographic",
                "Age");
            this.tripsAge.setTitle("Age");
            this.tripsAge.draw();
            $(window).trigger('resize');
        }.bind(this));

    /*
    if (this.bikesDayYearComparison != null)
        this.dm.getBikesDayYear(function (data) {
            // Multiple line chart
            var dd = data.sort(function (a, b) {
                return new Date(a.day) - new Date(b.day);
            });
            var dy = 1000 * 60 * 60 * 24; // in a day
            var days = dd.map(function (d) {
                var temp = d;
                temp["dayCount"] = (new Date(d.day) - new Date("2013-6-27")) / dy;
                return temp;
            });
            this.bikesDayYearComparison.setData(dd, "dayOfYearMany", "fromStation", "Station");
            this.bikesDayYearComparison.setAxes("day", "Day", "count", "Rides");
            this.bikesDayYearComparison.setTimeDataInX("month", 1, "MMM DD");
            this.bikesDayYearComparison.setTitle("Rides")
            this.bikesDayYearComparison.draw();
            $(window).trigger('resize');
        }.bind(this));
    */

    if (this.bikesDayYearComparison != null)
        this.dm.getBikesDayYear(function (data) {
            
            var lst = d3.nest().key(function(d){return d.day;}).entries(data);
            lst = lst.sort(function (a, b) {
                return new Date(a.key) - new Date(b.key);
            });
            var sumOfValues = lst.map(function(d){ 
                var count = 0;
                d.values.forEach(function(el, idx, arr){
                    count = count + el.count;
                });
                return {day:d.key, count: count};
            });
           
            this.bikesDayYearComparison.setData(sumOfValues, "dayOfYearCumulative");
            this.bikesDayYearComparison.setAxes("day", "Day", "count", "Rides");
            this.bikesDayYearComparison.setTimeDataInX("month", 1, "MMM DD");
            this.bikesDayYearComparison.setTitle("Rides")
            this.bikesDayYearComparison.draw();
            $(window).trigger('resize');
        }.bind(this));

    if (this.timeDistribution != null)
        this.dm.getTimeDistribution(function (data) {
            var time = data.sort(function (a, b) {
                return (+a.totaltime) - (+b.totaltime);
            });
            this.timeDistribution.setData(time, "time_distribution");
            this.timeDistribution.setAxes("totaltime", "Time", "# of bikes") //(propertyOnX, labelX, labelY) if labelX and labelY are omitted, the graph shows
            this.timeDistribution.setTitle("Distribution of bikes by total time"); // standard deviation and frequency along x and y axes respectively.
            this.timeDistribution.draw();
        }.bind(this));

    if (this.distanceDistribution != null)
        this.dm.getDistanceDistribution(function (data) {
            var dist = data.sort(function (a, b) {
                return (+a.totaldistance) - (+b.totaldistance);
            });
            this.distanceDistribution.setData(dist, "distance_distribution");
            this.distanceDistribution.setAxes("totaldistance", "Distance", "# of bikes");
            this.distanceDistribution.setTitle("Distribution of bikes by distance traveled(in meters)");
            this.distanceDistribution.draw();
            $(window).trigger('resize');
        }.bind(this));

    if (this.tripsDistanceDistribution != null) {
        /*
        this.dm.getRideDistribution(function (data) {
            var dist = data.sort(function (a, b) {
                return (+a.meters) - (+b.meters);
            });
            this.tripsDistanceDistribution.setData(dist,"trips_distance_distribution");
            this.tripsDistanceDistribution.setAxes("meters","Distance", "# of bikes");
            this.tripsDistanceDistribution.setTitle("Distribution of rides by distance (in meters)");
            this.tripsDistanceDistribution.draw();
            $(window).trigger('resize');
        }.bind(this));
        */

    }

    if (this.imbalance != null) {
        this.dm.getInOutFlow(function (inflow, outflow) {
            var imbalanceData = inflow.map(function (d, i) {
                var temp = {
                    id: d.id,
                    inflow: (+d.customer) + (+d.subscriber),
                    outflow: (+outflow[i].customer) + (+outflow[i].subscriber), //i works as a subscript only if the ordering is same in both files!!
                };
                if(temp.inflow > temp.outflow) {
                    temp.inflow -= temp.outflow;
                    temp.outflow = 0;
                }
                else {
                    temp.outflow -= temp.inflow;
                    temp.inflow = 0;
                }

                return temp;
            });
            this.imbalance.setData(imbalanceData, "imbalance");
            this.imbalance.setAxes("id", "Station", "inflow", "In Flow", "outflow", "Out Flow"); // (x,x-label, upper-y, u-y-label, lower-y, l-y-label)
            this.imbalance.draw();
            $(window).trigger('resize');
        });

    }

    if (this.momentDay != null) {
        this.dm.getBikesHourDay(function (data) {
            var lst = d3.nest().key(function(d){return d.hour;}).entries(data);
            lst = lst.sort(function (a, b) {
                return a.key - b.key;
            });
            var sumOfValues = lst.map(function(d){ 
                var count = 0;
                d.values.forEach(function(el, idx, arr){
                    count = count + el.count;
                });
                return {hour:d.key, count: count};
            });
            this.momentDay.setTitle("Rides");
            this.momentDay.setData(sumOfValues, "star"); //(data,className)
            this.momentDay.setProperty("hour", "count"); //(propertyTheta, propertyR)
            this.momentDay.draw();
            $(window).trigger('resize');
        });
    }

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

GraphicManager.prototype.selectedStationFromChart = function (stationId) {

    var marker = null;

    for (var m in this.markers) {
        if (this.markers[m].id === +stationId) {
            marker = this.markers[m];
            break;
        }
    }
    this.highlightStationByMarker(marker);
}

GraphicManager.prototype.showMaps = function () {

    this.gm1 = gm.addSubMap(0.0, 0.0, 0.5, 1.0, "map2", "satellitar");
    this.gm2 = gm.addSubMap(0.5, 0.0, 0.5, 1.0, "map3", "normal");

    this.gm1.dm = this.dm;
    this.gm2.dm = this.dm;

    this.gm1.drawMarkers("popularity");
    this.gm2.drawMarkers("popularity");

    this.gm1.updateWindow();
    this.gm2.updateWindow();

    //this.gm1.map.on("moveend", function(){$(window).trigger('resize');});
    //this.gm2.map.on("moveend", function(){$(window).trigger('resize');});
}

GraphicManager.prototype.hideMaps = function () {
    this.gm1.map.remove();
    this.gm2.map.remove();

    d3.select("#map2").remove();
    d3.select("#map3").remove();

    this.graphicManagers = [];
}

GraphicManager.prototype.addLegend = function (legend) {
    this.legend = new Legend(legend);
}

GraphicManager.prototype.showLegend = function () {
    if (this.legend != null)
        this.legend.show();
}

GraphicManager.prototype.hideLegend = function () {
    if (this.legend != null)
        this.legend.hide();
}