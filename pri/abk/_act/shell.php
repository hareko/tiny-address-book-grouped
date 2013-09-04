<?php

/*
 * layout creator
 *
 * @package Application
 * @author Vallo Reima
 * @copyright (C)2013
 */
$sets = ¤::XmlSubArray('set');

¤::$_->_ts = ['lng' => ¤::_('lng'),
    'url' => ¤::_('url'),
    'prpmt' => ¤::_('txt.prpmt'),
    'noxhr' => ¤::_('txt.noxhr'),
    'addg' => ¤::_('txt.addg'),
    'mdfg' => ¤::_('txt.mdfg'),
    'undg' => ¤::_('txt.undg'),
    'brng' => ¤::_('txt.brng'),
    'inhg' => ¤::_('txt.inhg'),
    'rptg' => ¤::_('txt.rptg'),
    'delcfm' => ¤::_('txt.delcfm'),
    'rmvcfm' => ¤::_('txt.rmvcfm'),
    'edtcfm' => ¤::_('txt.edtcfm'),
    'msd' => ¤::_('txt.msd'),
    'tst' => ¤::_('txt.msd'),
    'wrd' => ¤::_('txt.wrd'),
    'dev' => DEV
];

$btn = ['C' => ['cts', ¤::_('txt.cts')], 'G' => ['grp', ¤::_('txt.grp')], 'E' => ['end', ¤::_('txt.end')]];
$hgt = ¤::Config("set/shl");
$base = 'base';
$nme = basename(__FILE__, EXT); /* example's filename */
include TPLD . $nme . TPL; /* fill template */
?>