/**
 * common functions/classes
 *
 * @package     Application
 * @author      Vallo Reima
 * @copyright   (C)2013
 */

function Forms(fid)
  /*
   *  form fields processing class
   *  in: fid - form id
   */
  {
    var fields = {};  /* field properties */
    var that = this;

    /* constructor */
    that.Init = function(flds) {
      var dfe = $(fid).elements;
      for (var i = 0; i < dfe.length; i++) {
        var id = dfe[i].id;
        if (id) {
          fields[id] = {
            obj: dfe[i],
            tpe: dfe[i].type.toLowerCase(),
            err: '',
            val: dfe[i].value
          };
          var lbl = $('l_' + id);
          if (lbl) {
            fields[id].lbl = lbl;
          }
          if (IsSet(flds[id])) {
            fields[id].fnc = flds[id];
          }
        }
      }
      Events(true);
    };

    that.Term = function() {
      Events(false);
    };

    Events = function(flg) {
      var fnc = flg ? AttachEventListener : DetachEventListener;
      for (var id in fields) {
        if (fields[id].tpe === 'button') {
          var evt = 'click';
        } else if (fields[id].tpe !== 'hidden') {
          evt = 'change';
        } else {
          evt = '';
        }
        if (evt !== '') {
          fnc(fields[id].obj, evt, GetEvent);
        }
      }
    };

    that.Gets = function() {
      return fields;
    };

    that.Get = function(id) {
      return fields[id].val;
    };

    that.Set = function(id, val) {
      SetValue(id, val);
    };

    that.SetError = function(id, flg) {
      fields[id].err = flg ? flg : '';
      ErrFlag(id, flg);
    };

    that.Enable = function(flg, fld)
      /*
       * enable/disable form element
       * in:  flg -- true - enable
       *      fld -- field list
       */
      {
        if (!fld) {
          var a = ArrayKeys(fields);
        } else if (!IsArray(fld)) {
          a = [fld];
        } else {
          a = fld;
        }
        for (var i=0; i < a.length; i++) {
          EnaDisa(fields[a[i]].obj, flg);
        }
      };

    var EnaDisa = function(obj, flg)
      /*
       * enable/disable form element
       * in:  obj -- element object
       *      flg -- true - enable
       */
      {
        if (flg === true) {
          obj.removeAttribute('disabled');
          obj.disabled = false;
        } else {
          obj.setAttribute('disabled', 'disabled');
          obj.disabled = true;
        }
      };

    var GetEvent = function(event)
      /*
       * process field chage/click
       * in: event object
       */
      {
        var trg = Target(event);
        if (trg.tagName.toLowerCase() === 'img') {
          trg = trg.parentNode; /* Chrome, Safari */
        }
        var id = trg.id;
        if (fields[id].tpe !== 'button') {
          SetValue(id);
        }
        if (fields[id].lbl) {
          ErrFlag(id);
        }
        if (fields[id].fnc) {
          fields[id].fnc(id);
        }
        StopEvent(event);
      };

    var SetValue = function(id, val)
      /*
       * Setting field value
       * in: id - field id
       *      val - value (if not set, take from obj)
       */
      {
        if (fields[id].tpe.indexOf('select') + 1) {
          var c = IsSet(val) ? val : fields[id].obj.options[fields[id].obj.selectedIndex].value;
          var k = -1;
          fields[id].idx = -1;
          for (var i = 0; i < fields[id].obj.options.length; i++) {
            if (fields[id].obj.options[i].value === c) {
              fields[id].idx = i;
              fields[id].obj.options[i].setAttribute('selected', 'selected');
            } else if (fields[id].obj.options[i].value === fields[id].val) {
              fields[id].obj.options[i].removeAttribute('selected');
            }
            if (fields[id].obj.options[i].value === '') {
              k = i;
            }
          }
          if (fields[id].idx === -1) {
            c = '';
            fields[id].idx = k === -1 ? 0 : k;
          }
          fields[id].obj.selectedIndex = 0;  /* FF mess */
          fields[id].obj.selectedIndex = fields[id].idx;
          /* setTimeout(function(){
           fields[id].obj.selectedIndex = fields[id].idx;
           },100); */
          fields[id].val = c;
          fields[id].txt = fields[id].obj.options[fields[id].idx].text;
        }else if (fields[id].tpe === 'checkbox') {
          var c = IsSet(val) ? !Empty(val) : fields[id].obj.checked;
          fields[id].val = c;
          fields[id].obj.checked = c;
          if (c) {
            fields[id].obj.setAttribute('checked', 'checked');
          } else {
            fields[id].obj.removeAttribute('checked');
          }
        } else if (fields[id].tpe !== 'button') {
          fields[id].val = Trim(IsSet(val) ? val + '' : fields[id].obj.value);
          if (IsBlank(fields[id].val)) {
            fields[id].val = '';
          }
          fields[id].obj.setAttribute('value', fields[id].val);
          fields[id].obj.value = fields[id].val;
        }
      };

    var ErrFlag = function(id, flg)
      /* set field error flag
       * in: id - field id
       *     flg -- empty - ok
       *            else error
       */
      {
        if (fields[id].lbl) {
          if (Empty(flg)) {
            fields[id].lbl.style.color = '';
          } else {
            fields[id].lbl.style.color = 'red';
          }
        }
      };
  }

function ShowCommand(tkn, flg, id)
  /*
   * hide (disable) command
   * in:  tkn -- token
   *      flg -- null - hide
   *             false - disable
   *             true - restore
   *      id -- set id
   */
  {
    var a = $$((IsSet(id) ? id : 'command'), 'button');
    var b = IsArray(tkn) ? tkn : [tkn];
    for (var i = 0; i < a.length; i++) {
      if (ArraySearch(a[i].name, b) !== false) {
        a[i].style.display = (flg === null ? 'none' : 'inline');
        a[i].disabled = (flg === false);
      }
    }
  }

function NormName(nme)
  /*
   * normalise person name
   * in:  nme - name entered
   * out: normalized
   */ {
    var c = '';
    if (!IsBlank(nme)) {
      var s = nme.indexOf('-') + 1 ? '-' : ' ';
      var a = Trim(nme).split(s);
      for (var i = 0; i < a.length; i++) {
        c += s + ucfirst(a[i].toLowerCase());
      }
      c = c.substr(1);
    }
    return c;
  }

function EmbedSS(type, txt, name, name0)
  /* embed javascript/stylesheet
   * in: type - js/css
   *     txt - JS text
   *     name - slot name
   *     name0 - replace slot name
   */
  {
    var div = $$(document, 'head')[0];
    var obj = $(type + name0);
    if (obj) {
      div.removeChild(obj);
    }
    if (type === 'js') {
      obj = CreateJS(txt);
    } else if (type === 'css') {
      obj = CreateCSS(txt);
    } else {
      return;
    }
    obj.setAttribute('id', type + name);
    div.appendChild(obj);
  }

function CreateJS(txt)
  /* create javascript node
   * in: JS text
   *     id - tag id
   */
  {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    if (typeof script.canHaveChildren === 'boolean') { /* IE problem solution */
      script.text = txt;
    } else {
      script.appendChild(document.createTextNode(txt));
    }
    return script;
  }

function CreateCSS(txt)
  /* create style node
   * in: JS text
   *     id - tag id
   */
  {
    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    if (style.styleSheet) {                          /* IE problem solution */
      style.styleSheet.cssText = txt;
    } else {
      style.appendChild(document.createTextNode(txt));
    }
    return style;
  }

function XHRJSON(ops)
  /*
   * AJAX communications class
   * in:  ops -- url -  request URL
   *             lng - language 
   *             pmt - meter field object
   *             txt - meter text
   *             err - XHR error text
   */
  {
    var obj;  /* request object */
    var tck = [null, ''];  /* meter ticker */
    var that = this;
    that.bsy = false;

    that.Request = function(par, fnc)
      /*
       * post request
       * in:  par -- sending parametera
       *      fnc -- fnc - callback
       */
      {
        that.bsy = true;
        var asn = fnc ? true : false;
        obj = GetHTTPObject();
        if (asn) {
          obj.onreadystatechange = function() {
            if (obj.readyState === 4) {
              MeterOff();
              var r = Response();
              if (r) {
                fnc(r, par);
              }
            }
          };
        }
        tck[0] = setInterval(MeterOn, 200);
        obj.open('POST', ops.url, asn);
        obj.setRequestHeader("Content-Type", "application/json");
        obj.send(Data(par));
        if (!asn) {
          MeterOff();
          return Response();
        }
      };

    var MeterOn = function() {
      tck[1] += '.';
      if (tck[1].length > 3) {
        tck[1] = '';
      }
      ops.pmt.innerHTML = ops.txt + Pad(tck[1], 3, '&nbsp;');
    };

    var MeterOff = function() {
      clearInterval(tck[0]);
      ops.pmt.innerHTML = '';
    };

    var Data = function(par)
      /*
       * form request parameters
       * in:  par - caller params
       */
      {
        var prm = par;
        prm.lng = ops.lng;
        return ts.Enc(prm);
      };

    var Response = function() {
      if (obj.status === 200 || obj.status === 304) {
        var rlt = obj.responseText;
        var r = ts.Dec(rlt);
        if (Empty(r)) {
          r = null;
          if (!Empty(rlt)) {
            document.body.innerHTML = rlt;
          } else {
            ops.pmt.innerHTML = ops.err;
          }
        } else if (typeof r === 'object' && r.code && r.code !== 'ok') {
          ops.pmt.innerHTML = r.string;
          r = false;
        }
      } else {
        r = null;
      }
      obj = null;
      that.bsy = false;
      return r;
    };
  }
