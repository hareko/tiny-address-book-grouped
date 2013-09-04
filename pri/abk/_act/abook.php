<?php

/*
 * main panel creator
 *
 * @package Application
 * @author Vallo Reima
 * @copyright (C)2013
 */
$fid = ¤::_('rq.mod');
$towns = ¤::_('db')->Fetch('towns', 'id,name', '', 'id', ['ord' => 'name']);
$cms = ['a','d','m','b','o','cl','r','cc','s'];
$nme = basename(__FILE__, EXT);
include TPLD . $nme . TPL;
?>