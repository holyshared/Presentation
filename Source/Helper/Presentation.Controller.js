/*
---
name: Presentation.Controller

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Presentation/Presentation.Helper

provides:
  - Presentation.Controller
...
*/

(function($, Presentation){

Presentation.Slide.implement({
	options: {
		controller: {
			first: 'first',
			prev: 'prev',
			next: 'next',
			last: 'last'
		}
	}
});

Presentation.Controller = new Class({

	Extends: Helper.HelperObject,

	_name: 'controller',
	_keys: [ 'first', 'prev', 'next', 'last' ],
	_methods: {
		first: 'first',
		prev: 'prev',
		next: 'next',
		last: 'last'
	},
	_handlers: {},

	setup: function(){
		var container = this.getTarget().getContainer();
		this._keys.each(function(key){
			this['_' + key] = container.getElement('.' + this.options[key]);
		}, this);
		this._createHandlers();
	},

	enable: function(){
		this._keys.each(function(key){
			this['_' + key].addEvent('click', this._getHandler(key));
		}, this);
	},

	disable: function(){
		this._keys.each(function(key){
			this['_' + key].removeEvent('click', this._getHandler(key));
		}, this);
	},

	_getHandler: function(key){
		return this._handlers[key];
	},

	_createHandlers: function(){
		this._keys.each(function(key){
			this._handlers[key] = this._createHandler(key);
		}, this);
		return this._handlers;
	},

	_createHandler: function(key){
		var that = this;
		return function(event){
			that.delegate(key);
		};
	}

});


Presentation.addInitializer(function(slide) {
	var opts = slide.options;
	if (!opts.controller) {
		return;
	}
	slide.addHelper(new Presentation.Controller(opts.controller));
});

}(document.id, Presentation));