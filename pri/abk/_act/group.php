<?php

/*
 * grouper
 *
 * @package     Application
 * @author      Vallo Reima
 * @copyright   (C)2013
 */
$fid = ¤::_('rq.mod');
$cms = ['a', 'rm', 'i', 'rp', 's', 'q', 'cc', 'o', 'cl'];
$groups = ¤::_('db')->Fetch('groups', 'id,name', '', 'id', ['ord' => 'name']);
$tbl = new Tables('B',['grp' => '']);
if ($tbl->err == '') {
  $nme = basename(__FILE__, EXT);
  include TPLD . $nme . TPL;
} else {
  echo $tbl->err;
}
?>