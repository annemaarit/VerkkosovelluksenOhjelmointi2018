<?php
	$alku  = urlencode($_REQUEST['alku']);
	$loppu = urlencode($_REQUEST['loppu']);
	$urli = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=".$alku."&destinations=".$loppu."&key=AIzaSyDyJh0Tff1nL8NApdNUO8ENmcn6xmzDhmM";
	$data = file_get_contents($urli);
	header("Access-Control-Allow-Origin: *");
	header("Content-type: application/json");
	//print $data;
	print json_encode(json_decode($data));
?>