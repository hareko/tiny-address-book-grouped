<?php

/*
 * tables creator
 *
 * @package Application 
 * @author Vallo Reima
 * @copyright (C)2013
 */
$cmd = mb_strtoupper(¤::_('rq.cmd'));
$rsp = ['code' => 'ok', 'string' => '', 'factor' => ''];
$tbl = new Tables($cmd, ¤::_('rq.cnd'));
if ($tbl->err == '') {
  if ($cmd == 'O') {
    $rsp['string'] = ¤::_('txt.xml');
    $rsp['factor'] = ['fnm' => ¤::Config('db/nme') . CFG, 'wkf' => $tbl->Output()];
  } else {
    $rsp['factor'] = $tbl->Display();
    $rsp['string'] = ¤::mb_str_replace('#',$tbl->cnt,¤::_('txt.cnt'));
  }
}
if ($tbl->err != '') {
  $rsp['string'] = $tbl->err;
  $rsp['code'] = 'err';
}
echo json_encode($rsp);
?>
