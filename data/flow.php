<?php

require_once 'private/mysqli.int';

header('Access-Control-Allow-Origin: *'); 

class Station {
	public $id = NULL;
	public $count = NULL;
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

$flow = htmlentities($_GET['flow']);
if($flow == NULL && $flow != "IN" && $flow != "OUT") {
	echo "Error: select a flow between IN and OUT";
	exit(1);
}

$station = htmlentities($_GET['station']);
if($station == NULL) {
	echo "Error: select a station";
	exit(1);
}

$database = new DataBaseMySQL();

if($flow == "IN")

	$database->query("	SELECT S.id, COUNT(*) as count
						FROM TRIP T, STATION S
						WHERE S.id = T.to_station_id
							AND T.from_station_id LIKE '$station'
							AND (startdate >= '$from 00:00' AND startdate <= '$to 23:59')
						GROUP BY S.id
						ORDER BY S.id
					");

else if($flow == "OUT")

	$database->query("	SELECT S.id, COUNT(*) as count
						FROM TRIP T, STATION S
						WHERE S.id = T.from_station_id
							AND T.to_station_id LIKE '$station'
							AND (startdate >= '$from 00:00' AND startdate <= '$to 23:59')
						GROUP BY S.id
						ORDER BY S.id
					");


$reply = [];

$row = $database->fetch_next_row();

while($row) {

	$t = new Station();
	$t->id = $row['id'];
	$t->count = $row['count'];

	array_push($reply, $t);

	$row = $database->fetch_next_row();
}

echo json_encode($reply);

?>