<?php

/*
 * table manipulation class 
 * in:  rq -- cmd  
 *      rq -- group based select
 *
 * @package Application
 * @author Vallo Reima
 * @copyright (C)2013
 */

class Tables {

  private $cmd;      /* query type */
  private $hgt;      /* tbody height */
  private $flds;  /* fields list */
  private $cols;  /* column names */
  public $cnt;      /* records count */
  public $err = ''; /* error info */

  public function __construct($cmd, $slt = [])
  /*
   * in:  cmd -- B - browse
   *             O - output
   *             R - report
   *      slt -- select conditions:
   *              grp -- group id
   *              knd -- afl - affiliates
   *                     inh - inherited
   */ {
    $this->cmd = $cmd;
    $fld = [];
    $jns = [];
    $cnd = [];
    $ops = [];
    if ($cmd == 'R') {
      $this->Report($slt, $fld, $jns, $cnd, $ops);
    } else {
      $this->Browse($slt, $fld, $jns, $cnd, $ops);
    }
    if (¤::_('db')->Query($fld, $jns, $cnd, $ops)) {
      $hgt = isset($slt['grp']) ? 'grp' : 'cts';
      $this->hgt = ¤::Config("set/$hgt");       /* tbody height */
    } else {
      $this->err = ¤::_('db')->Error();
    }
  }

  private function Browse($slt, &$fld, &$jns, &$cnd, &$ops) {
    $fld['contacts'] = '*';
    $fld['towns'] = ['name/town', '1/count'];
    $jns = array_merge($jns, ['j', 'a.town_id=b.id']);
    if (!empty($slt['grp'])) {
      $fld['cgroups'] = [];
      $cnd['c.group_id'] = $slt['grp'];
      $jns = array_merge($jns, ['j', 'a.id=c.contact_id']);
    }
    $ops['ord'] = 'a.fname,a.lname';
  }

  private function Report($slt, &$fld, &$jns, &$cnd, &$ops) {
    $fld['contacts'] = ['id', "CONCAT_WS(' ',a.fname, a.lname)/name"];
    $fld['cgroups'] = [];
    $jns = array_merge($jns, ['lj', 'a.id = b.contact_id', 'lj', 'b.group_id = c.id']);
    if ($slt['knd'] == 'afl') { /* groups affiliates */
      $fld['groups'] = ['GROUP_CONCAT(c.name ORDER BY c.name SEPARATOR " ")/groups', 'COUNT(*)/count'];
      if (!empty($slt['grp'])) {
        $cnd['b.group_id'] = $slt['grp']; /* specified group only */
      }
    } else { /* where to inherited */
      $fld['groups'] = ["GROUP_CONCAT(CONCAT_WS('&gt;',e.name,c.name) ORDER BY c.name SEPARATOR ' ')/groups", 'COUNT(*)/count'];
      $fld['inherits'] = [];
      $fld['Groups'] = [];
      $jns = array_merge($jns, ['j', 'b.id = d.cgroup_id', 'j', 'd.group_id = e.id']);
      if (!empty($slt['grp'])) {
        $cnd['d.group_id'] = $slt['grp']; /* from group */
      }
    }
    $ops['grp'] = 'a.fname,a.lname';
  }

  public function Display()
  /*
   * form html
   */ {
    if ($this->cmd == 'B') {
      $this->flds = ['fname', 'lname', 'street', 'zip', 'town'];
    } else {
      $this->flds = ['name', 'groups'];
    }
    $this->cols = ['id' => '0'];
    foreach ($this->flds as $fld) {
      $this->cols[$fld] = ¤::_('txt.fld')[$fld];
    }
    $nme = mb_strtolower(basename(__FILE__, EXT));
    ob_start();
    include TPLD . $nme . TPL;
    $htm = ob_get_clean();
    return $htm;
  }

  private function Rows()
  /*
   * form table body rows
   * in:  rows -- rows array
   *      fld -- field names
   */ {
    $htm = '';
    $i = 0;
    $n = 0;
    while ($row = ¤::_('db')->Record()) {
      $i++;
      $htm .= $this->Row($row, $i);
      $n = $n + $row['count'];
    }
    ¤::_('db')->Release();
    $this->cnt = $n;
    return $htm;
  }

  private function Row($row, $cnt)
  /*
   * form table row htm
   * in:  row -- row data
   *      cnt -- row number
   *      fld -- field names
   */ {
    $c = $this->cmd;
    $htm = '<tr id="id' . $row['id'] . '">' . PHP_EOL;
    $htm .= '<td class="' . $c . '1">' . $cnt . '</td>' . PHP_EOL;
    for ($i = 0; $i < count($this->flds); $i++) {
      $htm .= '<td class="' . $c . ($i + 2) . '">' . $row[$this->flds[$i]] . '</td>' . PHP_EOL;
      ;
    }
    $htm .= '</tr>' . PHP_EOL;
    return $htm;
  }

  public function Output()
  /*
   * create xml file
   */ {
    $doc = new DOMDocument(¤::_('cfg.version'), ¤::_('cfg.encoding'));
    $doc->preserveWhiteSpace = false;
    $doc->formatOutput = true;
    $root = $doc->createElement('contacts');
    $root = $doc->appendChild($root);
    while ($row = ¤::_('db')->Record()) {
      $ctct = $doc->createElement('contact');
      $ctct = $root->appendChild($ctct);
      foreach ($row as $key => $val) {
        $chld = $doc->createElement($key);
        $chld = $ctct->appendChild($chld);
        //add data to the new element
        $txt = $doc->createTextNode($val);
        $txt = $chld->appendChild($txt);
      }
    }
    ¤::_('db')->Release();
    $wkf = ¤::WorkFile('xml');
    if (!$wkf || !$doc->save($wkf)) {
      $wkf = '';
      $this->err = ¤::_('txt.saverr');
    }
    return $wkf;
  }

}

?>
