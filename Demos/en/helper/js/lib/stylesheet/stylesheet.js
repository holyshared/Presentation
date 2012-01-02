/*
---
name: StyleSheet

description: API to a style sheet is offered. 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Array
  - Core/Function
  - Core/Object
  - Core/Element
  - Core/DOMReady

provides:
  - StyleSheet
...
*/
(function(){

var stylesheets = {};

var StyleSheet = this.StyleSheet = (function StyleSheet(){
    this._styles = stylesheets;
});

StyleSheet.implement({

    setStyle: function(styleName){
        var disable = true;
        Object.each(this._styles, function(element, key){
            disable = (key != styleName) ? true : false;
            element.set('disabled', disable);
        });
    },

    hasStyle: function(styleName){
        if (!this._styles[styleName]){
            return false;
        }
        return true;
    },

    getStyleNames: function(){
        return Object.keys(this._styles);
    },

    getLength: function(){
        return Object.getLength(this._styles);
    }

});

Object.append(StyleSheet, {
    
    setup: function(){
        var head = $(document).getElement('head'),
            style = $(head).getElement('link[rel*=stylesheet][title!=""]'),
            styles = $(head).getElements('link[rel*=alternate][title!=""]');

        styles.unshift(style);

        stylesheets = styles.associate(styles.get('title'));
    }

});

this.addEvent('domready', StyleSheet.setup);

}.call(this));