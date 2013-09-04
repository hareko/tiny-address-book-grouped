<?php

/*
 * provide on-demand htm/css/js
 *
 * @package     Application
 * @author      Vallo Reima
 * @copyright   (C)2013
 */
$mod = ¤::_('rq.mod');
$module = ¤::Config("mod/$mod");
$slots = [/* slot types */
    [ACTD, EXT, 'htm'],
    [CSSD, '.css', 'css'],
    [JSD, '.js', 'js']
];
$rsp = ['code' => 'ok', 'string' => '', 'factor' => ''];

$slt = [];
foreach ($slots as $slot) {
  $file = $slot[0] . $module . $slot[1];
  if (¤::IsFile($file)) {
    ob_start();
    include($file);
    $slt[$slot[2]] = ob_get_clean();
  } else if ($slot != 'P') {
    $rsp['code'] = 'err';
    $rsp['string'] = ¤::_('txt.nomod') . ": $file";
    break;
  }
}
if ($rsp['code'] == 'ok'){
  $rsp['factor'] = $slt;
  $rsp['string'] = ucfirst($module);
}
echo json_encode($rsp);

?>
