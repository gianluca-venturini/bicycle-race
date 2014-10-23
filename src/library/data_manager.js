function DataManager(tripUrl, 
					 stationUrl, 
					 weatherUrl, 
					 timeDistributionUrl, 
					 distanceDistributionUrl, 
					 stationAgeUrl, 
					 stationFlowUrl,
					 rideUrl) {
	this.tripUrl = tripUrl;
	this.stationUrl = stationUrl;
	this.weatherUrl = weatherUrl;
	this.timeDistributionUrl = timeDistributionUrl;
	this.distanceDistributionUrl = distanceDistributionUrl;
	this.stationAgeUrl = stationAgeUrl;
	this.stationFlowUrl = stationFlowUrl;
	this.rideUrl = rideUrl;

	this.selectedStations = [];

	// Filters
	this.date = null;
	this.hour = null;			// format: "hh:mm"
	this.gender = null;			// "MALE" | "FEMALE" | "UNKNOWN"
	this.age = null;			// expected a vector [minAge, maxAge]
	this.customerType = null;	// "CUSTOMER" | "SUBSCRIBER"

	// Data cache
	this.stations = null;
	this.trips = null;
	this.bikeWeeks = null;
	this.bikeHours = null;
	this.bike = null;
	this.timeDistribution = null;
	this.distanceDistribution = null;
	this.tripDistanceDistribution = null;

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

	if(this.selectedStations.length == 0) {
		callback([]);
		return;
	}

	var url = this.tripUrl;
	url += this.filters();

	if(this.trips != null)
		callback(this.trips);
	else
		d3.json(url, function(error, json) {
			if(error)
				console.log("can't download file " + url);

			this.trips = json;

			callback(json);
		}.bind(this));
}

// Get bikes out per day of the week for the selected stations
DataManager.prototype.getBikesWeek = function(callback) {

	if(this.selectedStations.length == 0) {
		callback([]);
		return;
	}

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

	url += this.filters();

	/* NO CACHE FOR NOW
	if(this.bikeWeeks != null)
		callback(this.bikeWeeks);
	else */
	d3.json(url, function(error, json) {
		if(error)
			console.log("can't download file " + this.tripUrl);

		data = this.filterDataModality(json);

		this.bikeWeeks = data;

		callback(json);
	}.bind(this));
}

// Get bikes out per hour of the day for the selected stations
DataManager.prototype.getBikesHourDay = function(callback) {

	if(this.selectedStations.length == 0) {
		callback([]);
		return;
	}

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

	url += this.filters();

	d3.json(url, function(error, json) {
		if(error)
			console.log("can't download file " + this.tripUrl);

		data = this.filterDataModality(json);

		this.bikeHours = data;

		callback(json);
	}.bind(this));
}

// Get bikes out per day of the year for the selected stations
DataManager.prototype.getBikesDayYear = function(callback) {

	if(this.selectedStations.length == 0) {
		callback([]);
		return;
	}

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

	url += this.filters();
	
	d3.json(url, function(error, json) {
		if(error)
			console.log("can't download file " + this.tripUrl);

		callback(json);
	}.bind(this));
}

// Get bikes out for the selected stations
DataManager.prototype.getBikes = function(callback) {

	if(this.selectedStations.length == 0) {
		callback([]);
		return;
	}

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

	/*
	if(this.date != null) {
		url += "&";
		url += "from="+this.date;
		url += "&";
		url += "to="+this.date;
	}
	*/

	url += this.filters();

	d3.json(url, function(error, json) {
		if(error)
			console.log("can't download file " + this.tripUrl);

		data = this.filterDataModality(json);

		this.bike = data;

		callback(json);
	}.bind(this));
}

/*
	Get the demographic data for the selected stations
*/
DataManager.prototype.getStationsDemographic = function(callback) {

	if(this.selectedStations.length == 0) {
		callback([]);
		return;
	}

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

	url += this.filters();

	d3.json(url, function(error, json) {
		if(error)
			console.log("can't download file " + this.stationUrl);

		callback(json);
	}.bind(this));
}

DataManager.prototype.getStationsAge = function(callback) {

	if(this.selectedStations.length == 0) {
		callback([]);
		return;
	}

	var url = this.stationAgeUrl;
	url += "?demographic=OUT";

	if(this.date != null) {
		url += "&";
		url += "from="+this.date;
		url += "&";
		url += "to="+this.date;
	}

	url += "&aggregate=yes";	// Get aggregated results

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

	url += this.filters();

	d3.json(url, function(error, json) {
		if(error)
			console.log("can't download file " + this.stationUrl);

		callback(json);
	}.bind(this));
}

DataManager.prototype.getTripUrl = function(coordinates) {
	var url = this.tripUrl;

	if(this.date != null ||
	   this.selectedStations != [] ||
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


	url += "?"+this.filters();
	/*
	if(this.timeDistribution != null)
		callback(this.timeDistribution);
	else */
	d3.json(url, function(error, json) {
		if(error)
			console.log("can't download file " + this.timeDistributionUrl);

		this.timeDistribution = json;

		callback(json);
	}.bind(this));
}

// Get time distribution of bike trips
DataManager.prototype.getDistanceDistribution = function(callback) {

	var url = this.distanceDistributionUrl;

	url += "?"+this.filters();

	/*
	if(this.distanceDistribution != null)
		callback(this.distanceDistribution);
	else
	*/
	d3.json(url, function(error, json) {
		if(error)
			console.log("can't download file " + this.distanceDistributionUrl);

		this.distanceDistribution = json;

		callback(json);
	}.bind(this));
}

/*
	Get the flow for the station
	flow: "IN" | "OUT"
*/
DataManager.prototype.getFlow = function(callback, stationId, flow) {

	var url = this.stationFlowUrl;

	url += "?";
	url += "station="+stationId;
	url += "&";
	url += "flow="+flow;

	if(this.date != null) {
		url += "&";
		url += "from="+this.date;
		url += "&";
		url += "to="+this.date;
	}

	url += this.filters();

	d3.json(url, function(error, json) {
		if(error)
			console.log("can't download file " + this.stationFlowUrl);

		callback(json);
	}.bind(this));
}

DataManager.prototype.getInOutFlow = function(callback) {

	if(this.selectedStations.length == 0) {
		callback([]);
		return;
	}

	var url = this.stationUrl;
	url += "?";

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

	url += this.filters();

	queue()
	.defer(d3.json, url+"&demographic=IN")
	.defer(d3.json, url+"&demographic=OUT")
	.await(function(error, inflow, outflow) {
		if(error)
			console.log("can't download file " + this.stationUrl);

		callback(inflow, outflow);
	}.bind(this));
}

/*
	Get the ride distribution
*/
DataManager.prototype.getRideDistribution = function(callback) {

	var url = this.rideUrl;

	url += "?"+this.filters();

	/*
	if(this.tripDistanceDistribution != null)
		callback(this.tripDistanceDistribution);
	else
	*/
	queue()
	.defer(d3.json, url+"?limit=100000&start=0")
	.defer(d3.json, url+"?limit=100000&start=100000")
	.defer(d3.json, url+"?limit=100000&start=200000")
	.defer(d3.json, url+"?limit=100000&start=300000")
	.defer(d3.json, url+"?limit=100000&start=400000")
	.defer(d3.json, url+"?limit=100000&start=500000")
	.defer(d3.json, url+"?limit=100000&start=600000")
	.defer(d3.json, url+"?limit=100000&start=700000")
	.defer(d3.json, url+"?limit=100000&start=800000")
	.defer(d3.json, url+"?limit=100000&start=900000")
	.await(function(error,
					json0,
					json1,
					json2,
					json3,
					json4,
					json5,
					json6,
					json7,
					json8,
					json9) {
		var data = json0.concat(json1);
		var data = data.concat(json2);
		var data = data.concat(json3);
		var data = data.concat(json4);
		var data = data.concat(json5);
		var data = data.concat(json6);
		var data = data.concat(json7);
		var data = data.concat(json8);
		var data = data.concat(json9);
		if(error)
			console.log("can't download file " + this.rideUrl);

		this.tripDistanceDistribution = data;

		callback(data);
	}.bind(this));
}

DataManager.prototype.filterDataModality = function(d) {
	data = [];

	if(this.selectionMode == "DOUBLE" && this.selectedStations.length >= 2) {
		// Filter data
		for(var i in d) {
			if((d[i].from_station_id == this.selectedStations[0].id &&
				d[i].to_station_id == this.selectedStations[1].id) ||
			   (d[i].from_station_id == this.selectedStations[1].id &&
				d[i].to_station_id == this.selectedStations[0].id))
				data.push(d[i]);
		}
	}
	else {
		data = d;
	}

	return data;
}

DataManager.prototype.filters = function() {
	/*
	this.gender = null;			// "MALE" | "FEMALE" | "UNKNOWN"
	this.age = null;			// expected a vector [minAge, maxAge]
	this.customerType = null;	// "CUSTOMER" | "SUBSCRIBER"
	*/
	var url = "";

	if(this.gender != null) {
		url+="&gender="+this.gender.toLowerCase();
	}

	if(this.age != null) {
		url+="&age_min="+this.age[0];
		url+="&age_max="+this.age[1];
	}

	if(this.customerType != null) {
		url+="&customer_type="+this.customerType.toLowerCase();
	}

	return url;
}