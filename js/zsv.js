Zepto(function(z) {
  "use strict";
  // Private
  var _funcList = [] // Store discovered Zepto funcs
  , maxOptions = 10 // max results for autocomplete
  , isScrollable = true // autocomplete scroll bar

  /**
   * _getFuncList - find all funcs defined under Zepto
   */
  , _getFuncList = function(obj) {
    if (!obj || (typeof obj !== 'function' && typeof obj !== 'object')) {
      return;
    } 
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'function' && _funcList.indexOf(key) === -1) {
          _funcList.push(key);
        } else if (typeof obj[key] === 'object') {
          _getFuncList(obj[key]);
        }
      }
    }
    return _funcList;
  }

  /**
   * _addAutoCompleteToFuncText - initialize auto complete
   */
  , _addAutoCompleteToFuncText = function() {
    z('#funcText').autoComplete({'data': _funcList,
                                 'maxOptions': maxOptions,
                                 'scrollable': isScrollable,
                                 'containerClass': 'autoCompleteContainer',
                                 'resultClass': 'autoCompleteResult'
                                }
                               );
  }

  /**
   * _updateFuncDefn - update markup with new function definition
   */
  , _updateFuncDefn = function(fName) {
    var funcDefn
    , funcDOM
    ;
    funcDefn = _getFuncDefn(fName);
    if (funcDefn) {
      funcDOM = document.createElement('div');
      // Prettify
      funcDefn = js_beautify(funcDefn, {  // jshint camelcase:false
        'indent_size': 2
      });
      funcDOM.innerHTML = "<pre><code data-language='javascript'>" + funcDefn + "</code></pre>";
      // Rainbow needs an actual DOM element and not Zepto elem
      Rainbow.color(funcDOM, function() {
        z('#funcDefn').empty();
        z('#funcDefn').append(funcDOM);
      });
      // Update Name
      z('#funcName').empty();
      z('#funcName').append('<p>Function: <strong>'+fName+'</strong></p>');
    } else {
      funcDOM = z("<p>Could not find a matching definition for <strong>"+fName+"</strong></p>");
      z('#funcDefn').empty();
      z('#funcDefn').append(funcDOM);
      // Clear Name
      z('#funcName').empty();
    }
  }

  /**
   * _addKeyHandlerToFuncText - event handler to intercept 'Enter' key
   */
  , _addKeyHandlerToFuncText = function() {
    z('#funcText').keyup(function(event){
      if (event.keyCode !== 13) {
        return;
      }
      _updateFuncDefn(z(this).val());
    });
  }

  /**
   * _getFuncStr - return function toString
   */
  , _getFuncStr = function(fName, parentObj) {
    if (typeof parentObj[fName] === 'function') {
      return parentObj[fName].toString();
    } else {
     return '';
    }
  }

  /**
   * _getFuncDefn - find out function definition
   * TODO: Dirty hack as of now, fix me
   */
  , _getFuncDefn = function(fName) {
    if (!fName || !z) {
      return '';
    } 
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

  /**
   * _addMouseDownHandlerToAutoCompleteResult
   */
  ,_addMouseDownHandlerToAutoCompleteResult = function() {
    z('.autoCompleteContainer').on('mousedown', '.autoCompleteResult', function(){
      _updateFuncDefn(z(this).html().trim());
      return true;
    });
  }

  /**
   * _init - setup the page for browsing zepto source code
   */
  , _init = function() {
    _getFuncList(z);
    _addAutoCompleteToFuncText();
    _addKeyHandlerToFuncText();
    _addMouseDownHandlerToAutoCompleteResult();
    z('#funcText').focus();
  }
  ;

  // Call _init
  _init();
});
