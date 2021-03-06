<?php

/*

station?stations=1,2,3,4
		aggregate=yes

*/

require_once 'private/mysqli.int';

header('Access-Control-Allow-Origin: *'); 

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

$from = htmlentities($_GET['from']);
if($from == NULL)
	$from = "2000-1-1";

$to = htmlentities($_GET['to']);
if($to == NULL)
	$to = "2100-12-31";

$aggregate = htmlentities($_GET['aggregate']);
if($aggregate != NULL)
	$aggregate = True;

// Filters
$gender = htmlentities($_GET['gender']);
$ageMin = htmlentities($_GET['age_min']);
$ageMax = htmlentities($_GET['age_max']);
$costumerType = htmlentities($_GET['customer_type']);

if($gender == NULL)
	$gender="%";

$ageDisabled="0";
if($ageMax == NULL || $ageMax == NULL)
	$ageDisabled="1";

if($costumerType == NULL)
	$costumerType="%";


$database = new DataBaseMySQL();


if($aggregate != True) {
	$database->query("	SELECT S.id, age_in_2014 as age, COUNT(*) as count
						FROM TRIP T, STATION S
						WHERE S.id = T.from_station_id
							AND age_in_2014 <> '0'
							AND (id IN ($ids) OR '$idDisabled'='1')
							AND (startdate >= '$from 00:00' AND startdate <= '$to 23:59')
						GROUP BY age_in_2014, S.id
						ORDER BY S.id, age
					");


	$reply = [];

	$row = $database->fetch_next_row();
	$t = new Station();
	$t->ages = [];
	while($row) {

		if($t->id != $row['id']) {
			if($t->id != NULL)
				array_push($reply, $t);
		}

		$t->id = $row['id'];
		$a = new Age();
		$a->age = $row['age'];
		$a->count = $row['count'];
		array_push($t->ages, $a);
	  
		$row = $database->fetch_next_row();
	}

	if($t->id != NULL)
		array_push($reply, $t);

	echo json_encode($reply);
}
else {
	$database->query("	SELECT age_in_2014 as age, COUNT(*) as count
						FROM TRIP T, STATION S
						WHERE S.id = T.from_station_id
							AND age_in_2014 <> '0'
							AND (id IN ($ids) OR '$idDisabled'='1')
							AND (startdate >= '$from 00:00' AND startdate <= '$to 23:59')
							AND gender LIKE '$gender'
							AND usertype LIKE '$costumerType'
							AND ((age_in_2014 >= '$ageMin' AND age_in_2014 <= '$ageMax') OR '1'='$ageDisabled')
						GROUP BY age_in_2014
						ORDER BY age
					");


	$reply = [];

	$row = $database->fetch_next_row();
	$t = new Station();
	$t->ages = [];
	$t->id = '0';
	while($row) {

		$a = new Age();
		$a->age = $row['age'];
		$a->count = $row['count'];
		array_push($t->ages, $a);
	  
		$row = $database->fetch_next_row();
	}

	array_push($reply, $t);

	echo json_encode($reply);
}

?>