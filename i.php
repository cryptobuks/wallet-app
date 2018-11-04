<?php

$uid = (int) $_POST["u"];
(is_null($uid) || $uid == 0) ? $uid = -1 : null;
if($uid < 1) 
{
    echo json_encode(array("msg" => "error"));
    exit;
}
 
$fn = "data/wi_$uid.json";

include_once("func/dbr.inc.php");

$wt_mac = array(1 => "BTC", 6 => "ETH", 9 => "EOS", 10 => "BNB",);
$wt_mar = array(2 => "XAU", 3 => "USD", 5 => "EUR", 4 => "CNY", );

$wt_ma = $wt_mac + $wt_mar;
ksort($wt_ma);

$sql = "SELECT wid FROM map_usr_wlt WHERE uid = ".$uid.";";
$dbr = $conr -> prepare($sql);
$dbr -> execute();
$res = $dbr -> fetchAll(PDO::FETCH_ASSOC);

foreach($res as $rr)
    $wlst_arr[] = $rr["wid"];

$wlst = implode(",", $wlst_arr);

if($wlst)
{
    $sql = "SELECT * FROM wallet_info WHERE wid in (".$wlst.");";
    $dbr = $conr -> prepare($sql);
    $dbr -> execute();
    $wif = $dbr -> fetchAll(PDO::FETCH_ASSOC);
}

foreach($wif as $ww)
{
    $h = substr($ww["w_addr"], 0, 6);
    $t = substr($ww["w_addr"], -6);
    $a = $h."...".$t;
    $w[] = array( $ww["w_type"] =>   
	array($a => sprintf("%0.3f", $ww["balance"])));
}

foreach($w as $vv)
{
    foreach($wt_ma as $k=>$v)
    {
        if(empty($x[$v])) $x[$v] = array();
        if(key($vv) == $k) $x[$v][key($vv[$k])] = $vv[$k][key($vv[$k])];
    }
}

foreach($wt_mac as $z)
    $out["coin_cryp"][$z] = $x[$z];
foreach($wt_mar as $z)
    $out["coin_real"][$z] = $x[$z];

foreach($wt_mac as $base)
    foreach($wt_mar as $quote)
        $out["fx_rate"][$base][$quote] = get_fxr($base, $quote); 

$jd = json_encode($out, JSON_NUMERIC_CHECK);

if(is_null($w))
{
    echo json_encode(array("msg" => "no_data"));
    exit; 
}

file_put_contents($fn, $jd);

session_destroy();

function get_fxr($b, $q)
{
   return 1.00;
} 
