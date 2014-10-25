function Legend(legend, gmId) {
    this.id = gmId;
    this.legend = legend;
    this.hide();
}

Legend.prototype.draw = function (type, min, max) {
    var data = [0, 1, 2, 3, 4, 5];
    var divs = this.legend.selectAll("div")
        .data(data)
        .enter()
        .append("div")
        .attr("class", "icon_legend" + this.id);
    divs.append("img")
        .attr("class", "icon_legend" + this.id);

    divs.append("div");

    this.legend.selectAll(".icon_legend" + this.id + " div")
        .data(data)
        .text(function (d) {
            return "" + Math.round((max - min) / 6 * d);
        });

    this.legend.selectAll("img.icon_legend" + this.id)
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