<?php

require_once 'private/mysqli.int';

header('Access-Control-Allow-Origin: *'); 


class Bike {
	public $bikeid = "";
	public $totaltime = "";
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

$database->query("SELECT bikeid, SUM(seconds) as totaltime
				  FROM TRIP
				  WHERE gender LIKE '$gender'
					AND usertype LIKE '$costumerType'
					AND ((age_in_2014 >= '$ageMin' AND age_in_2014 <= '$ageMax') OR '1'='$ageDisabled')
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