<?php

/*
 * bye panel creator
 *
 * @package     Application
 * @author      Vallo Reima
 * @copyright   (C)2013
 */
$msgs[0] = ¤::_('txt.tnk');
$msgs[1] = '';
$msgs[2] = ¤::_('txt.slo');
ob_start();
echo '<div class="wrapper">';
include(TPLD . 'exit' . TPL);
echo '</div>';
$htm = ob_get_clean();
$rsp = ['code' => 'ok', 'string', 'factor' => $htm];
echo json_encode($rsp);
?>