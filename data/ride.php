<?php

require_once 'private/mysqli.int';

header('Access-Control-Allow-Origin: *'); 

$limit = htmlentities($_GET['limit']);
if($limit == NULL) {
	$limit = "100";
}


class Bike {
	public $bikeid = "";
	public $meters = "";
}

$database = new DataBaseMySQL();

$database->query("SELECT bikeid, meters
				  FROM TRIP
				  ORDER BY meters DESC
				  LIMIT $limit");

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