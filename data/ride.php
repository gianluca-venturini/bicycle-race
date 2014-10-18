<?php

require_once 'private/mysqli.int';

header('Access-Control-Allow-Origin: *'); 

$limit = htmlentities($_GET['limit']);
if($limit == NULL) {
	$limit = "100";
}

$start = htmlentities($_GET['start']);
if($start == NULL) {
	$start = "0";
}


class Bike {
	public $bikeid = "";
	public $meters = "";
}

$database = new DataBaseMySQL();

$database->query("SELECT bikeid, meters
				  FROM TRIP
				  ORDER BY meters DESC
				  LIMIT $start , $limit");

$reply = [];

$row = $database->fetch_next_row();
while($row) {

	$t = new Bike();
	$t->bikeid = intval($row['bikeid']);
	$t->meters = $row['meters'];
  
	$row = $database->fetch_next_row();

	array_push($reply, $t);
}

echo json_encode($reply);

?>