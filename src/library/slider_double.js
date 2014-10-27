function SliderDouble(svg) {

    this.margin = {
        top: 5,
        right: 0,
        bottom: 0,
        left: 5
    };

    this.rootSvg = svg;
    this.svg = svg.append("g")
        .attr("transform", "translate(" + this.margin.left + ",0)")
        .attr('id', 'gsliderDouble');

    this.width = +svg.attr("width").replace("px", "") - this.margin.left - this.margin.right;
    this.height = +svg.attr("height").replace("px", "") - this.margin.bottom - this.margin.top;
    //this.width_ = +svg.attr("width").replace("px", "");
    //this.height_ = +svg.attr("height").replace("px", "");
    //this.width_ = 100;
    //this.height_ = 100;

    this.x = d3.scale.linear()
        .domain([15, 100])
        .range([0, this.width])
        .clamp(true);

    this.brush = d3.svg.brush()
        .x(this.x)
        .extent([0, 0]);

    this.callbackSetAge = null;
    this.age = [0, 110];
}

SliderDouble.prototype.draw = function () {

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
        .attr("height", this.height)
        .attr("width", this.width)
        .style('cursor', 'pointer');

    var handle1 = slider.append("circle")
        .attr("class", "handle")
        .attr("transform", "translate(0," + height / 2 + ")")
        .attr("r", 9);
    this.handle1 = handle1;

    var handle2 = slider.append("circle")
        .attr("class", "handle")
        .attr("transform", "translate(0," + height / 2 + ")")
        .attr("r", 9);
    handle2.attr("cx", 370);
    this.handle2 = handle2;

    var node = document.getElementById("gsliderDouble");
    var bb = node.getBBox();
    this.rootSvg.attr("viewBox", "0 0 " + bb.width + " " + bb.height)
        .style("background-color", "");

    this.brush.on("brush", brushed);

    function brushed() {

        var value = brush.extent()[0];

        if (d3.event.sourceEvent) {
            value = x.invert(d3.mouse(this)[0]);
            brush.extent([value, value]);
            d3.event.sourceEvent.stopPropagation();
        }

        if (Math.abs(handle1.attr("cx") - x(value)) < Math.abs(handle2.attr("cx") - x(value))) {
            handle1.attr("cx", x(value));
            self.age[0] = Math.floor(value);
            d3.select("#age_from").text(self.age[0]);
        } else {
            handle2.attr("cx", x(value));
            self.age[1] = Math.floor(value);
            d3.select("#age_to").text(self.age[1]);
        }

        self.callbackSetAge();

    }

};

SliderDouble.prototype.setCallbackSetAge = function (callback) {
    this.callbackSetAge = callback;
};