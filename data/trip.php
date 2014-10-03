<?php

/*

trip.php?stations=1,2,3&from=2012-01-31&to=2020-06-12

stations: list of stations
from: initial date
to: final date

aggregate: DAY_WEEK | DAY_YEAR | HOUR_DAY
coordinates: TRUE

*/

require_once 'private/mysqli.int';

header('Access-Control-Allow-Origin: *'); 


class Travel {
	public $count = "";
	public $hour = "";
	public $day = "";
	public $fromStation = "";
	public $toStation  = "";
	public $starttime = "";
	public $stoptime = "";
	public $from_lat = "";
	public $from_lon = "";
	public $to_lat = "";
	public $to_lon = "";
}

$ids = htmlentities($_GET['stations']);
if($ids == NULL) {
	$ids = "-1";
	$idDisabled = 1;
}
else
	$idDisabled = 0;


$from = htmlentities($_GET['from']);
if($from == NULL)
	$from = "2000-1-1";

$to = htmlentities($_GET['to']);
if($to == NULL)
	$to = "2100-12-31";

$aggregate = htmlentities($_GET['aggregate']);
$coordinates = htmlentities($_GET['coordinates']);


$database = new DataBaseMySQL();

switch($aggregate) {

	case "DAY_WEEK":
		$database->query("
							SELECT COUNT(*) as count, DATE_FORMAT(startdate,'%a') as day, from_station_id
							FROM TRIP 
						 	WHERE (from_station_id IN ($ids) OR '$idDisabled'='1')
								AND (startdate >= '$from 00:00' AND startdate <= '$to 23:59')
						 	GROUP BY DATE_FORMAT(startdate,'%a'), from_station_id
						");
		breaK;

	case "DAY_YEAR":
		$database->query("SELECT COUNT(*) as count, DATE_FORMAT(startdate,'%Y-%c-%e') as day, from_station_id
						  FROM TRIP
						  WHERE (from_station_id IN ($ids) OR '$idDisabled'='1')
						  	AND (startdate >= '$from 00:00' AND startdate <= '$to 23:59')
						  GROUP BY DATE_FORMAT(startdate,'%Y-%c-%e'), from_station_id
						");
		breaK;

	case "HOUR_DAY":
		$database->query("SELECT COUNT(*) as count, DATE_FORMAT(startdate,'%k') as hour, from_station_id
						  FROM TRIP 
						  WHERE (from_station_id IN ($ids) OR '$idDisabled'='1')
						  	AND (startdate >= '$from 00:00' AND startdate <= '$to 23:59')
						  GROUP BY DATE_FORMAT(startdate,'%k'), from_station_id
						");
		breaK;

	default:

		if($coordinates == "TRUE") {
			$database->query("SELECT from_station_id, 
									 to_station_id, 
									 DATE_FORMAT(startdate, '%H:%i') as starttime,
									 DATE_FORMAT(stopdate, '%H:%i') as stoptime,
									 S1.latitude as from_lat,
									 S1.longitude as from_lon,
									 S2.latitude as to_lat,
									 S2.longitude as to_lon
							  FROM TRIP T, STATION S1, STATION S2
							  WHERE (from_station_id IN ($ids) OR to_station_id IN ($ids) OR '$idDisabled'='1')
							  	AND (startdate >= '$from 00:00' AND startdate <= '$to 23:59')
							  	AND S1.id = T.from_station_id
							  	AND S2.id = T.to_station_id
							");
		}
		else
			$database->query("SELECT from_station_id, 
									 to_station_id, 
									 DATE_FORMAT(startdate, '%H:%i') as starttime,
									 DATE_FORMAT(stopdate, '%H:%i') as stoptime
							  FROM TRIP 
							  WHERE (from_station_id IN ($ids) OR to_station_id IN ($ids) OR '$idDisabled'='1')
							  	AND (startdate >= '$from' AND startdate <= '$to 23:59')
							");
			
}

$reply = [];

$row = $database->fetch_next_row();
while($row) {

	$t = new Travel();
	$t->count = intval($row['count']);
	$t->fromStation = $row['from_station_id'];
	$t->toStation = $row['to_station_id'];
	$t->day = $row['day'];
	$t->hour = $row['hour'];
	$t->starttime = $row['starttime'];
	$t->stoptime = $row['stoptime'];
	$t->from_lat = $row['from_lat'];
	$t->from_lon = $row['from_lon'];
	$t->to_lat = $row['to_lat'];
	$t->to_lon = $row['to_lon'];
  
	$row = $database->fetch_next_row();

	array_push($reply, $t);
}

echo json_encode($reply);

?>