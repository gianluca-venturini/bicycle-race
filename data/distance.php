<?php

require_once 'private/mysqli.int';


class Bike {
	public $bikeid = "";
	public $totaldistance = "";
}

$database = new DataBaseMySQL();

$database->query("SELECT bikeid, SUM(meters) as totaldistance
				  FROM TRIP
				  GROUP BY bikeid
				  ORDER BY totaldistance DESC");

$reply = [];

$row = $database->fetch_next_row();
while($row) {

	$t = new Bike();
	$t->bikeid = intval($row['bikeid']);
	$t->totaldistance = $row['totaldistance'];
  
	$row = $database->fetch_next_row();

	array_push($reply, $t);
}

echo json_encode($reply);

?>