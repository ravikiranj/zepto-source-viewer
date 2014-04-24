Zepto(function(z) {
  // Private

  var _funcList = []
  , _modList = []
  , maxOptions = 10
  , isScrollable = true

  , _getFuncList = function(obj) {
    if (!obj || (typeof obj !== 'function' && typeof obj !== 'object')) {
      return;
    } 
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'function' && _funcList.indexOf(key) == -1) {
          _funcList.push(key);
        } else if (typeof obj[key] === 'object') {
          _getFuncList(obj[key]);
        }
      }
    }
    return _funcList;
  }

  , _getZeptoModules = function(obj) {
    for (var key in z) {
      if (typeof z[key] === 'function' && _modList.indexOf(key) == -1) {
        _modList.push(key); 
      }
    }
    return _modList;
  }

  , _addAutoCompleteToFuncText = function() {
    z('#funcText').autoComplete({'data': _funcList,
                                 'maxOptions': maxOptions,
                                 'scrollable': isScrollable}
                               );
  }

  , _addKeyHandlerToFuncText = function() {
    z('#funcText').keyup(function(event){
      if (event.keyCode !== 13) {
        return;
      }
      var elem = z(this)
      , fName = elem.val()
      , funcDefn
      , funcDOM
      ;
      //console.log(fName);
      funcDefn = _getFuncDefn(fName);
      if (funcDefn) {
        funcDOM = document.createElement('div');
        funcDOM.innerHTML = "<pre><code data-language='javascript'>" + funcDefn + "</code></pre>";
        // Rainbow needs an actual DOM element and not Zepto elem
        Rainbow.color(funcDOM, function() {
          z('#funcDefn').empty();
          z('#funcDefn').append(funcDOM);
        });
        // Update Name
        z('#funcName').empty();
        z('#funcName').append('<p>Function: '+fName+'</p>')
      } else {
        funcDOM = z("<p>Could not find a matching definition for <strong>"+fName+"</strong></p>");
        z('#funcDefn').empty();
        z('#funcDefn').append(funcDOM);
        // Clear Name
        z('#funcName').empty();
      }
    });
  }

  , _getFuncStr = function(fName, parentObj) {
    if (typeof parentObj[fName] === 'function') {
      return parentObj[fName].toString();
    } else {
     return '';
    }
  }

  , _getFuncDefn = function(fName) {
    if (!fName || !z) {
      return '';
    } 
    /**
     * Dirty hack for now, TODO: fix me !
     */
    // Check if it exists under z
    if (fName in z) {
      return _getFuncStr(fName, z);
    }
    // Check if it exists under z.fn
    if (fName in z.fn) {
      return _getFuncStr(fName, z.fn);
    }
    return '';
  }

  , _init = function() {
    _getFuncList(z);
    _getZeptoModules();
    _addAutoCompleteToFuncText();
    _addKeyHandlerToFuncText();
    z('#funcText').focus();
    //console.log(_modList);
    //console.log(_funcList);
  }
  ;
  _init();
});
