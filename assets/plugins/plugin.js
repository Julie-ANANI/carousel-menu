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

    var VK = tinymce.util.VK;

    /**
     * Object that is used to replace the variable string to be used
     * in the HTML view
     * @type {object}
     */
    var mapper = editor.getParam("variable_mapper", {});

    /**
     * define a list of variables that are allowed
     * if the variable is not in the list it will not be automatically converterd
     * by default no validation is done
     * @todo  make it possible to pass in a function to be used a callback for validation
     * @type {array}
     */
    var valid = editor.getParam("variable_valid", null);

    /**
     * Prefix and suffix to use to mark a variable
     * @type {RegExp}
     */
    var stringVariableRegex = new RegExp(/\*\|([A-Z. _]*)\|\*/, 'g');

    /**
     * check if a certain variable is valid
     * @param {string} name
     * @return {bool}
     */
    function isValid( name )
    {

        if( ! valid || valid.length === 0 )
            return true;

        var validString = '|' + valid.join('|') + '|';

        return validString.indexOf( '|' + name + '|' ) > -1 ? true : false;
    }

    function getMappedValue( cleanValue ) {
        if(typeof mapper === 'function')
            return mapper(cleanValue);

        return mapper.hasOwnProperty(cleanValue) ? mapper[cleanValue] : cleanValue;
    }

    /**
     * Strip variable to keep the plain variable string
     * @example "{test}" => "test"
     * @param {string} value
     * @return {string}
     */
    function cleanVariable(value) {
        return value.replace(/[^a-zA-Z0-9._]/g, "");
    }

    /**
     * convert a text variable "x" to a span with the needed
     * attributes to style it with CSS
     * @param  {string} value
     * @return {string}
     */
    function createHTMLVariable( value ) {

        var cleanValue = cleanVariable(value);

        // check if variable is valid
        if( ! isValid(cleanValue) )
            return value;

        var cleanMappedValue = getMappedValue(cleanValue);

        editor.fire('variableToHTML', {
            value: value,
            cleanValue: cleanValue
        });

        var variable = cleanValue;
        return '<span style="color:#0B90C6; background-color: #CCEBF8; padding: 4px 10px; font-size: 12px; border-radius: 3px; margin-left: 2px; margin-right: 4px;" data-original-variable="' + variable + '" contenteditable="false">' + cleanMappedValue + '</span>';
    }

    /**
     * convert variable strings into html elements
     * @return {void}
     */
    function stringToHTML()
    {
        var nodeList = [],
            nodeValue,
            node,
            div;

        // find nodes that contain a string variable
        tinymce.walk(editor.getBody(), function(n) {
            if (n.nodeType == 3 && n.nodeValue && stringVariableRegex.test(n.nodeValue)) {
                nodeList.push(n);
            }
        }, 'childNodes');

        // loop over all nodes that contain a string variable
        for (var i = 0; i < nodeList.length; i++) {
            nodeValue = nodeList[i].nodeValue.replace(stringVariableRegex, createHTMLVariable);
            div = editor.dom.create('div', null, nodeValue);
            while ((node = div.lastChild)) {
                editor.dom.insertAfter(node, nodeList[i]);

                if(isVariable(node)) {
                    var next = node.nextSibling;
                    editor.selection.setCursorLocation(next);
                }
            }

            editor.dom.remove(nodeList[i]);
        }
    }

    /**
     * insert a variable into the editor at the current cursor location
     * @param {string} value
     * @return {void}
     */
    function addVariable(value) {
        var htmlVariable = createHTMLVariable(value);
        editor.execCommand('mceInsertContent', false, htmlVariable);
    }

    function isVariable(element) {
        if(typeof element.getAttribute === 'function' && element.hasAttribute('data-original-variable'))
            return true;

        return false;
    }

    /**
     * Trigger special event when user clicks on a variable
     * @return {void}
     */
    function handleClick(e) {
        var target = e.target;

        if(!isVariable(target))
            return null;

        var value = target.getAttribute('data-original-variable');
        editor.fire('variableClick', {
            value: cleanVariable(value),
            target: target
        });
    }

    editor.on('nodechange', stringToHTML );
    editor.on('keyup', stringToHTML );
    editor.on('click', handleClick);

    this.addVariable = addVariable;

});
