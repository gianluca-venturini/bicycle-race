<?php

/*

trip.php?stations=1,2,3&from=2012-01-31&to=2020-06-12

stations: list of stations
from: initial date
to: final date

aggregate: DAY_WEEK | DAY_MONTH | HOUR_DAY

*/

require_once 'private/mysqli.int';

header('Access-Control-Allow-Origin: *'); 


class Travel {
	public $count = "";
	public $hour = "";
	public $day = "";
	public $fromStation = "";
	public $toStation  = "";
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


$database = new DataBaseMySQL();

switch($aggregate) {

	case "DAY_WEEK":
		$database->query("
							SELECT COUNT(*) as count, DATE_FORMAT(startdate,'%a') as day 
							FROM TRIP 
						 	WHERE (from_station_id IN ($ids) OR to_station_id IN ($ids) OR '$idDisabled'='1')
								AND (startdate >= '$from' AND startdate <= '$to')
						 	GROUP BY DATE_FORMAT(startdate,'%a')
						 ");
		breaK;

	case "DAY_MONTH":
		$database->query("SELECT COUNT(*) as count, DATE_FORMAT(startdate,'%e') as day 
						  FROM TRIP 
						  WHERE (from_station_id IN ($ids) OR to_station_id IN ($ids) OR '$idDisabled'='1')
						  	AND (startdate >= '$from' AND startdate <= '$to')
						  GROUP BY DATE_FORMAT(startdate,'%e')");
		breaK;

	case "HOUR_DAY":
		$database->query("SELECT COUNT(*) as count, DATE_FORMAT(startdate,'%k') as hour 
						  FROM TRIP 
						  WHERE (from_station_id IN ($ids) OR to_station_id IN ($ids) OR '$idDisabled'='1')
						  	AND (startdate >= '$from' AND startdate <= '$to')
						  GROUP BY DATE_FORMAT(startdate,'%k')");
		breaK;

	default:

		$database->query("SELECT COUNT(*) as count, from_station_id, to_station_id 
						  FROM TRIP 
						  WHERE (from_station_id IN ($ids) OR to_station_id IN ($ids) OR '$idDisabled'='1')
						  	AND (startdate >= '$from' AND startdate <= '$to')
						  GROUP BY from_station_id, to_station_id");
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
  
	$row = $database->fetch_next_row();

	array_push($reply, $t);
}

echo json_encode($reply);

?>