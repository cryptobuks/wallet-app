<?php

$db_m  = "mysql";
$db_hw = "47.104.143.63";
$db_hr = "118.190.201.194";
$db_d  = "wallet";
$db_ur = "data_reader";
$db_pr = "let90!r#";

$conr = new PDO($db_m.':host='.$db_hr.';dbname='.$db_d, $db_ur, $db_pr);

?>
