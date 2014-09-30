<?php

/*

station?station=1,2,3,4

*/

require_once 'private/mysqli.int';

class Station {
	public $id = NULL;
	public $ages = NULL;
}

class Age {
	public $age = NULL;
	public $count = NULL;
}

$ids = htmlentities($_GET['stations']);
if($ids == NULL) {
	$ids = "-1";
	$idDisabled = 1;
}
else
	$idDisabled = 0;

$database = new DataBaseMySQL();


$database->query("	SELECT S.id, age_in_2014 as age, COUNT(*) as count
					FROM TRIP T, STATION S
					WHERE S.id = T.from_station_id
						AND age_in_2014 <> '0'
					GROUP BY age_in_2014, S.id
					ORDER BY S.id
				");


$reply = [];

$row = $database->fetch_next_row();
$t = new Station();
$t->ages = [];
while($row) {

	if($t->id != $row['id']) {
		if($t->id != NULL)
			array_push($reply, $t);
		$t->id = $row['id'];
		$a = new Age();
		$a->age = $row['age'];
		$a->count = $row['count'];
		array_push($t->ages, $a);
	}
  
	$row = $database->fetch_next_row();
}

if($t->id != NULL)
	array_push($reply, $t);

echo json_encode($reply);

?>