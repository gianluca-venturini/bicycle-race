<?php

/*

station?station=1,2,3,4&demographic=NONE

demographic: NONE | IN | OUT

*/

require_once 'private/mysqli.int';


class Station {
	public $id = "";
	public $name = "";
	public $latitude  = "";
	public $longitude  = "";
	public $launch_date  = "";
	public $male  = "";
	public $female  = "";
	public $unknown  = "";
	public $customer  = "";
	public $subscriber  = "";
}

$ids = htmlentities($_GET['stations']);
if($ids == NULL) {
	$ids = "-1";
	$idDisabled = 1;
}
else
	$idDisabled = 0;

$demographic = htmlentities($_GET['demographic']);
if($demographic == NULL) {
	$demographic = "NONE";
}

$database = new DataBaseMySQL();

switch($demographic) {

	case "NONE":
		echo "none";
		$database->query("	SELECT id, name, latitude, longitude, launch_date
							FROM STATION
							WHERE (id IN ($ids) OR '$idDisabled'='1')
						");
		break;

	case "IN":
		echo "IN";
		$database->query("	SELECT id, 
								   name, 
								   latitude, 
								   longitude, 
								   launch_date, 
								   (SELECT COUNT(*)
								    FROM TRIP
								   	WHERE from_station_id = S.id
								   	AND gender = 'Male'	) AS male,
								   	(SELECT COUNT(*)
								   	FROM TRIP
								   	WHERE from_station_id = S.id
								   	AND gender = 'Female') AS female,
								   	(SELECT COUNT(*)
								   	FROM TRIP
								   	WHERE from_station_id = S.id
								   	AND usertype = 'Customer') AS customer,
								   	(SELECT COUNT(*)
								   	FROM TRIP
								   	WHERE from_station_id = S.id
								   	AND usertype = 'Subscriber') AS subscriber
									FROM STATION S
									WHERE (id IN ($ids) OR '$idDisabled'='1')
						");
		break;
}

$reply = [];

$row = $database->fetch_next_row();
while($row) {

	$t = new Station();
	$t->id = intval($row['id']);
	$t->name = $row['name'];
	$t->latitude = $row['latitude'];
	$t->longitude = $row['longitude'];
	$t->launch_date = $row['launch_date'];
	$t->male = $row['male'];
	$t->female = $row['female'];
	$t->unknown = $row['customer'];
	$t->customer = $row['customer'];
	$t->subscriber = $row['subscriber'];
  
	$row = $database->fetch_next_row();

	array_push($reply, $t);
}

echo json_encode($reply);

?>