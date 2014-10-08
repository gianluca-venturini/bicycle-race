function Slider(svg) {

    this.svg = svg;
    this.width = +svg.attr("width").replace("px", "");
    this.height = +svg.attr("height").replace("px", "");
    svg.attr("viewBox", "0 0 100 50");

    this.margin = {
        top: 50,
        right: 10,
        bottom: 50,
        left: 10
    };

    // this.width = 960 - this.margin.left - this.margin.right;
    // this.height = 500 - this.margin.bottom - this.margin.top;

    this.x = d3.scale.linear()
        .domain([0, 23])
        .range([0, this.width])
        .clamp(true);

    this.brush = d3.svg.brush()
        .x(this.x)
        .extent([0, 0])
        .on("brush", this.brushed.bind(this));

}

Slider.prototype.draw = function () {

    var width = this.width;
    var height = this.height;
    var brush = this.brush;

    /*var svg = d3.select("#map").append("svg")
        .attr("width", width + this.margin.left + this.margin.right)
        .attr("height", height + this.margin.top + this.margin.bottom)
        */
    var svg = this.svg;
    /*svg.append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
*/
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height / 2 + ")")
        .call(d3.svg.axis()
            .scale(this.x)
            .orient("bottom")
            .tickFormat(function (d) {
                return d;
            })
            .tickSize(0)
            .tickPadding(10))
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

    /*slider.select(".background")
        .attr("height", height);*/

    this.handle = slider.append("circle")
        .attr("class", "handle")
        .attr("transform", "translate(0," + height / 2 + ")")
        .attr("r", 9);

   /* slider
        .call(brush.event)
        .transition()
        .duration(750)
        .call(brush.extent([70, 70]))
        .call(brush.event);
*/
};

Slider.prototype.brushed = function () {
    
    var value = this.brush.extent()[0];

    if (d3.event.sourceEvent) { // not a programmatic event
        value = x.invert(d3.mouse(this)[0]);
        brush.extent([value, value]);
    }

    this.handle.attr("cx", this.x(value));
    
};