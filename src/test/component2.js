/*
	This is a dumb component that will display only a circle 100px of row
	it expose:
		one method for changing color
		one method for set a callback when it is pressed
*/
function Component2(svg) {
	this.svg = svg;
	svg.attr("viewBox","0 0 200 200");
}

Component2.prototype.draw = function() {

	this.circle = this.svg.append("rect");

	this.svg.append("text")
			.attr("text-anchor", "middle")
			.attr("transform", "translate(100, 100)")
			.text("Click me");

	this.circle.style("stroke", "black")  
		 .style("opacity", .6) 
		 .style("fill", "red")
		 .attr("width","200")
		.attr("height","200")
		 .attr("transform", "translate(0, 0)")
		 .on("mousedown", function() {
		 	console.log("No callback setted yet");
		 	d3.event.stopPropagation();
		 })
}

Component2.prototype.setPressCallback = function(callback) {
	this.callback = callback;

	// Set the callback
	this.circle.on("mousedown", function() {
		 	callback();
		 	d3.event.stopPropagation();
		 })
}

Component2.prototype.changeColor = function() {
	this.circle.style("fill", "green");
}