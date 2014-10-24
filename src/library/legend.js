function Legend(legend) {
    this.legend = legend;
    this.hide();
}

Legend.prototype.draw = function (type, min, max) {
    var data = [0, 1, 2, 3, 4, 5];
    var divs = this.legend.selectAll("div")
        .data(data)
        .enter()
        .append("div")
        .attr("class", "icon_legend");
    divs.append("img")
        /*.attr("src", function (d) {
            return "./icon/" + type + "/station_" + d + ".png";
        })*/
        .attr("class", "icon_legend");

    divs.append("div");

    this.legend.selectAll(".icon_legend div")
        .text(function (d) {
            return "" + Math.round((max - min) / 6 * d);
        });

    this.legend.selectAll("img.icon_legend")
        .data(data)
        .attr("src", function (d) {
            return "./icon/" + type + "/station_" + d + ".png";
        });
}

Legend.prototype.hide = function () {
    if (this.legend != null)
        this.legend.style("display", "none");
}

Legend.prototype.show = function () {
    if (this.legend != null)
        this.legend.style("display", "block");
}