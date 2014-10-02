<?php

require_once 'private/mysqli.int';

header('Access-Control-Allow-Origin: *'); 


class Bike {
	public $bikeid = "";
	public $totaltime = "";
}

$database = new DataBaseMySQL();

$database->query("SELECT bikeid, SUM(seconds) as totaltime
				  FROM TRIP
				  GROUP BY bikeid
				  ORDER BY totaltime DESC");

$reply = [];

$row = $database->fetch_next_row();
while($row) {

	$t = new Bike();
	$t->bikeid = intval($row['bikeid']);
	$t->totaltime = $row['totaltime'];
  
	$row = $database->fetch_next_row();

	array_push($reply, $t);
}

echo json_encode($reply);

?>