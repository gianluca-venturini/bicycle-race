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
	public $count = "";
	public $from_meters = "";
	public $to_meters = "";
}

// Number of categories
$categories = htmlentities($_GET['categories']);

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

$reply = [];

for($i=0; $i<$categories; $i++) {

	$database->query("SELECT COUNT(*) as count,
						(SELECT MAX(meters)
						 FROM TRIP)/$categories*$i	as from_meters,
						(SELECT MAX(meters)
						 FROM TRIP)/$categories*($i+1) as to_meters
					  FROM TRIP
					  WHERE gender LIKE '$gender'
						AND usertype LIKE '$costumerType'
						AND ((age_in_2014 >= '$ageMin' AND age_in_2014 <= '$ageMax') OR '1'='$ageDisabled')
						AND meters >= (
											(SELECT MAX(meters)
						 				 	 FROM TRIP) -
											(SELECT MIN(meters)
						 				 	 FROM TRIP)
									  )/$categories*$i
						AND meters < (
											(SELECT MAX(meters)
						 				 	 FROM TRIP) -
											(SELECT MIN(meters)
						 				 	 FROM TRIP)
									  )/$categories*($i+1)");



	$row = $database->fetch_next_row();
	while($row) {

		$t = new Bike();
		$t->count = intval($row['count']);
		$t->from_meters = $row['from_meters'];
		$t->to_meters = $row['to_meters'];
	  
		$row = $database->fetch_next_row();

		array_push($reply, $t);
	}
}

echo json_encode($reply);

?>