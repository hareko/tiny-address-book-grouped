/**
 * grouper class
 *
 * @package     Application
 * @author      Vallo Reima
 * @copyright   (C)2013
 */

function Group(fid)
  /*
   *  in: fid - form id
   */
  {
    var frm;        /* form object */
    var evs = [];   /* events stack */
    var mgr;        /* result message */
    var that = this;

    var Init = function() {
      /*
       * set events and view status
       */
      frm = new Forms(fid);
      frm.Init({groupf: Group});
      var a = $$('command', 'button');
      for (var i = 0; i < a.length; i++) {
        evs.push([a[i], 'click', Command]);
      }
      Events(true);
      TableEvent();
      var c = ts.inf.sts;
      if (c === '' || c === 'V') {
        if (c === '') {
          $('command').style.visibility = 'visible';
        } else {
          c = '';
        }
      }
      Switch(c);
    };

    var Group = function() {
      /*  
       * new group selected
       */
      var evt = [evs.pop()];
      Events(false, evt);
      Command('SL');
    };

    var Select = function(event) {
      /*  
       * fix row click
       */
      var trg = Target(event).parentNode;
      StopEvent((event));
      if (ts.inf.sts === 'V' && trg.tagName.toLowerCase() === 'tr' && trg.id) {
        var c = $(trg.id).className;
        if (c === 'slt') {
          $(trg.id).className = '';
        } else if (c !== 'dld') {
          $(trg.id).className = 'slt';
        }
        Switch('');
      }
    };

    var Selected = function() {
      /*  
       * check selections
       */
      var b = [];
      var a = $$('tabbody', 'tr');
      for (var i = 0; i < a.length; i++) {
        if (a[i].className === 'slt') {
          b.push(a[i].id);
        }
      }
      return b;
    };

    var Command = function(cmd)
      /*
       * process the command
       * in:  button event or command token
       */
      {
        var c, a;
        if (typeof cmd === 'object') {
          var trg = Target(cmd);
          StopEvent(cmd);
          c = trg.name;
        } else {
          c = cmd;
        }
        if (ts.xhr.bsy) {
        } else if (c.toUpperCase() === 'SL') { /* Select */
          c = c.toUpperCase() === c ? 'B' : 'b';
          a = {grp: frm.Get('groupf')};
          ts.xhr.Request({act: 'tbl', cmd: c, cnd: a}, Response);
        } else if (c === 'A') { /* Add */
          a = [''];
          if (frm.Get('groupf') !== '') {
            a.push(frm.Get('groupf'));
          }
          Groupts(a);
          ts.inf.cmd = 'A';
          Switch('E', 'addg');
        } else if (c === 'I') { /* Inherit */
          var a = ['', frm.Get('groupf')];
          Groupts(a);
          ts.inf.cmd = 'I';
          Switch('E', 'inhg');
        } else if (c === 'RM') { /* Remove */
          var s = ts.Get('rmvcfm').replace('#', Selected().length);
          if (confirm(s)) {
            ts.inf.cmd = 'RM';
            Edit(c);
          }
        } else if (c === 'S') { /* Save */
          c = ts.inf.cmd;
          Edit(c);
        } else if (c === 'CC') {  /* Cancel */
          Switch('');
        } else if (c === 'RP') { /* query */
          var evt = [evs.pop()];
          Events(false, evt);
          frm.Set('group_id', frm.Get('groupf'));
          $(fid + '_edt').className = 'hide';
          Hide();
          $(fid + '_qry').className = '';
          Switch('R', 'rptg');
        } else if (c === 'Q') { /* Query */
          a = {grp: frm.Get('group_id'), knd: frm.Get('kind')};
          ts.xhr.Request({act: 'tbl', cmd: 'R', cnd: a}, Response);
        } else if (c === 'CL') {  /* Close */
          $(fid + '_qry').className = 'hide';
          Hide();
          $(fid + '_edt').className = '';
          Switch('');
          Command('SL');
        }
      };

    var Groupts = function(exc) {
      /*  
       * form to-list options
       * in:  exc -- exclude values
       */
      var a = $('groupf').options;
      var b = $('groupt').options;
      b.length = 0;
      var j = 0;
      for (var i = 0; i < a.length; i++) {
        if (ArraySearch(a[i].value, exc) === false) {
          b[j] = new Option(a[i].innerHTML, a[i].value);
          j++;
        }
      }
      b[0].selected = 'selected';
      frm.Set('groupt');
    };

    var Hide = function() {
      /*  
       * hide current table
       */
      $('tabhead').style.visibility = 'hidden';
      var t = $('tabbody');
      var n = t.rows.length;
      for (var i = 0; i < n; i++) {
        t.deleteRow(-1);
      }
    };

    var Edit = function(cmd) {
      /* 
       * process the change command
       * in:  cmd -- command - A,I
       */
      if (frm.Get('opr') === 'M') {
        var a = $$('tabbody', 'tr');
        var b = [];
        for (var i = 0; i < a.length; i++) {
          b.push(a[i].id);
        }
      } else {
        b = Selected();
      }
      for (var i = 0; i < b.length; i++) {
        b[i] = b[i].replace('id', '');
      }
      a = frm.Gets();
      a = {grf: a.groupf.val, grt: a.groupt.val, opr: a.opr.val, ids: b};
      ts.xhr.Request({srv: 'grp', cmd: cmd, fld: a}, Response);
    };

    var Response = function(rlt, par) {
      /*  
       * async request return
       * in:  rlt -- result object
       *      par -- calling parameters
       */
      var c = '';
      if (par.srv === 'grp') {
        c = rlt.string;
        Close(rlt);
      } else if (par.cmd === 'R') {
        c = rlt.string;
        $('tables').innerHTML = rlt.factor;
      } else if (par.cmd.toUpperCase() === 'B') {
        c = par.cmd === 'B' ? rlt.string : mgr;
        $('tables').innerHTML = rlt.factor;
        TableEvent();
        Switch('');
      }
      $('msgraw').innerHTML = c;
    };

    var Close = function(rlt) {
      /*  
       * fix saving results
       * in:  rlt -- result object
       *      cmd -- command token 
       */
      var f = false;
      if (ts.inf.cmd === 'RM') {
        for (var i = 0; i < rlt.factor.length; i++) {
          $('id' + rlt.factor[i]).className = 'dld';
        }
      } else if (Number(rlt.factor[0]) > 0) {
        f = true;
      } else if (Number(rlt.factor[1]) > 0) {
        frm.Set('groupf', frm.Get('groupt'));
        f = true;
      }
      Switch('');
      if (f) {
        mgr = rlt.string;
        Command('sl');
      }
    };

    var Switch = function(sts, pmt) {
      /* 
       * switch edit/view/browse
       * in:  sts -- atatus (V,B,E)
       *      pmt -- status text
       */

      var dsa = [];
      if (sts === '') {
        frm.Enable(true, 'groupf');
        var shw = ['A', 'RM', 'I', 'RP'];
        if (frm.Get('groupf') === '') {
          dsa = ['RM', 'I'];
        }
        if (Empty(Selected())) {
          dsa.push('A', 'RM');
        }
        if (ts.inf.cmd !== '') {
          $$(fid, 'select')[1].className = 'hide';
          $$(fid, 'select')[2].className = 'hide';
          ts.inf.cmd = ''
        }
        ts.inf.sts = 'V';
      } else if (sts === 'R') {
        shw = ['Q', 'CL'];
        ts.inf.sts = 'R';
      } else if (sts === 'E') {
        frm.Enable(false, 'groupf');
        shw = ['CC'];
        shw.push(pmt === 'rptg' ? 'Q' : 'S');
        $$(fid, 'select')[1].className = '';
        $$(fid, 'select')[2].className = '';
        if (ts.inf.cmd === 'A' || !Empty(Selected())) {
          frm.Set('opr', '');
          var f = false;
        } else {
          f = true;
        }
        frm.Enable(f, 'opr');
        ts.inf.sts = sts;
      }
      if (!Empty(pmt)) {
        var c = ' > ' + ts.Get(pmt);
      } else if (Empty(sts)) {
        c = '';
      } else {
        c = null;
      }
      if (c !== null) {
        $('section').innerHTML = $('section').innerHTML.split(' ')[0] + c;
      }
      $('msgraw').innerHTML = '';
      var a = $$('command', 'button');
      for (var i = 0; i < a.length; i++) {
        a[i].disabled = ArraySearch(a[i].name, dsa) !== false;
        a[i].style.display = ArraySearch(a[i].name, shw) === false ? 'none' : '';
      }
    };

    var TableEvent = function() {
      /*  
       * table row click event
       */
      var evt = [$('tabbody'), 'click', Select];
      evs.push(evt);
      Events(true, [evt]);
    };

    that.Clear = function() {
      /*  
       * terminate
       */
      Events(false);
    };

    var Events = function(flg, evt) {
      /*  att/detach events
       * in:  flg -- true - att
       *             false - det
       *      evt -- specific events
       */
      var f = flg ? AttachEventListener : DetachEventListener;
      var e = evt ? evt : evs;
      for (var i in e) {
        f(e[i][0], e[i][1], e[i][2]);
      }
    };

    Init();
  }
