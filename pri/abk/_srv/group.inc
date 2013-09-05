<?php

/*
 * group data manipulation 
 * in:  rq -- cmd -- A - add
 *                   I - inherit
 *                   RM - remove
 *            fld -- grf - from group id
 *                   grt - to group id
 *                   opr - M (mutual)
 *                   ids - contact id's array
 * out: rsp -- code -- ok/err
 *             string - madd/mrmv/minh or error message
 *             factor - counters array
 * 
 * @package Application
 * @author Vallo Reima
 * @copyright (C)2013
 */

$cmd = ¤::_('rq.cmd');
$fld = ¤::_('rq.fld');
$tbl = 'cgroups';   /* group-contact relation */
¤::_('db')->Trans(null);  /* start transaction */
if ($cmd == 'A') {
  list($f, $s) = Insert($tbl, $fld);
} else if ($cmd == 'I') {
  list($f, $s) = Inherit($tbl, $fld);
} else if ($cmd == 'RM') {
  list($f, $s) = Delete($tbl, $fld);
} else {
  $f = [0, 0];
  $s = '';
}
if (!is_array($f)) {
  ¤::_('db')->Trans(false); /* problem encountered */
  $c = 'err';
} else if (!¤::_('db')->Trans(true)) {
  $s = ¤::_('txt.saverr');  /* not committed */
  $c = 'err';
} else {
  $c = 'ok';
}
$rsp = ['code' => $c, 'string' => $s, 'factor' => $f];
echo json_encode($rsp);

function Insert($tbl, $fld)
/*
 * insert members to the group
 * in:  tbl -- membership table
 *      fld -- grt - group id
 *             ids - id list
 * out: [0,<add cnt>] or false, <msg>
 */ {
  $f = true;
  $n = 0; /* adds counter */
  foreach ($fld['ids'] as $id) {
    if (¤::_('db')->Insert($tbl, ['group_id' => $fld['grt'], 'contact_id' => $id])) {
      $n++;   /* not existed, added */
    } else if (¤::_('db')->Error('code') != '1062') { /* not a duplicate error */
      $f = false;
      break;
    }
  }
  if ($f) {
    $f = [0, $n];
    $c = ¤::mb_str_replace('#', "$n/" . count($fld['ids']), ¤::_('txt.madd')); /* result info */
  } else {
    $c = ¤::_('db')->Error();
  }
  return [$f, $c];
}

function Inherit($tbl, $fld)
/*
 * inherit members from the group or mutually
 * in:  tbl -- membership table
 *      fld -- grf - from group id
 *             grt - to group id
 *             opr - M/''
 *             ids - id list
 * out: [<to grf cnt>, <to grt cnt>] or false, <msg> 
 */ {
  $inhs = [$fld['grf'] => ['grt' => $fld['grt'], 'ids' => $fld['ids']]];
  if ($fld['opr'] == 'M') { /* mutual inheritance */
    $b = [$tbl => [], 'contacts' => 'id', 'groups' => []];
    $a = ¤::_('db')->Fetch($b, ['j', 'a.contact_id=b.id', 'j', 'a.group_id=c.id'], ['a.group_id' => $fld['grt']]);
    if ($a) { /* add to-group member id's */
      $inhs[$fld['grt']] = ['grt' => $fld['grf'], 'ids' => $a];
    }
  }
  $cnt = [0, 0, 0, 0];  /* inherit & member counters */
  $i = 0;
  $f = true;
  foreach ($inhs as $grf => $inh) { /* loop from groups */
    $n = 0;
    foreach ($inh['ids'] as $id) { /* loop from group contacts */
      $cgi = ¤::_('db')->Fetch($tbl, 'id', ['group_id' => $inh['grt'], 'contact_id' => $id]);
      if (empty($cgi)) { /* new inherited member */
        $cgi = ¤::_('db')->Insert($tbl, ['group_id' => $inh['grt'], 'contact_id' => $id]);
      } else {
        $cgi = $cgi[0]; /* exists, make inherited if not yet */
      }
      if ($cgi) {
        if (¤::_('db')->Insert('inherits', ['group_id' => $grf, 'cgroup_id' => $cgi])) { /* insert if not yet */
          $n++;
        } else if (¤::_('db')->Error('code') != '1062') { /* not a duplicate error */
          $f = false;
          break;
        }
      } else {
        $f = false;
        break;
      }
    }
    if ($f) {
      $cnt[2] = $cnt[2] + $n;
      $cnt[3] = $cnt[3] + count($inh['ids']);
      $cnt[$i] = $n;
      $i++;
    } else {
      break;
    }
  }
  if ($f) {
    $f = [$cnt[1], $cnt[0]];
    $c = ¤::mb_str_replace('#', "$cnt[2]/$cnt[3]", ¤::_('txt.minh')); /* result info */
  } else {
    $c = ¤::_('db')->Error();
  }
  return [$f, $c];
}

function Delete($tbl, $fld)
/*
 * delete members from the group and single inheritances
 * in:  tbl -- membership table
 *      fld -- grf - group id
 *             ids - id list
 * out: [<del cnt>, 0] or false, <msg>
 */ {
  $f = true;
  $cnt = [0, 0]; /* deletes & inherits counter */
  $ids = [];      /* deleted member ids */
  foreach ($fld['ids'] as $id) {
    $a = ¤::_('db')->Fetch($tbl, 'id', ['a.group_id' => $fld['grf'], 'a.contact_id' => $id]); /* get the id */
    if (count($a) == 1) {
      $cgi = $a[0];
      $f = ¤::_('db')->Delete('inherits', ['cgroup_id' => $cgi]); /* remove possible inheritance */
      if (is_int($f)) {
        if ($f) {
          $cnt[1]++;  /* was inherited */
        }
        $f = ¤::_('db')->Delete($tbl, ['id' => $cgi]);  /* delete a member */
        if ($f) {
          $ids[] = $id;
          $cnt[0]++;
          $f = Remove(['inherits', $tbl], $fld['grf'], $id, $cnt);  /* remove inherits/members */
        } else {
          break;
        }
      } else {
        break;
      }
    } else {
      $f = 0;
      break;
    }
  }
  if ($f) {
    $f = $ids;
    $c = ¤::mb_str_replace('#1', $cnt[0], ¤::_('txt.mrmv'));
    $c = ¤::mb_str_replace('#2', $cnt[1], $c);   /* result info */
  } else if ($f === 0) {
    $c = ¤::_('txt.nodat') . ": $tbl";
  } else {
    $c = ¤::_('db')->Error();
  }
  return [$f, $c];
}

function Remove($tbs, $gid, $cid, &$cnt)
/*
 * remove inheritances
 * in:  tbs -- tables
 *      gid -- group id
 *      cid -- contact id
 *      cnt -- counters
 * out: [<del cnt>, 0] or false, <msg>
 */ {
  $f = true;
  $a = [$tbs[0] => ['id', 'cgroup_id'], $tbs[1] => []];
  $b = ['a.group_id' => $gid, 'b.contact_id' => $cid];
  $a = ¤::_('db')->Fetch($a, ['j', 'a.cgroup_id=b.id'], $b);
  for ($i = 0; $i < count($a); $i++) { /* remove inherits from the group for deleted contact */
    $f = ¤::_('db')->Delete($tbs[0], ['id' => $a[$i]['id']]); /* remove inherit */
    if ($f) {
      $cnt[1]++;
      if (¤::_('db')->Delete($tbs[1], ['id' => $a[$i]['cgroup_id']])) { /* remove single-inherited member  */
        $cnt[0]++;
      } else if (¤::_('db')->Error('code') != '1451') { /* not a restriction error */
        $f = false;
        break;
      }
    } else {
      break;
    }
  }
  return $f;
}

?>
