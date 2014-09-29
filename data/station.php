<?php

require_once 'private/mysqli.int';


class Station {
	public $id = "";
	public $name = "";
	public $latitude  = "";
	public $longitude  = "";
	public $launch_date  = "";
}

$database = new DataBaseMySQL();

$database->query("SELECT * FROM STATION");

$reply = [];

$row = $database->fetch_next_row();
while($row) {

	$t = new Station();
	$t->id = intval($row['id']);
	$t->name = $row['name'];
	$t->latitude = $row['latitude'];
	$t->longitude = $row['longitude'];
	$t->launch_date = $row['launch_date'];
  
	$row = $database->fetch_next_row();

	array_push($reply, $t);
}

echo json_encode($reply);

?>