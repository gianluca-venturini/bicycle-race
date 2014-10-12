///////////////////////
/*
	This class contains all the controls to change the selections and the data displayed.
*/
///////////////////////

function LayerControl(svg) {
    this.svg = svg;
    this.width = +svg.attr("width").replace("px", "");
    this.height = +svg.attr("height").replace("px", "");
    svg.attr("viewBox", "0 0 100 50");
}

LayerControl.prototype.draw = function () {

    this.text1 = this.svg.append("text")
        .attr('id', 'text_layer_1')
        .attr('class', 'text_control pointer')
        .attr("text-anchor", "middle")
        .attr('x', 50)
        .attr('y', 16)
        .attr("dominant-baseline", "central")
        .text("Map 1");

    this.text2 = this.svg.append("text")
        .attr('id', 'text_layer_2')
        .attr('class', 'text_control pointer')
        .attr("text-anchor", "middle")
        .attr('x', 50)
        .attr('y', 33)
        .attr("dominant-baseline", "central")
        .text("Map 2");

};

LayerControl.prototype.setCallback = function (element, callback) {
    this.callback = callback;

    // Set the callback
    d3.select('#' + element).on("mousedown", function () {
        callback();
        d3.event.stopPropagation();
    });
};

///////////////////////

function SelectionControl(svg) {
    this.svg = svg;
    this.width = +svg.attr("width").replace("px", "");
    this.height = +svg.attr("height").replace("px", "");
    this.rect2 = null;
    this.text1 = null;
    this.text2 = null;
    this.text3 = null;
    this.callbackSelectAll = null;
    this.callbackDeselectAll = null;
    this.callbackShowCA = null;
    this.callbackHideCA = null;
    this.activeCa = false;
    svg.attr("viewBox", "0 0 100 50");
}

SelectionControl.prototype.draw = function () {

    if (this.text1 !== null)
        this.text1.remove();
    this.text1 = this.svg.append("text")
        .attr('class', 'text_control pointer')
        .attr("text-anchor", "middle")
        .attr('x', 50)
        .attr('y', 12.5)
        .attr("dominant-baseline", "central")
        .attr("id", "select_all_stations")
        .style('font-size', '0.8em')
        .text("Select all stations");

    // Set the callback
    this.text1.on("click", function () {
        if (this.callbackSelectAll !== null)
            this.callbackSelectAll();
        d3.event.stopPropagation();
        //this.draw();
    }.bind(this));

    if (this.text2 !== null)
        this.text2.remove();
    this.text2 = this.svg.append("text")
        .attr('class', 'text_control pointer')
        .attr("text-anchor", "middle")
        .attr('x', 50)
        .attr('y', 25)
        .attr("dominant-baseline", "central")
        .attr("id", "deselect_all_stations")
        .style('font-size', '0.8em')
        .text("Deselect all stations");

    // Set the callback
    this.text2.on("click", function () {
        if (this.callbackDeselectAll !== null)
            this.callbackDeselectAll();
        d3.event.stopPropagation();
        //this.draw();
    }.bind(this));

    if (this.text3 !== null)
        this.text3.remove();
    this.text3 = this.svg.append("text")
        .attr('class', 'text_control pointer')
        .attr("text-anchor", "middle")
        .attr('x', 50)
        .attr('y', 37.5)
        .attr("dominant-baseline", "central")
        .style('font-size', '0.8em');
    if (this.activeCa) {
        this.text3
            .text("Hide CAs");
        this.activeCa = false;

        // Set the callback
        this.text3.on("click", function () {
            if (this.callbackHideCA !== null)
                this.callbackHideCA();
            d3.event.stopPropagation();
            this.draw();
        }.bind(this));
    } else {
        this.text3
            .text("Show CAs");
        this.activeCa = true;

        // Set the callback
        this.text3.on("click", function () {
            if (this.callbackShowCA !== null)
                this.callbackShowCA();
            d3.event.stopPropagation();
            this.draw();
        }.bind(this));
    }

};

SelectionControl.prototype.setCallbackShowCA = function (callback) {
    this.callbackShowCA = callback;
};

SelectionControl.prototype.setCallbackHideCA = function (callback) {
    this.callbackHideCA = callback;
};

SelectionControl.prototype.setCallbackSelectAll = function (callback) {
    this.callbackSelectAll = callback;
};

SelectionControl.prototype.setCallbackDeselectAll = function (callback) {
    this.callbackDeselectAll = callback;
};

///////////////////////

function EnableCalendarControl(svg) {
    this.svg = svg;
    this.width = +svg.attr("width").replace("px", "");
    this.height = +svg.attr("height").replace("px", "");
    svg.attr("viewBox", "0 0 100 25");

    this.calendarOn = false;
}

EnableCalendarControl.prototype.draw = function () {
    var self = this;

    this.text1 = this.svg.append("text")
        .attr('class', 'text_control pointer')
        .attr("text-anchor", "middle")
        .attr('x', 50)
        .attr('y', 12.5)
        .attr("dominant-baseline", "central")
        .text("Show Calendar");

    this.text1.on('click', function () {

        // Make control visible and active
        if (!self.calendarOn) {
            d3.select("#calendar")
                .transition()
                .style("opacity", "1")
                .style("pointer-events", "all");
            self.calendarOn = true;
            self.text1.text("Hide Calendar");
        } else {
            d3.select("#calendar")
                .transition()
                .style("opacity", "0")
                .style("pointer-events", "none");
            self.calendarOn = false;
            self.text1.text("Show Calendar");
        }

    })


};

EnableCalendarControl.prototype.setCallback = function (element, callback) {
    this.callback = callback;

    // Set the callback
    d3.select('#' + element).on("click", function () {
        callback();
        d3.event.stopPropagation();
    });
};

///////////////////////

function CalendarControl() {
    this.month = 7;
    this.dayCounter = 1;
    this.callbackSetDate = null;
}

CalendarControl.prototype.draw = function () {
    var self = this;

    // Hide calendar at the beginning
    d3.select("#calendar")
        .style("opacity", "0")
        .style("pointer-events", "none");

    // Set the callbacks
    d3.select('#cal_plus').on("click", function () {
        self.addDay();
        d3.event.stopPropagation();
    })
        .style('-webkit-user-select', 'none');
    d3.select('#cal_minus').on("click", function () {
        self.subDay();
        d3.event.stopPropagation();
    })
        .style('-webkit-user-select', 'none');

    d3.select('#cal_7')
        .on("click", function () {
            self.month = 7;
            d3.selectAll('.month_selected')
                .classed('month_selected', false);
            d3.select('#cal_7').select("tspan")
                .classed('month_selected', true);
        })
        .style('-webkit-user-select', 'none');
    d3.select('#cal_8').on("click", function () {
        self.month = 8;
        d3.selectAll('.month_selected')
            .classed('month_selected', false);
        d3.select('#cal_8').select("tspan")
            .classed('month_selected', true);
    })
        .style('-webkit-user-select', 'none');
    d3.select('#cal_9').on("click", function () {
        self.month = 9;
        d3.selectAll('.month_selected')
            .classed('month_selected', false);
        d3.select('#cal_9').select("tspan")
            .classed('month_selected', true);
    })
        .style('-webkit-user-select', 'none');
    d3.select('#cal_10').on("click", function () {
        self.month = 10;
        d3.selectAll('.month_selected')
            .classed('month_selected', false);
        d3.select('#cal_10').select("tspan")
            .classed('month_selected', true);
    })
        .style('-webkit-user-select', 'none');
    d3.select('#cal_11').on("click", function () {
        self.month = 11;
        d3.selectAll('.month_selected')
            .classed('month_selected', false);
        d3.select('#cal_11').select("tspan")
            .classed('month_selected', true);
    })
        .style('-webkit-user-select', 'none');
    d3.select('#cal_12').on("click", function () {
        self.month = 12;
        d3.selectAll('.month_selected')
            .classed('month_selected', false);
        d3.select('#cal_12').select("tspan")
            .classed('month_selected', true);
    })
        .style('-webkit-user-select', 'none');

    // Set the callback
    d3.select("#cal_select").on("click", function () {
        if (this.callbackSetDate !== null)
            this.callbackSetDate();
        d3.event.stopPropagation();
    }.bind(this));

};

CalendarControl.prototype.addDay = function () {
    if (this.dayCounter === 31)
        this.dayCounter = 0;
    this.dayCounter++;
    var text = (this.dayCounter > 0 && this.dayCounter < 10) ? "0" + this.dayCounter : this.dayCounter;
    this.day = this.dayCounter;
    d3.select('#cal_day').text(text);

};

CalendarControl.prototype.subDay = function () {
    if (this.dayCounter === 1)
        this.dayCounter = 32;
    this.dayCounter--;
    var text = (this.dayCounter > 0 && this.dayCounter < 10) ? "0" + this.dayCounter : this.dayCounter;
    d3.select('#cal_day').text(text);

};

CalendarControl.prototype.setCallbackSetDate = function (callback) {
    this.callbackSetDate = callback;
};


///////////////////////

function DayControl(svg) {
    this.svg = svg;
    this.hour = null;
    this.enabled = false;

    this.callbackDayClose = null;
    //this.width = +svg.attr("width").replace("px", "");
    //this.height = +svg.attr("height").replace("px", "");
    //svg.attr("viewBox", "0 0 100 100");
}

DayControl.prototype.draw = function () {
    var self = this;

    // Hide day at the beginning
    d3.selectAll(".day_box")
        .style("opacity", "0")
        .style("pointer-events", "none");

    // Set the callbacks
    d3.select("#day_close").on("click", function () {
        self.callbackDayClose();
        d3.event.stopPropagation();
    });

};

DayControl.prototype.setCallbackDayClose = function (callback) {
    this.callbackDayClose = callback;
};

///////////////////////

function StationControl() {
    this.callbackCompareAll = null;
    this.selectedStation = null;
    this.callbackCompareAll = null;
}

StationControl.prototype.draw = function () {

    d3.select('#stationControl').style('opacity', 0); //TODO change to remove

    var self = this;
    d3.selectAll('.station_compareAll').on("mousedown", function () {
        self.callbackCompareAll(this.selectedStation);
        d3.event.stopPropagation();
    }.bind(self))
        .style('-webkit-user-select', 'none');

};

StationControl.prototype.setCallbackCompareAll = function (callback) {
    this.callbackCompareAll = callback;
};

///////////////////////


function ZoomControl() {

    this.callbackZoonIn = null;
    this.callbackZoonOut = null;
}

ZoomControl.prototype.draw = function () {
    var self = this;

    d3.select('#zoom_plus').on("mousedown", function () {
        self.callbackZoonIn();
        d3.event.stopPropagation();
    }.bind(self))
        .style('-webkit-user-select', 'none');


    d3.select('#zoom_minus').on("mousedown", function () {
        self.callbackZoonOut();
        d3.event.stopPropagation();
    }.bind(self))
        .style('-webkit-user-select', 'none');

};

ZoomControl.prototype.setCallbackZoomIn = function (callback) {
    this.callbackZoonIn = callback;
};

ZoomControl.prototype.setCallbackZoomOut = function (callback) {
    this.callbackZoonOut = callback;
};