/*
	This is a dumb component that will display only a circle 100px of row
	it expose:
		one method for changing color
		one method for set a callback when it is pressed
*/
function Component1(svg) {
	this.svg = svg;
}

Component1.prototype.draw = function() {

	this.circle = this.svg.append("circle");

	this.svg.append("text")
			.attr("text-anchor", "middle")
			.attr("x", 100)
			.attr("y", 100)
			.text("Click me");

	this.circle.style("stroke", "black")  
		 .style("opacity", .6) 
		 .style("fill", "red")
		 .attr("r", 100)
		 .attr("transform", "translate(100, 100)")
		 .on("mousedown", function() {
		 	console.log("No callback setted yet");
		 	d3.event.stopPropagation();
		 })
}

Component1.prototype.setPressCallback = function(callback) {
	this.callback = callback;

	// Set the callback
	this.circle.on("mousedown", function() {
		 	callback();
		 	d3.event.stopPropagation();
		 })
}

Component1.prototype.changeColor = function() {
	this.circle.style("fill", "green");
}