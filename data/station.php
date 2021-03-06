<?php

/*

station?station=1,2,3,4&demographic=NONE

demographic: NONE | IN | OUT

*/

require_once 'private/mysqli.int';

header('Access-Control-Allow-Origin: *'); 


class Station {
	public $id = "";
	public $name = "";
	public $popularity = "";
	public $latitude  = "";
	public $longitude  = "";
	public $launch_date  = "";
	public $male  = "";
	public $female  = "";
	public $unknown  = "";
	public $customer  = "";
	public $subscriber  = "";
}

$ids = htmlentities($_GET['stations']);
if($ids == NULL) {
	$ids = "-1";
	$idDisabled = 1;
}
else
	$idDisabled = 0;

$demographic = htmlentities($_GET['demographic']);
if($demographic == NULL) {
	$demographic = "NONE";
}

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

switch($demographic) {

	case "NONE":
		$database->query("	SELECT id, name, latitude, longitude, launch_date, popularity
							FROM STATION
							WHERE (id IN ($ids) OR '$idDisabled'='1')
						");
		break;

	case "IN":
		$database->query("	SELECT id, 
								   name, 
								   latitude, 
								   longitude, 
								   launch_date, 
								   (SELECT COUNT(*)
								    FROM TRIP
								   	WHERE from_station_id = S.id
								   	AND gender = 'Male'
								   	AND gender LIKE '$gender'
                                    AND usertype LIKE '$costumerType'
                                    AND ((age_in_2014 >= '$ageMin' AND age_in_2014 <= '$ageMax') OR '1'='$ageDisabled')) AS male,
								   	(SELECT COUNT(*)
								   	FROM TRIP
								   	WHERE from_station_id = S.id
								   	AND gender = 'Female'
								   	AND gender LIKE '$gender'
                                    AND usertype LIKE '$costumerType'
                                    AND ((age_in_2014 >= '$ageMin' AND age_in_2014 <= '$ageMax') OR '1'='$ageDisabled')) AS female,
								   	(SELECT COUNT(*)
								   	FROM TRIP
								   	WHERE from_station_id = S.id
								   	AND usertype = 'Customer'
								   	AND gender LIKE '$gender'
                                    AND usertype LIKE '$costumerType'
                                    AND ((age_in_2014 >= '$ageMin' AND age_in_2014 <= '$ageMax') OR '1'='$ageDisabled')) AS customer,
								   	(SELECT COUNT(*)
								   	FROM TRIP
								   	WHERE from_station_id = S.id
								   	AND usertype = 'Subscriber'
								   	AND gender LIKE '$gender'
                                    AND usertype LIKE '$costumerType'
                                    AND ((age_in_2014 >= '$ageMin' AND age_in_2014 <= '$ageMax') OR '1'='$ageDisabled')) AS subscriber
									FROM STATION S
									WHERE (id IN ($ids) OR '$idDisabled'='1')
						");
		break;

	case "OUT":
		$database->query("	SELECT id, 
								   name, 
								   latitude, 
								   longitude, 
								   launch_date, 
								   (SELECT COUNT(*)
								    FROM TRIP
								   	WHERE to_station_id = S.id
								   	AND gender = 'Male'
								   	AND gender LIKE '$gender'
                                    AND usertype LIKE '$costumerType'
                                    AND ((age_in_2014 >= '$ageMin' AND age_in_2014 <= '$ageMax') OR '1'='$ageDisabled')) AS male,
								   	(SELECT COUNT(*)
								   	FROM TRIP
								   	WHERE to_station_id = S.id
								   	AND gender = 'Female'
								   	AND gender LIKE '$gender'
                                    AND usertype LIKE '$costumerType'
                                    AND ((age_in_2014 >= '$ageMin' AND age_in_2014 <= '$ageMax') OR '1'='$ageDisabled')) AS female,
								   	(SELECT COUNT(*)
								   	FROM TRIP
								   	WHERE to_station_id = S.id
								   	AND usertype = 'Customer'
								   	AND gender LIKE '$gender'
                                    AND usertype LIKE '$costumerType'
                                    AND ((age_in_2014 >= '$ageMin' AND age_in_2014 <= '$ageMax') OR '1'='$ageDisabled')) AS customer,
								   	(SELECT COUNT(*)
								   	FROM TRIP
								   	WHERE to_station_id = S.id
								   	AND usertype = 'Subscriber'
								   	AND gender LIKE '$gender'
                                    AND usertype LIKE '$costumerType'
                                    AND ((age_in_2014 >= '$ageMin' AND age_in_2014 <= '$ageMax') OR '1'='$ageDisabled')) AS subscriber
									FROM STATION S
									WHERE (id IN ($ids) OR '$idDisabled'='1')
						");
		break;
}

$reply = [];

$row = $database->fetch_next_row();
while($row) {

	$t = new Station();
	$t->id = intval($row['id']);
	$t->name = $row['name'];
	$t->latitude = $row['latitude'];
	$t->longitude = $row['longitude'];
	$t->popularity = $row['popularity'];
	$t->launch_date = $row['launch_date'];
	$t->male = $row['male'];
	$t->female = $row['female'];
	$t->unknown = $row['customer'];
	$t->customer = $row['customer'];
	$t->subscriber = $row['subscriber'];
  
	$row = $database->fetch_next_row();

	array_push($reply, $t);
}

echo json_encode($reply);

?>