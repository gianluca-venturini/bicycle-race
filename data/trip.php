<?php

require_once 'private/mysqli.int';


class Travel {
	public $count = "";
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
	$from = "1-1-2000";

$to = htmlentities($_GET['to']);
if($to == NULL)
	$to = "31-12-2100";


$database = new DataBaseMySQL();

$database->query("SELECT COUNT(*) as count, from_station_id, to_station_id 
				  FROM TRIP 
				  WHERE (from_station_id IN ($ids) OR to_station_id IN ($ids) OR '$idDisabled'='1')
				  	AND (startdate >= '$from' AND startdate <= '$to')
				  GROUP BY from_station_id, to_station_id");

$reply = [];

$row = $database->fetch_next_row();
while($row) {

	$t = new Travel();
	$t->count = intval($row['count']);
	$t->fromStation = $row['from_station_id'];
	$t->toStation = $row['to_station_id'];
  
	$row = $database->fetch_next_row();

	array_push($reply, $t);
}

echo json_encode($reply);

?>