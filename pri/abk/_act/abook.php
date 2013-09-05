<?php

/*
 * main panel creator 
 *
 * @package Application
 * @author Vallo Reima
 * @copyright (C)2013
 */
$fid = ¤::_('rq.mod');
$fld = ¤::_('db')->Fields('contacts');
foreach ($fld as $k => $v){
  $fld[$k]['nme'] = ¤::_('txt.fld')[$k];
}
$towns = ¤::_('db')->Fetch('towns', 'id,name', '', 'id', ['ord' => 'name']);
$cms = ['a','d','m','b','o','cl','r','cc','s'];
$nme = basename(__FILE__, EXT);
include TPLD . $nme . TPL;
?>