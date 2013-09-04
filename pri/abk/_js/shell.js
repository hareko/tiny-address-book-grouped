/**
 * dispatcher 
 *
 * @package     Application
 * @author      Vallo Reima
 * @copyright   (C)2013
 */

function Shell() {

  var plo = {};   /* the panels object */
  var itm = null; /* active menu item object */
  var pmt;        /* prompts object */
  var evs = [];   /* events stack */

  var Init = function() {
    /*
     * set events and view status
     */
    ts = new Transit(); /* activate commons */
    ts.inf = {act: '', sts: ''};
    pmt = $('msgraw');
    ts.xhr = new XHRJSON({
      url: ts.Get('url'),
      lng: ts.Get('lng'),
      pmt: pmt,
      txt: ts.Get('prpmt'),
      err: ts.Get('noxhr')});
    var btn = $$('menu', 'button');
    for (var i = 0; i < btn.length; i++) {
      evs.push([btn[i], 'click', Command]);
    }
    Events(true);
  };

  var Command = function(event)
    /*
     * process the command
     * in:  button event or command token
     */
    {
      var trg = Target(event);
      StopEvent(event);
      var sct = trg.innerHTML;
      var act = trg.name;
      if (ts.xhr.bsy) {
      } else if (act === 'end') { /* finish */
        Finish();
      } else if (ts.inf.act !== act) { /* panel */
        if (plo[ts.inf.act]) {
          SaveContent();
        }
        if (plo[act]) {
          RestoreContent(act);
        } else {
          ts.xhr.Request({srv: 'shl', mod: act, sct: sct}, LoadContent);
        }
      }
    };

  var Finish = function() {
    /*  
     * terminate, checking active panels
     */
    if (plo[ts.inf.act]) {
      plo[ts.inf.act].sts = ts.inf.sts;
    }
    var flg = true;
    for (var c in plo) {
      if (plo[c].sts === 'E') {
        SaveContent();
        RestoreContent(c);
        flg = false;
      }
    }
    if (flg || confirm(ts.Get('edtcfm'))) {
      if (itm) {
        itm.Clear();
        itm = null;
      }
      var r = ts.xhr.Request({act: 'end'});
      if (r) {
        Events(false);
        document.body.innerHTML = r.factor;
      }
    }
  };

  var SaveContent = function() {
    /* 
     * save and clear current panel
     */
    var c = ts.inf.act;
    var o = $$(document, 'head')[0];
    itm.Clear();
    itm = null;
    plo[c].sct = $('section').innerHTML;
    plo[c].pmt = pmt.innerHTML;
    plo[c].sts = ts.inf.sts;
    plo[c].cmd = ts.inf.sts;
    plo[c].htm = $('content').innerHTML;
    plo[c].css = $('css' + c).innerHTML;
    o.removeChild($('css' + c));
    plo[c].js = $('js' + c).innerHTML;
    o.removeChild($('js' + c));
    $('content').innerHTML = '';
  };

  var RestoreContent = function(c) {
    /* 
     * save current panel
     * in:  c -- action token
     */
    $('section').innerHTML = plo[c].sct;
    $('content').innerHTML = plo[c].htm;
    EmbedSS('css', plo[c].css, c);
    EmbedSS('js', plo[c].js, c);
    ts.inf.sts = plo[c].sts;
    ts.inf.cmd = plo[c].cmd;
    ts.inf.act = c;
    var f = eval(plo[c].fnc);
    itm = new f(c);
    pmt.innerHTML = plo[c].pmt;
  };

  var LoadContent = function(rlt, par) {
    /* 
     * load new panel
     * in:  rlt -- data to load
     *      par -- call pars
     */
    var c = par.mod;
    plo[c] = {fnc: rlt.string};
    ts.inf.sts = '';
    ts.inf.act = c;
    pmt.innerHTML = '';
    $('section').innerHTML = par.sct;
    var a = rlt.factor;
    $('content').innerHTML = a.htm;
    EmbedSS('css', a.css, c);
    EmbedSS('js', a.js, c);
    if (ts.Get('dev')) {
      eval(a.js);
    }
    var f = eval(plo[c].fnc);
    itm = new f(c);
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
