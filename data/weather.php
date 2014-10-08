<?php

/*

possible conditions:
			Clear
			Drizzle
			Fog
			Haze
			Heavy Drizzle
			Heavy Rain
			Heavy Thunderstorms and Rain
			Light Drizzle
			Light Freezing Drizzle
			Light Rain
			Light Snow
			Light Thunderstorms and Rain
			Mist
			Mostly Cloudy
			Overcast
			Partly Cloudy
			Rain
			Scattered Clouds
			Smoke
			Snow
			Thunderstorm
			Thunderstorms and Rain
			Unknown

*/

require_once 'private/mysqli.int';

header('Access-Control-Allow-Origin: *'); 


class Weather {
	public $date = "";
	public $temperature = "";
	public $humidity = "";
	public $visibility = "";
	public $wind_direction = "";
	public $wind_speed = "";
	public $conditions = "";
}

$from = htmlentities($_GET['from']);
if($from == NULL)
	$from = "2000-1-1";

$to = htmlentities($_GET['to']);
if($to == NULL)
	$to = "2100-12-31";

$database = new DataBaseMySQL();

	$database->query("SELECT *
					  FROM WEATHER
					  WHERE date >= '$from 00:00' AND date <= '$to 23:59'
					");

$reply = [];

$row = $database->fetch_next_row();
while($row) {

	$t = new Weather();
	$t->date = $row['date'];
	$t->temperature = floatval($row['temperature']);
	$t->humidity = floatval($row['humidity']);
	$t->visibility = floatval($row['visibility']);
	$t->wind_direction = $row['wind_direction'];
	$t->wind_speed = floatval($row['wind_speed']);
	$t->conditions = $row['conditions'];
	$row = $database->fetch_next_row();

	array_push($reply, $t);
}

echo json_encode($reply);

?>