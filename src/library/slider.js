function Slider(svg, gmId) {

    this.id = gmId;
    this.margin = {
        top: 5,
        right: 0,
        bottom: 0,
        left: 5
    };

    this.rootSvg = svg.attr("class", "day_box" + this.id);
    this.svg = svg.append("g")
        .attr("transform", "translate(" + this.margin.left + ",0)")
        .attr('id', 'gslider');

    this.width = +svg.attr("width").replace("px", "") - this.margin.left - this.margin.right;
    this.height = +svg.attr("height").replace("px", "") - this.margin.bottom - this.margin.top;
    //this.width_ = +svg.attr("width").replace("px", "");
    //this.height_ = +svg.attr("height").replace("px", "");
    //this.width_ = 100;
    //this.height_ = 100;

    this.x = d3.scale.linear()
        .domain([0, 23.59])
        .range([0, this.width])
        .clamp(true);

    this.brush = d3.svg.brush()
        .x(this.x)
        .extent([0, 0]);

    this.callbackSetHour = null;
    this.hour = null;
}

Slider.prototype.draw = function () {

    var self = this;

    var width = this.width;
    var height = this.height;
    var brush = this.brush;
    var x = this.x;
    var svg = this.svg;

    svg.append("g")
        .attr("class", "x slider_axis")
        .attr("transform", "translate(0," + height / 2 + ")")
        .call(d3.svg.axis()
            .scale(this.x)
            .orient("bottom")
            .tickFormat(function (d) {
                return d;
            })
            .innerTickSize(0)
            .outerTickSize(0)
            .ticks(12)
            .tickPadding(13))
        .select(".domain")
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "halo");

    var slider = svg.append("g")
        .attr("class", "slider")
        .call(brush);

    slider.selectAll(".extent,.resize")
        .remove();

    slider.select(".background")
        .attr("class", "day_box" + this.id)
        .attr("height", this.height)
        .attr("width", this.width)
        .style('cursor', 'pointer');

    var handle = slider.append("circle")
        .attr("class", "handle")
        .attr("transform", "translate(0," + height / 2 + ")")
        .attr("r", 9);
    this.handle = handle;

    var node = document.getElementById("gslider");
    var bb = node.getBBox();
    this.rootSvg.attr("viewBox", "0 0 " + bb.width + " " + bb.height)
        .style("background-color", "");

    /*slider
        .call(brush.event)
        .transition()
        .duration(750)
        .call(brush.extent([10, 10]))
        .call(brush.event);
        */
    this.brush.on("brush", brushed);

    function brushed() {

        var value = brush.extent()[0];

        if (d3.event.sourceEvent) {
            value = x.invert(d3.mouse(this)[0]);
            brush.extent([value, value]);
            d3.event.sourceEvent.stopPropagation();
        }

        handle.attr("cx", x(value));

        // Compute hour
        var h = Math.floor(value);
        var m = Math.floor((value - h) * 60);
        h = h < 10 ? "0" + h : h;
        m = m < 10 ? "0" + m : m;

        // Set hour
        self.hour = h + ":" + m;
        //console.log(value, "-->", h + ":" + m);

        var displayedHour = self.toAmericanHour(h, m);

        // Update hour label
        d3.select("#day_hour" + self.id).text(displayedHour);

        self.callbackSetHour();

    }

    // Hide day and slider at the beginning
    d3.selectAll(".day_box" + this.id)
        .style("opacity", "0")
        .style("pointer-events", "none");

};

Slider.prototype.toAmericanHour = function (h, m) {
    var suffix = (h >= 12 && h <= 24) ? "PM" : "AM";
    var hh = h;
    if (h >= 13 && h <= 24) {
        hh = h - 12;
        hh = hh < 10 ? "0" + hh : hh;
    }
    if (+hh === 0) hh = 12;
    var hour = hh + ":" + m + " " + suffix;
    return hour;
};

Slider.prototype.reset = function () {
    this.brush.extent([0, 0]);
    this.handle.attr("cx", this.x(0));
    this.hour = null;
    d3.select("#day_hour" + this.id).text("");
};

Slider.prototype.setCallbackSetHour = function (callback) {
    this.callbackSetHour = callback;
};