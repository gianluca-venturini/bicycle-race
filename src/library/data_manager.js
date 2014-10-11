function DataManager(tripUrl, stationUrl, weatherUrl, timeDistributionUrl) {
	this.tripUrl = tripUrl;
	this.stationUrl = stationUrl;
	this.weatherUrl = weatherUrl;
	this.timeDistributionUrl = timeDistributionUrl;

	this.selectedStations = [];

	// Filters
	this.date = null;
	this.hour = null;	// format: "hh:mm"

	// Data cache
	this.stations = null;
	this.trips = null;
	this.bikeWeeks = null;
	this.bikeHours = null;
	this.bike = null;
	this.timeDistribution = null;

	// Mode
	this.selectionMode = null; 	// MULTIPLE | DOUBLE
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

			//callback("lol");
			callback(this.stations);
		}.bind(this));
}

/*
	Get the weather of the specified day
*/
DataManager.prototype.getWeather = function(callback) {

	var url = this.weatherUrl;

	if(this.date != null) {
		url += "?";
		url += "from="+this.date;
		url += "&";
		url += "to="+this.date;
	}

	d3.json(url, function(error, json) {
		if(error)
			console.log("can't download file " + this.stationUrl);

		

		this.stations = json;

		callback(this.stations);
	});
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

// Get bikes out per day of the week for the selected stations
DataManager.prototype.getBikesWeek = function(callback) {

	var url = this.tripUrl+"?aggregate=DAY_WEEK";

	if(this.date != null) {
		url += "&";
		url += "from="+this.date;
		url += "&";
		url += "to="+this.date;
	}

	if(this.selectedStations.length > 0)
		url +="&stations=";
		for(var s in this.selectedStations) {
			var station = this.selectedStations[s].id;
			if(s == 0)
				url+=station;
			else
				url+=","+station;
		}

	/* NO CACHE FOR NOW
	if(this.bikeWeeks != null)
		callback(this.bikeWeeks);
	else */
	d3.json(url, function(error, json) {
		if(error)
			console.log("can't download file " + this.tripUrl);

		this.bikeWeeks = json;

		callback(json);
	}.bind(this));
}

// Get bikes out per hour of the day for the selected stations
DataManager.prototype.getBikesHourDay = function(callback) {

	var url = this.tripUrl+"?aggregate=HOUR_DAY";

	if(this.date != null) {
		url += "&";
		url += "from="+this.date;
		url += "&";
		url += "to="+this.date;
	}

	if(this.selectedStations.length > 0)
		url +="&stations=";
		for(var s in this.selectedStations) {
			var station = this.selectedStations[s].id;
			if(s == 0)
				url+=station;
			else
				url+=","+station;
		}

	/*
	if(this.bikeHours != null)
		callback(this.trips);
	else
		*/
	d3.json(url, function(error, json) {
		if(error)
			console.log("can't download file " + this.tripUrl);

		this.bikeHours = json;

		callback(json);
	}.bind(this));
}

// Get bikes out per day of the year for the selected stations
DataManager.prototype.getBikesDayYear = function(callback) {

	var url = this.tripUrl+"?aggregate=DAY_YEAR";

	if(this.selectedStations.length > 0)
		url +="&stations=";
		for(var s in this.selectedStations) {
			var station = this.selectedStations[s].id;
			if(s == 0)
				url+=station;
			else
				url+=","+station;
		}

	/*
	if(this.bikeHours != null)
		callback(this.trips);
	else
		*/
	d3.json(url, function(error, json) {
		if(error)
			console.log("can't download file " + this.tripUrl);

		this.bikeHours = json;

		callback(json);
	}.bind(this));
}

// Get bikes out for the selected stations
DataManager.prototype.getBikes = function(callback) {

	var url = this.getTripUrl(true);

	if(this.selectedStations.length > 0)
		url +="&stations=";
		for(var s in this.selectedStations) {
			var station = this.selectedStations[s].id;
			if(s == 0)
				url+=station;
			else
				url+=","+station;
		}

	if(this.date != null) {
		url += "&";
		url += "from="+this.date;
		url += "&";
		url += "to="+this.date;
	}

	if(this.bike != null)
		callback(this.bike);
	else
		d3.json(url, function(error, json) {
			if(error)
				console.log("can't download file " + this.tripUrl);

			this.bike = json;

			callback(json);
		}.bind(this));
}

/*
	Get the demographic data for the selected stations
*/
DataManager.prototype.getStationsDemographic = function(callback) {

	var url = this.stationUrl;
	url += "?demographic=OUT";

	if(this.date != null) {
		url += "&";
		url += "from="+this.date;
		url += "&";
		url += "to="+this.date;
	}

	// Only selected stations
	if(this.selectedStations.length > 0)
		url +="&stations=";
		for(var s in this.selectedStations) {
			var station = this.selectedStations[s].id;
			if(s == 0)
				url+=station;
			else
				url+=","+station;
		}

	d3.json(url, function(error, json) {
		if(error)
			console.log("can't download file " + this.stationUrl);

		callback(json);
	}.bind(this));
}

DataManager.prototype.getTripUrl = function(coordinates) {
	var url = this.tripUrl;

	if(this.date != null ||
	   this.selectedStations != null ||
	   coordinates == true)
		url += "?";


	if(this.date != null) {
		url += "&";
		url += "from="+this.date;
		url += "&";
		url += "to="+this.date;
	}

	if(coordinates == true) {
		url += "&";
		url += "coordinates=TRUE";
	}
	return url;
} 

// Get time distribution of bike trips
DataManager.prototype.getTimeDistribution = function(callback) {

	var url = this.timeDistributionUrl;

	if(this.timeDistribution != null)
		callback(this.timeDistribution);
	else
		d3.json(url, function(error, json) {
			if(error)
				console.log("can't download file " + this.timeDistributionUrl);

			this.timeDistribution = json;

			callback(json);
		}.bind(this));
}