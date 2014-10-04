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

    /*
    this.rect1 = this.svg.append("rect")
        .style('margin-left', this.marginLeft)
        .style('margin-top', this.marginTop)
        .style("opacity", 0.5)
        .style("fill", "#595959")
        .attr("width", 100 - this.marginLeft)
        .attr("height", 50 - this.marginTop)
        .attr('x', this.marginLeft)
        .attr('y', this.marginTop);
    */

    this.text1 = this.svg.append("text")
        .attr('id', 'text_layer_1')
        .attr("text-anchor", "middle")
        .attr('x', 50)
        .attr('y', 16)
        .attr("dominant-baseline", "central")
        .text("Map 1");

    this.text2 = this.svg.append("text")
        .attr('id', 'text_layer_2')
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
    this.callbackShowCA = null;
    this.callbackHideCA = null;
    this.activeCa = false;
    svg.attr("viewBox", "0 0 100 50");
}

SelectionControl.prototype.draw = function () {
    /*
    if(this.rect2 != null)
        this.rect2.remove();
    this.rect2 = this.svg.append("rect")
        .style('margin-left', this.marginLeft)
        .style('margin-top', this.marginTop)
        .style("opacity", 0.5)
        .style("fill", "#595959")
        .attr("width", 100 - this.marginLeft)
        .attr("height", 50 - this.marginTop)
        .attr('x', this.marginLeft)
        .attr('y', this.marginTop);
    */

    if (this.text1 !== null)
        this.text1.remove();
    this.text1 = this.svg.append("text")
        .attr("text-anchor", "middle")
        .attr('x', 50)
        .attr('y', 12.5)
        .attr("dominant-baseline", "central")
        .attr("id", "select_all_stations")
        .style('font-size', '0.8em')
        .text("Select all stations");

    if (this.text2 !== null)
        this.text2.remove();
    this.text2 = this.svg.append("text")
        .attr("text-anchor", "middle")
        .attr('x', 50)
        .attr('y', 25)
        .attr("dominant-baseline", "central")
        .attr("id", "deselect_all_stations")
        .style('font-size', '0.8em')
        .text("Deselect all stations");

    if (this.text3 !== null)
        this.text3.remove();
    this.text3 = this.svg.append("text")
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
        this.text3.on("mousedown", function () {
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
        this.text3.on("mousedown", function () {
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

///////////////////////

function EnableCalendarControl(svg) {
    this.svg = svg;
    this.width = +svg.attr("width").replace("px", "");
    this.height = +svg.attr("height").replace("px", "");
    svg.attr("viewBox", "0 0 100 25");
}

EnableCalendarControl.prototype.draw = function () {

    /*
    this.rect1 = this.svg.append("rect")
        .style('margin-left', this.marginLeft)
        .style('margin-top', this.marginTop)
        .style("opacity", 0.5)
        .style("fill", "#595959")
        .attr("width", 100 - this.marginLeft)
        .attr("height", 25 - this.marginTop)
        .attr('x', this.marginLeft)
        .attr('y', this.marginTop);
    */

    this.text1 = this.svg.append("text")
        .attr("text-anchor", "middle")
        .attr('x', 50)
        .attr('y', 12.5)
        .attr("dominant-baseline", "central")
        .text("Calendar +");

};

EnableCalendarControl.prototype.setCallback = function (element, callback) {
    this.callback = callback;

    // Set the callback
    d3.select('#' + element).on("mousedown", function () {
        callback();
        d3.event.stopPropagation();
    });
};

///////////////////////

function CalendarControl() {
    this.dayCounter = 1;
    //d3.select('#calendar').attr("viewBox", "0 0 100 100");

}

CalendarControl.prototype.draw = function () {
    var self = this;
    // Set the callbacks
    d3.select('#cal_plus').on("mousedown", function () {
        self.addDay();
        d3.event.stopPropagation();
    })
        .style('-webkit-user-select', 'none');
    d3.select('#cal_minus').on("mousedown", function () {
        self.subDay();
        d3.event.stopPropagation();
    })
        .style('-webkit-user-select', 'none');

};

CalendarControl.prototype.addDay = function () {
    this.dayCounter++;
    var text = (this.dayCounter > 0 && this.dayCounter < 10) ? "0" + this.dayCounter : this.dayCounter;
    d3.select('#cal_day').text(text);
    if (this.dayCounter === 31)
        this.dayCounter = 0;
};

CalendarControl.prototype.subDay = function () {
    this.dayCounter--;
    var text = (this.dayCounter > 0 && this.dayCounter < 10) ? "0" + this.dayCounter : this.dayCounter;
    d3.select('#cal_day').text(text);
    if (this.dayCounter === 1)
        this.dayCounter = 32;
};

///////////////////////

function DayControl(svg) {
    this.svg = svg;
    this.width = +svg.attr("width").replace("px", "");
    this.height = +svg.attr("height").replace("px", "");
    svg.attr("viewBox", "0 0 100 100");
}

DayControl.prototype.draw = function () {

    /*
    this.rect1 = this.svg.append("rect")
        .style('margin-left', this.marginLeft)
        .style('margin-top', this.marginTop)
        .style("opacity", 0.5)
        .style("fill", "#595959")
        .attr("width", 100 - this.marginLeft)
        .attr("height", 100 - this.marginTop)
        .attr('x', this.marginLeft)
        .attr('y', this.marginTop);
    */

    this.text1 = this.svg.append("text")
        .attr("text-anchor", "middle")
        .attr('x', 50)
        .attr('y', 10)
        .attr("dominant-baseline", "central")
        .text("Day 1");

};

DayControl.prototype.setCallback = function (element, callback) {
    this.callback = callback;

    // Set the callback
    d3.select('#' + element).on("mousedown", function () {
        callback();
        d3.event.stopPropagation();
    });
};

///////////////////////

function ZoomControl(svg) {

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