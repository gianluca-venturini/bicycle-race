/*
	This class contains all the controls to change the selections and the data displayed.
*/
function Controls(svg) {
    this.svg = svg;
    this.width = +svg.attr("width").replace("px", "");
    this.height = +svg.style("height").replace("px", "");
    svg.attr("viewBox", "0 0 " + this.width + " " + this.height);
}

Controls.prototype.draw = function () {

    this.rect1 = this.svg.append("rect");

    this.text1 = this.svg.append("text")
        .attr('id', 'text1')
        .attr("text-anchor", "middle")
        .attr("transform", "translate(50, 30)")
        .text("Map 1");

    this.text2 = this.svg.append("text")
        .attr('id', 'text2')
        .attr("text-anchor", "middle")
        .attr("transform", "translate(50, 60)")
        .text("Map 2");

    this.rect1
        .style("opacity", 0.5)
        .style("fill", "#595959")
        .attr("width", "100%")
        .attr("height", "30%")
        .attr("transform", "translate(0, 0)");

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