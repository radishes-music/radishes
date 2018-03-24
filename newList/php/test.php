<?php
error_reporting(0);

$list = 0;
$listId = 0;
$rankid = 88;
$key = 'link';
$hash = 0;
$id = 0;
$test = 88;
$pageSize = 6;
$spit = array();
$spit = explode("&",$_SERVER["QUERY_STRING"]);
for($i=0;$i<count($spit);$i++){
	$temp = array();
	$temp = explode("=",$spit[$i]);
	if($temp[0] == 'list'){
		$temp2 = array();
		$temp2 = explode("=",$spit[$i]);
		$list = $temp2[1];
	}
	if($temp[0] == 'listId'){
		$temp2 = array();
		$temp2 = explode("=",$spit[$i]);
		$listId = $temp2[1];
	}
	if($temp[0] == 'rankid'){
		$temp2 = array();
		$temp2 = explode("=",$spit[$i]);
		$rankid = $temp2[1];
	}
	if($temp[0] == 'key'){
		$temp2 = array();
		$temp2 = explode("=",$spit[$i]);
		$key = $temp2[1];
	}
	if($temp[0] == 'hash'){
		$temp2 = array();
		$temp2 = explode("=",$spit[$i]);
		$hash = $temp2[1];
	}
	if($temp[0] == 'id'){
		$temp2 = array();
		$temp2 = explode("=",$spit[$i]);
		$id = $temp2[1];
	}
	if($temp[0] == 'test'){
		$temp2 = array();
		$temp2 = explode("=",$spit[$i]);
		$test = $temp2[1];
	}
	if($temp[0] == 'pageSize'){
		$temp2 = array();
		$temp2 = explode("=",$spit[$i]);
		$pageSize = $temp2[1];
	}
}
// api -> http://m.kugou.com
// search -> http://www.kugou.com/
// title -> http://mobilecdn.kugou.com/api/v3/search/song
$urlArray = array(
	'http://m.kugou.com/singer/class',// 获取歌手
	'http://m.kugou.com/plist/index',// 获取歌单
	'http://m.kugou.com/rank/list',// 获取音乐排行榜
	'http://m.kugou.com/rank/info',// 排行版分类歌曲列表
	'http://mobilecdn.kugou.com/api/v3/search/song',// 音乐搜索
	'http://www.kugou.com/yy/index.php',// 播放
	'http://m.kugou.com/singer/list/',// 获取歌手分类下面的歌手列表
	'http://m.kugou.com',// 获取最新音乐
	'http://m.kugou.com/plist/list/',// 获取最新音乐
	'http://m.kugou.com/singer/info/'
);

$opts = array (
	'http' => array (
		'method' => 'GET',
		'timeout'=>10
	)
);

$context = stream_context_create($opts);

if($list == 0){
	$urlArray[$list] = $urlArray[$list]. '&json=true';
	$html = file_get_contents($urlArray[$list], false, $context);
}
if($list == 1){
	$urlArray[$list] = $urlArray[$list]. '&json=true';
	$html = file_get_contents($urlArray[$list], false, $context);
}
if($list == 2){
	$urlArray[$list] = $urlArray[$list]. '&json=true';
	$html = file_get_contents($urlArray[$list], false, $context);
}

if($list == 3){
	$urlArray[$list] = $urlArray[$list] . '?rankid=' . $rankid . 'page=1' . '&json=true';
	$html = file_get_contents($urlArray[$list], false, $context);
}
if($list == 4){
	$urlArray[$list] = $urlArray[$list] . '?format=json&keyword=' . $key . '&page=1&pagesize='. $pageSize .'&showtype=1' . '&json=true';
	$html = file_get_contents($urlArray[$list], false, $context);
}
if($list == 5){
	$urlArray[$list] = $urlArray[$list] . '?r=play/getdata&hash=' . $hash . '&json=true';
	$html = file_get_contents($urlArray[$list], false, $context);
}
if($list == 6){
	$urlArray[$list] = $urlArray[$list] . $id . '?json=true';
	$html = file_get_contents($urlArray[$list], false, $context);
}
if($list == 7){
	$urlArray[$list] = $urlArray[$list] . '?json=true' . '&json=true';
	$html = file_get_contents($urlArray[$list], false, $context);
}
if($list == 8){
	$urlArray[$list] = $urlArray[$list] . '' . $listId . '?json=true' . '&json=true';
	$html = file_get_contents($urlArray[$list], false, $context);
}
if($list == 9){
	$urlArray[$list] = $urlArray[$list] . '' . $test . '?json=true';
	$html = file_get_contents($urlArray[$list], false, $context);
}

echo $html;
?>