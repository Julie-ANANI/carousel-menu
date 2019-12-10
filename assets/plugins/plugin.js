/**
 * plugin.js
 *
 * Copyright, BuboBox
 * Released under MIT License.
 *
 * License: https://www.bubobox.com
 * Contributing: https://www.bubobox.com/contributing
 */

/*global tinymce:true */

tinymce.PluginManager.add('variable', function(editor) {

  /**
   * Object that is used to replace the variable string to be used
   * in the HTML view
   * @type {object}
   */
  const mapper = editor.getParam("variable_mapper", {});

  /**
   * define a list of variables that are allowed
   * if the variable is not in the list it will not be automatically converterd
   * by default no validation is done
   * @todo  make it possible to pass in a function to be used a callback for validation
   * @type {array}
   */
  const valid = editor.getParam("variable_valid", null);

  /**
   * Prefix and suffix to use to mark a variable
   * @type {string}
   */
  const stringVariableRegex = new RegExp(/\*\|([A-Z. _]*)\|\*/, 'g');

  /**
   * check if a certain variable is valid
   * @param {string} name
   * @return {bool}
   */
  const isValid = name => {
    return !valid || !valid.length || valid.indexOf(name) > -1;
  };

  const getMappedValue = cleanValue => {
    if(typeof mapper === 'function')
      return mapper(cleanValue);

    return mapper.hasOwnProperty(cleanValue) ? mapper[cleanValue] : cleanValue;
  };

  /**
   * Strip variable to keep the plain variable string
   * @example "{test}" => "test"
   * @param {string} value
   * @return {string}
   */
  const cleanVariable = value => {
    return value.replace(/[^a-zA-Z0-9._]/g, "");
  };

  /**
   * convert a text variable "x" to a span with the needed
   * attributes to style it with CSS
   * @param  {string} value
   * @return {string}
   */
  const createHTMLVariable = value => {

    const cleanValue = cleanVariable(value);

    // check if variable is valid
    if( !isValid(cleanValue))
      return value;

    const cleanMappedValue = getMappedValue(cleanValue);

    editor.fire('variableToHTML', {
      value: value,
      cleanValue: cleanValue
    });

    return `<span style="color:#0B90C6; background-color: #CCEBF8; padding: 4px 10px; font-size: 12px; border-radius: 3px; margin-left: 2px; margin-right: 4px; margin-bottom: 4px;" data-original-variable="${cleanValue}" contenteditable="false">${cleanMappedValue}</span>`;
  };

  /**
   * convert variable strings into html elements
   * @return {void}
   */
  const stringToHTML = () => {

    const nodeList = [];
    let nodeValue;
    let node;
    let div;

    // find nodes that contain a string variable
    tinymce.walk(editor.getBody(), n => {
      if (n.nodeType == 3 && n.nodeValue && stringVariableRegex.test(n.nodeValue)) {
        nodeList.push(n);
      }
    }, 'childNodes');

    // loop over all nodes that contain a string variable
    for (let i = 0; i < nodeList.length; i++) {
      nodeValue = nodeList[i].nodeValue.replace(stringVariableRegex, createHTMLVariable);
      div = editor.dom.create('div', null, nodeValue);
      while ((node = div.lastChild)) {
        editor.dom.insertAfter(node, nodeList[i]);

        if(isVariable(node)) {
          let next = node.nextSibling;
          editor.selection.setCursorLocation(next);
        }
      }

      editor.dom.remove(nodeList[i]);
    }
  };

  /**
   * insert a variable into the editor at the current cursor location
   * @param {string} value
   * @return {void}
   */
  const addVariable = value => {
    const htmlVariable = createHTMLVariable(value);
    editor.execCommand('mceInsertContent', false, htmlVariable);
  };

  const isVariable = element => {
    return typeof element.getAttribute === 'function' && element.hasAttribute('data-original-variable');
  };

  /**
   * Trigger special event when user clicks on a variable
   * @return {void}
   */
  const handleClick = e => {
    const target = e.target;

    if(!isVariable(target))
      return null;

    const value = target.getAttribute('data-original-variable');
    editor.fire('variableClick', {
      value: cleanVariable(value),
      target: target
    });
  };

  editor.on('keyup', stringToHTML );
  editor.on('setcontent', stringToHTML );
  editor.on('click', handleClick);

  this.addVariable = addVariable;

});
