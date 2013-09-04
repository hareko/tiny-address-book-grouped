/**
 * editor/browser class
 *
 * @package     Application
 * @author      Vallo Reima
 * @copyright   (C)2013
 */

function Abook(fid)
  /*
   *  in: fid - form id
   */
  {
    var frm;        /* form object */
    var evs = [];   /* events stack */
    var rst = [];   /* reset values */
    var that = this;

    var Init = function() {
      /*
       * set events and view status
       */
      frm = new Forms(fid);
      frm.Init({fname: CnvName, lname: CnvName});
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

    var Command = function(event)
      /*
       * process the command
       * in:  button event
       */
      {
        var trg = Target(event);
        StopEvent(event);
        var c = trg.name;
        var id = frm.Get('id');
        if (ts.xhr.bsy) {
        } else if (c === 'A') { /* Add */
          var a = frm.Gets();
          for (c in a) {
            frm.Set(c, '');
          }
          Switch('E', 'addg');
        } else if (c === 'M') { /* Edit */
          if (Empty(id)) {
            s = 'addg';
          } else if (Number(id) > 0) {
            s = 'mdfg';
          } else {
            s = 'undg';
          }
          Switch('E', s);
        } else if (c === 'D') { /* Delete */
          if (confirm(ts.Get('delcfm'))) {
            Edit(c);
          }
        } else if (c === 'R') { /* Reset */
          for (var c in rst) {
            frm.Set(c, rst[c]);
          }
        } else if (c === 'CC') {  /* Cancel */
          Switch('');
        } else if (c === 'S') { /* Save */
          if (Empty(id)) {
            c = 'A';
          } else if (Number(id) > 0) {
            c = 'M';
          } else {
            c = 'U';
          }
          Edit(c);
        } else if (c === 'B') { /* Browse */
          ts.xhr.Request({act: 'tbl', cmd: 'B'}, Response);
        } else if (c === 'O') { /* Output */
          ts.xhr.Request({act: 'tbl', cmd: 'O'}, Response);
        } else if (c === 'CL') {  /* Close */
          Close();
        }
      };

    var Edit = function(cmd) {
      /* 
       * process the change command
       * in:  cmd -- command - A,D,M,U
       */
      var f = '';
      var a = frm.Gets();
      var fld = {};
      for (var c in a) {
        if (c !== 'id' && IsBlank(a[c].val)) {
          f = ts.Get('msd');
          frm.SetError(c, f);
        } else {
          frm.SetError(c, '');
        }
        fld[c] = frm.Get(c);
      }
      $('msgraw').innerHTML = f;
      if (f === '') {
        ts.xhr.Request({srv: 'cts', cmd: cmd, fld: fld}, Response);
      }
    };

    var Select = function(event) {
      /*  
       * row doubleclick
       */
      var trg = Target(event).parentNode;
      StopEvent((event));
      if (trg.tagName.toLowerCase() === 'tr') {
        var id = trg.id.replace('id', '');
        ts.xhr.Request({srv: 'cts', cmd: 'S', fld: {id: id}}, Response);
      }
    };

    var Response = function(rlt, par) {
      /*  
       * async request return
       * in:  rlt -- result object
       *      par -- calling parameters
       */
      var c = '';
      if (par.srv === 'cts') {
        c = rlt.string;
        if (par.cmd === 'S') {
          Close(rlt.factor);
        } else {
          frm.Set('id', rlt.factor);
          Switch('');
        }
      } else if (par.cmd === 'B') {
        c = '';
        $('tables').innerHTML = rlt.factor;
        TableEvent();
        $(fid).style.display = 'none';
        $('tables').style.display = 'block';
        Switch('B', 'brng');
      } else if (par.cmd === 'O') {
        c = rlt.string;
        $('filename').value = rlt.factor.fnm;
        $('workfile').value = rlt.factor.wkf;

        $('transit').submit();
      }
      $('msgraw').innerHTML = c;
    };

    var Close = function(row) {
      /*  
       * close browsing, update fields
       * in:  row -- selected row
       */
      var evt = [evs.pop()];
      Events(false, evt);
      $('tables').style.display = 'none';
      $(fid).style.display = '';
      if (row) {
        for (var c in row) {
          frm.Set(c, row[c]);
          frm.SetError(c, '');
        }
      }
      Switch('');
    };

    var Switch = function(sts, pmt) {
      /* 
       * switch edit/view/browse
       * in:  sts -- status token (V,B,E)
       *      pmt -- status text
       */

      var dsa = [];
      if (sts === '') {
        var shw = ['A', 'D', 'M', 'B'];
        var id = frm.Get('id');
        if (id === '' || Number(id) < 0) {
          dsa = ['D'];
        }
        ts.inf.sts = 'V';
      } else if (sts === 'B') {
        shw = ['O', 'CL'];
        ts.inf.sts = 'B';
      } else {
        var a = frm.Gets();
        for (var c in a) {
          rst[c] = frm.Get(c);
        }
        shw = ['R', 'CC', 'S'];
        ts.inf.sts = 'E';
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
      frm.Enable(sts !== '');
      var a = $$('command', 'button');
      for (var i = 0; i < a.length; i++) {
        a[i].disabled = ArraySearch(a[i].name, dsa) !== false;
        a[i].style.display = ArraySearch(a[i].name, shw) === false ? 'none' : '';
      }
      if (ts.inf.sts === 'E') {
        $('fname').focus();
      }
    };

    var TableEvent = function() {
      /*  
       * table row double click event
       */
      var evt = [$('tabbody'), 'dblclick', Select];
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

    var CnvName = function(id)
      /*
       * normalise person name
       * in:  id - name id
       */ {
        var c = NormName(frm.Get(id));
        frm.Set(id, c);
      };

    Init();
  }
