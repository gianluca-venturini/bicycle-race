/*
	This class contains all the controls to change the selections and the data displayed.
*/
function Controls(svg) {
    this.svg = svg;
    this.width = +svg.attr("width").replace("px", "");
    this.height = +svg.style("height").replace("px", "");
    this.marginLeft = '5'; // TODO 
    this.marginTop = '5';
    svg.attr("viewBox", "0 0 " + this.width + " " + this.height);
}

Controls.prototype.draw = function () {

    this.rect1 = this.svg.append("rect")
        .style('margin-left', this.marginLeft)
        .style('margin-top', this.marginTop)
        .style("opacity", 0.5)
        .style("fill", "#595959")
        .attr("width", this.width - this.marginLeft)
        .attr("height", this.height * 0.3 - this.marginTop)
        .attr('x', this.marginLeft)
        .attr('y', this.marginTop);

    this.text1_1 = this.svg.append("text")
        .attr('id', 'text1_1')
        .attr("text-anchor", "middle")
        .attr('x', +this.marginLeft + (+this.rect1.attr("width") / 2))
        .attr('y', +this.rect1.attr('y') + (+this.rect1.attr("height") * 0.33))
        .attr("dominant-baseline", "central")
        .text("Map 1");

    this.text1_2 = this.svg.append("text")
        .attr('id', 'text1_2')
        .attr("text-anchor", "middle")
        .attr('x', +this.marginLeft + (+this.rect1.attr("width") / 2))
        .attr('y', +this.rect1.attr('y') + (+this.rect1.attr("height") * 0.66))
        .attr("dominant-baseline", "central")
        .text("Map 2");

    ////////////////////////////////////////////

    this.rect2 = this.svg.append("rect")
        .style('margin-left', this.marginLeft)
        .style('margin-top', this.marginTop)
        .style("opacity", 0.5)
        .style("fill", "#595959")
        .attr("width", this.width - this.marginLeft)
        .attr("height", this.height * 0.3 - this.marginTop)
        .attr('x', this.marginLeft)
        .attr('y', +this.rect1.attr("height") + (+this.marginTop * 2));

    this.text2_1 = this.svg.append("text")
        .attr('id', 'text2_1')
        .attr("text-anchor", "middle")
        .attr('x', +this.marginLeft + (+this.rect2.attr("width") / 2))
        .attr('y', +this.rect2.attr('y') + (+this.rect2.attr("height") * 0.25))
        .attr("dominant-baseline", "central")
        .text("Select all stations");

    this.text2_2 = this.svg.append("text")
        .attr('id', 'text2_2')
        .attr("text-anchor", "middle")
        .attr('x', +this.marginLeft + (+this.rect2.attr("width") / 2))
        .attr('y', +this.rect2.attr('y') + (+this.rect2.attr("height") * 0.50))
        .attr("dominant-baseline", "central")
        .text("Deselect all stations");

    this.text2_3 = this.svg.append("text")
        .attr('id', 'text2_2')
        .attr("text-anchor", "middle")
        .attr('x', +this.marginLeft + (+this.rect2.attr("width") / 2))
        .attr('y', +this.rect2.attr('y') + (+this.rect2.attr("height") * 0.75))
        .attr("dominant-baseline", "central")
        .text("Show CAs");

};

Controls.prototype.setCallback = function (element, callback) {
    this.callback = callback;

    // Set the callback
    d3.select('#' + element).on("mousedown", function () {
        callback();
        d3.event.stopPropagation();
    });
};

Controls.prototype.changeColor = function () {
    this.rect1.style("fill", "green");
};

///////////////////////

function LayerControl(svg) {
    this.svg = svg;
    this.width = +svg.attr("width").replace("px", "");
    this.height = +svg.style("height").replace("px", "");
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
        .attr("width", this.width - this.marginLeft)
        .attr("height", this.height - this.marginTop)
        .attr('x', this.marginLeft)
        .attr('y', this.marginTop);

    this.text1_1 = this.svg.append("text")
        .attr('id', 'text1_1')
        .attr("text-anchor", "middle")
        .attr('x', +this.marginLeft + (+this.rect1.attr("width") / 2))
        .attr('y', +this.rect1.attr('y') + (+this.rect1.attr("height") * 0.33))
        .attr("dominant-baseline", "central")
        .text("Map 1");

    this.text1_2 = this.svg.append("text")
        .attr('id', 'text1_2')
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