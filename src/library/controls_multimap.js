GraphicManager.prototype.drawSubcontrols = function () {

    var id = this.id;

    // Create two svg with graphic manager
    var svgLayerControl = this.addSvg(0, 0.120 + 0.005, 0.07, 0.12); // y taken from previous svg's height
    var svgSelectionControl = this.addSvg(0, 0.120 + 0.12 + 0.01, 0.07, 0.14); // y taken from previous svg's height
    var svgEnableCalendarControl = this.addSvg(0, 0.12 * 2 + 0.01 + 0.145, 0.07, 0.06);
    //var svthisultimap = this.addSvg(0, 0.705, 0.07, 0.17);
    /* Charts controls */
    //var svgStaticChartsControl = this.addSvg(0.585, 1 - 0.12, 0.07, 0.12); //+ 0.4 / 5
    //var svgHideChartsControl = this.addSvg(0.585 + 0.07 + 0.002, 1 - 0.12, 0.07, 0.12);

    this.updateWindow();

    // Allocate javascript objects that will manage this SVGS
    var layerControl = new LayerControl(svgLayerControl, id);
    var selectionControl = new SelectionControl(svgSelectionControl);
    var enableCalendarControl = new EnableCalendarControl(svgEnableCalendarControl, id);
    var zoomControl = new ZoomControl(id);
    var stationControl = new StationControl(id);
    var dayControl = new DayControl(id);
    //var staticChartsControl = new StaticChartsControl(svgStaticChartsControl);
    //var hideChartsControl = new HideChartsControl(svgHideChartsControl);

    selectionControl.setCallbackSelectAll(this.selectAll.bind(this));
    selectionControl.setCallbackDeselectAll(this.deselectAll.bind(this));
    selectionControl.setCallbackShowCA(this.addCommunityMap.bind(this));
    selectionControl.setCallbackHideCA(this.removeCommunityMap.bind(this));

    zoomControl.setCallbackZoomIn(this.zoomIn.bind(this));
    zoomControl.setCallbackZoomOut(this.zoomOut.bind(this));

    // Draw the SVGs
    layerControl.draw();
    selectionControl.draw();
    enableCalendarControl.draw();
    //staticChartsControl.draw();
    //hideChartsControl.draw();

    // Set interactions
    layerControl.setCallback("text_layer_1" + id, this.changeLayer.bind(this, "normal"));
    layerControl.setCallback("text_layer_2" + id, this.changeLayer.bind(this, "grey"));

};

GraphicManager.prototype.addExternalSVGs1 = function (callback) {
    var self = this;
    d3.xml("./icon/calendar.svg", "image/svg+xml", function (xmlCalendar) {
        d3.xml("./icon/zoom.svg", "image/svg+xml", function (xmlZoom) {
            d3.xml("./icon/stationControl.svg", "image/svg+xml", function (xmlStation) {
                d3.xml("./icon/day.svg", "image/svg+xml", function (xmlDay) {
                    d3.xml("./icon/title.svg", "image/svg+xml", function (xmlTitle) {
                        d3.xml("./icon/multiMap.svg", "image/svg+xml", function (xmlMultimap) {

                            document.getElementById(self.mapId).appendChild(xmlCalendar.documentElement);

                            self.tagCalendar(self.id);
                            var svg = d3.select("#calendar" + self.id);

                            svg.attr("_height", 0.24)
                                .attr("_width", 0.07)
                                .attr("_x", 0)
                                .attr("_y", 0.31 + 0.005 + 0.145)
                                .style("position", "absolute")
                                .style("background-color", "rgba(10, 10, 10, 0.8)");

                            self.svgs.push(svg);

                            var calendarControl = new CalendarControl(self.id);

                            self.calendarControl = calendarControl;
                            calendarControl.setCallbackSetDate(self.callbackSetDate.bind(self));

                            calendarControl.draw();

                            ////////////////////////////////////

                            document.getElementById(self.mapId).appendChild(xmlZoom.documentElement);

                            self.tagZoom(self.id);
                            svg = d3.select("#zoom" + self.id);

                            svg.attr("_height", 0.12)
                                .attr("_width", 0.07)
                                .attr("_x", 0)
                                .attr("_y", 1 - 0.12)
                                .style("position", "absolute")
                                .style("background-color", "rgba(10, 10, 10, 0.8)");

                            self.svgs.push(svg);

                            var zoomControl = new ZoomControl(self.id);
                            zoomControl.setCallbackZoomIn(self.zoomIn.bind(self));
                            zoomControl.setCallbackZoomOut(self.zoomOut.bind(self));
                            zoomControl.draw();

                            ////////////////////////////////////

                            document.getElementById(self.mapId).appendChild(xmlStation.documentElement);

                            self.tagStationControl(self.id);
                            svg = d3.select("#stationControl" + self.id);

                            svg.attr("_height", 0.45)
                                .attr("_width", 0.1)
                                .attr("_x", 0.072)
                                .attr("_y", 0.250)
                                .style("position", "absolute")
                                .style("background-color", "rgba(10, 10, 10, 0.8)");

                            self.svgs.push(svg);

                            var stationControl = new StationControl(self.id);
                            self.stationControl = stationControl;
                            stationControl.setCallbackCompareAll(self.selectCompareAll.bind(self));
                            stationControl.setCallbackCompareTwo(self.selectCompareTwo.bind(self));
                            stationControl.setCallbackOutflow(self.selectOutflow.bind(self));
                            stationControl.setCallbackInflow(self.selectInflow.bind(self));

                            stationControl.draw();

                            ////////////////////////////////////

                            document.getElementById(self.mapId).appendChild(xmlDay.documentElement);

                            self.tagDayControl(self.id);
                            svg = d3.select("#dayControl" + self.id);

                            svg.attr("_height", 0.24 + 0.005)
                                .attr("_width", 0.1)
                                .attr("_x", 0.072)
                                .attr("_y", 0)
                                .style("position", "absolute")
                                .style("background-color", "rgba(10, 10, 10, 0.8)");

                            self.svgs.push(svg);

                            var dayControl = new DayControl(id);
                            self.dayControl = dayControl;
                            dayControl.setCallbackDayClose(self.callbackDayClose.bind(self));

                            dayControl.draw();
                            self.dayControl.enabled = false;

                            var svgSlider = self.addSvg.call(self, 0.072, 0.24 + 0.005 - 0.06, 0.1, 0.06);
                            callback();
                            self.slider = new Slider(svgSlider, self.id);
                            self.slider.draw();
                            self.slider.setCallbackSetHour(self.callbackSetHour.bind(self));

                            ////////////////////////////////////

                            document.getElementById(self.mapId).appendChild(xmlTitle.documentElement);

                            self.tagTitle(self.id);
                            svg = d3.select("#title" + self.id);

                            svg.attr("_height", 0.12)
                                .attr("_width", 0.07)
                                .attr("_x", 0)
                                .attr("_y", 0)
                                .style("position", "absolute")
                                .style("background-color", "rgba(0, 151, 201, 0.7");

                            self.svgs.push(svg);

                            ////////////////////////////////////

                            document.getElementById(self.mapId).appendChild(xmlMultimap.documentElement);

                            self.tagMultimap(self.id);
                            svg = d3.select("#multimap" + self.id);

                            svg.attr("_height", 0.17)
                                .attr("_width", 0.07)
                                .attr("_x", 0)
                                .attr("_y", 0.705)
                                .style("position", "absolute")
                                .style("background-color", "rgba(10, 10, 10, 0.8)");

                            self.svgs.push(svg);

                            d3.select('#multimap' + self.id).on("click", function () {
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

/////////////////////////////////////////////////////////////////////////////