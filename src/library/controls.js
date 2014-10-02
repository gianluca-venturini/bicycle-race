///////////////////////
/*
	This class contains all the controls to change the selections and the data displayed.
*/
///////////////////////

function LayerControl(svg) {
    this.svg = svg;
    this.width = +svg.attr("width").replace("px", "");
    this.height = +svg.attr("height").replace("px", "");
    this.marginLeft = '5'; // TODO 
    this.marginTop = '5';
    svg.attr("viewBox", "0 0 100 50")
        .attr('preserveAspectRatio', 'xMinYMin meet');
}

LayerControl.prototype.draw = function () {

    this.rect1 = this.svg.append("rect")
        .style('margin-left', this.marginLeft)
        .style('margin-top', this.marginTop)
        .style("opacity", 0.5)
        .style("fill", "#595959")
        .attr("width", 100 - this.marginLeft)
        .attr("height", 50 - this.marginTop)
        .attr('x', this.marginLeft)
        .attr('y', this.marginTop);

    this.text1 = this.svg.append("text")
        .attr('id', 'text_layer_1')
        .attr("text-anchor", "middle")
        .attr('x', +this.marginLeft + (+this.rect1.attr("width") / 2))
        .attr('y', +this.rect1.attr('y') + (+this.rect1.attr("height") * 0.33))
        .attr("dominant-baseline", "central")
        .text("Map 1");

    this.text2 = this.svg.append("text")
        .attr('id', 'text_layer_2')
        .attr("text-anchor", "middle")
        .attr('x', +this.marginLeft + (+this.rect1.attr("width") / 2))
        .attr('y', +this.rect1.attr('y') + (+this.rect1.attr("height") * 0.66))
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
    this.marginLeft = '5'; // TODO 
    this.marginTop = '5';
    svg.attr("viewBox", "0 0 100 50")
        .attr('preserveAspectRatio', 'xMinYMin meet');
}

SelectionControl.prototype.draw = function () {

    this.rect2 = this.svg.append("rect")
        .style('margin-left', this.marginLeft)
        .style('margin-top', this.marginTop)
        .style("opacity", 0.5)
        .style("fill", "#595959")
        .attr("width", 100 - this.marginLeft)
        .attr("height", 50 - this.marginTop)
        .attr('x', this.marginLeft)
        .attr('y', this.marginTop);

    this.text1 = this.svg.append("text")
        .attr("text-anchor", "middle")
        .attr('x', +this.marginLeft + (+this.rect2.attr("width") / 2))
        .attr('y', +this.rect2.attr('y') + (+this.rect2.attr("height") * 0.25))
        .attr("dominant-baseline", "central")
        .style('font-size', '0.8em')
        .text("Select all stations");

    this.text2 = this.svg.append("text")
        .attr("text-anchor", "middle")
        .attr('x', +this.marginLeft + (+this.rect2.attr("width") / 2))
        .attr('y', +this.rect2.attr('y') + (+this.rect2.attr("height") * 0.50))
        .attr("dominant-baseline", "central")
        .style('font-size', '0.8em')
        .text("Deselect all stations");

    this.text3 = this.svg.append("text")
        .attr("text-anchor", "middle")
        .attr('x', +this.marginLeft + (+this.rect2.attr("width") / 2))
        .attr('y', +this.rect2.attr('y') + (+this.rect2.attr("height") * 0.75))
        .attr("dominant-baseline", "central")
        .style('font-size', '0.8em')
        .text("Show CAs");

};

SelectionControl.prototype.setCallback = function (element, callback) {
    this.callback = callback;

    // Set the callback
    d3.select('#' + element).on("mousedown", function () {
        callback();
        d3.event.stopPropagation();
    });
};

///////////////////////

function EnableCalendarControl(svg) {
    this.svg = svg;
    this.width = +svg.attr("width").replace("px", "");
    this.height = +svg.attr("height").replace("px", "");
    this.marginLeft = '5'; // TODO 
    this.marginTop = '5';
    svg.attr("viewBox", "0 0 100 25")
        .attr('preserveAspectRatio', 'xMinYMin meet');
}

EnableCalendarControl.prototype.draw = function () {

    this.rect1 = this.svg.append("rect")
        .style('margin-left', this.marginLeft)
        .style('margin-top', this.marginTop)
        .style("opacity", 0.5)
        .style("fill", "#595959")
        .attr("width", 100 - this.marginLeft)
        .attr("height", 25 - this.marginTop)
        .attr('x', this.marginLeft)
        .attr('y', this.marginTop);

    this.text1 = this.svg.append("text")
        .attr("text-anchor", "middle")
        .attr('x', +this.marginLeft + (+this.rect1.attr("width") / 2))
        .attr('y', +this.rect1.attr('y') + (+this.rect1.attr("height") * 0.5))
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

function DayControl(svg) {
    this.svg = svg;
    this.width = +svg.attr("width").replace("px", "");
    this.height = +svg.attr("height").replace("px", "");
    this.marginLeft = '5'; // TODO 
    this.marginTop = '5';
    svg.attr("viewBox", "0 0 100 100")
        .attr('preserveAspectRatio', 'xMinYMin meet');
}

DayControl.prototype.draw = function () {

    this.rect1 = this.svg.append("rect")
        .style('margin-left', this.marginLeft)
        .style('margin-top', this.marginTop)
        .style("opacity", 0.5)
        .style("fill", "#595959")
        .attr("width", 100 - this.marginLeft)
        .attr("height", 100 - this.marginTop)
        .attr('x', this.marginLeft)
        .attr('y', this.marginTop);

    this.text1 = this.svg.append("text")
        .attr("text-anchor", "middle")
        .attr('x', +this.marginLeft + (+this.rect1.attr("width") / 2))
        .attr('y', +this.rect1.attr('y') + (+this.rect1.attr("height") * 0.5))
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