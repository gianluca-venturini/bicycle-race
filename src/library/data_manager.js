function DataManager(tripUrl, stationUrl) {
	this.tripUrl = tripUrl;
	this.stationUrl = stationUrl;

	this.selectedStations = [];

	this.stations = null;
	this.trips = null;
	this.bikeWeeks = null;
}

/*
	Every function expect a callback that will be executed at the end of the loading process
*/
DataManager.prototype.getStations = function(callback) {


	if(this.stations != null)
		callback(this.stations);
	else
		d3.json(this.stationUrl, function(error, json) {
			if(error)
				console.log("can't download file " + this.stationUrl);

			this.stations = json;

			callback("lol");
			callback(this.stations);
		}.bind(this));
}

DataManager.prototype.getTrips = function(callback) {

	if(this.trips != null)
		callback(this.trips);
	else
		d3.json(this.tripUrl, function(error, json) {
			if(error)
				console.log("can't download file " + this.tripUrl);

			this.trips = json;

			callback(json);
		}.bind(this));
}

// Get bikes out per day of the week of the selected stations
DataManager.prototype.getBikesWeek = function(callback) {

	var url = this.tripUrl+"?aggregate=DAY_WEEK";

	if(this.selectedStations.length > 0)
		url +="&stations=";
		for(var s in this.selectedStations) {
			var station = this.selectedStations[s];
			if(s == 0)
				url+=station;
			else
				url+=","+station;
		}

	if(this.bikeWeeks != null)
		callback(this.trips);
	else
		d3.json(url, function(error, json) {
			if(error)
				console.log("can't download file " + this.tripUrl);

			this.bikeWeeks = json;

			callback(json);
		}.bind(this));
}