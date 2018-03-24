<?php
$id = explode('=',$_SERVER["QUERY_STRING"],2);

$data = array ('foo' => 'bar');
$data = http_build_query($data);

$opts = array (
	'http' => array (
		'method' => 'POST',
		'header'=> 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1' .
		'Content-Length: ' . strlen($data) . 'rn',
		'content' => $data
	)
);

$context = stream_context_create($opts);
$html = file_get_contents('http://m.kugou.com/singer/info/'. $id[1] .'&json=true', false, $context);

echo $html;
?>